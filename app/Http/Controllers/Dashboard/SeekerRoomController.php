<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Rating;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SeekerRoomController extends Controller
{
    public function show(Request $request, Room $room): Response
    {
        $room->load([
            'city:id,name',
            'owner:id,name',
            'rentals' => fn ($query) => $query->with('renter:id,name')->orderBy('starts_at'),
        ]);

        $currentUserRental = $room->rentals
            ->firstWhere('renter_id', $request->user()->id);
        $tenantApproved = $request->user()->tenant_approved_at !== null;
        $currentUserPendingRequest = BookingRequest::query()
            ->where('room_id', $room->id)
            ->where('renter_id', $request->user()->id)
            ->where('status', 'pending')
            ->latest('id')
            ->first();

        // Get landlord ratings
        $landlord = $room->owner;
        $ratingsReceived = $landlord->ratingsReceived()
            ->with('rater')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn (Rating $rating): array => [
                'id' => $rating->id,
                'rater_name' => $rating->rater->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'type' => $rating->type,
                'created_at' => $rating->created_at->toISOString(),
            ]);

        return Inertia::render('dashboard/seeker-room-show', [
            'room' => [
                'id' => $room->id,
                'title' => $room->title,
                'description' => (string) $room->description,
                'city' => (string) $room->city?->name,
                'addressLine1' => (string) $room->address_line_1,
                'addressLine2' => (string) $room->address_line_2,
                'postalCode' => (string) $room->postal_code,
                'sizeLabel' => (string) $room->size_label,
                'listingType' => (string) $room->listing_type,
                'facilities' => is_array($room->facilities) ? $room->facilities : [],
                'volunteerHelpNeeded' => is_array($room->volunteer_help_needed) ? $room->volunteer_help_needed : [],
                'matchPercentage' => $this->calculateMatchPercentage($request->user(), $room),
                'ownerName' => (string) $room->owner?->name,
                'ownerId' => $room->owner_id,
                'pricePerNight' => $room->pricePerNightLabel(),
                'pricePeriod' => (string) $room->price_period,
                'image' => $room->catalogImage(),
                'tags' => $room->catalogHighlights(),
            ],
            'landlordRating' => [
                'averageRating' => round($landlord->averageRating(), 1),
                'totalRatings' => $landlord->ratingsReceived()->count(),
            ],
            'ratingsReceived' => $ratingsReceived,
            'bookedRanges' => $room->rentals
                ->map(fn (Rental $rental): array => [
                    'id' => $rental->id,
                    'startsAt' => $rental->starts_at->toDateString(),
                    'endsAt' => $rental->ends_at->toDateString(),
                    'renterName' => (string) $rental->renter?->name,
                ])
                ->all(),
            'currentUserRental' => $currentUserRental === null ? null : [
                'startsAt' => $currentUserRental->starts_at->toDateString(),
                'endsAt' => $currentUserRental->ends_at->toDateString(),
            ],
            'currentUserPendingRequest' => $currentUserPendingRequest === null ? null : [
                'startsAt' => $currentUserPendingRequest->starts_at->toDateString(),
                'endsAt' => $currentUserPendingRequest->ends_at->toDateString(),
            ],
            'canRent' => $room->owner_id !== $request->user()->id,
            'tenantApproved' => $tenantApproved,
            'tenantApprovalMessage' => $tenantApproved
                ? null
                : 'Your account is waiting for admin approval. You can browse rooms, but booking is disabled until approval.',
        ]);
    }

    public function storeRental(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'starts_at' => ['required', 'date', 'after_or_equal:today'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ]);

        if ($room->owner_id === $request->user()->id) {
            throw ValidationException::withMessages([
                'starts_at' => 'You cannot rent your own room.',
            ]);
        }

        if ($request->user()->tenant_approved_at === null) {
            throw ValidationException::withMessages([
                'starts_at' => 'Your account is waiting for admin approval before booking.',
            ]);
        }

        if ($room->overlapsRentalPeriod($validated['starts_at'], $validated['ends_at'])) {
            throw ValidationException::withMessages([
                'starts_at' => 'This room is already booked for the selected dates.',
            ]);
        }

        $alreadyRequestedThisRoom = BookingRequest::query()
            ->where('room_id', $room->id)
            ->where('renter_id', $request->user()->id)
            ->exists();

        if ($alreadyRequestedThisRoom) {
            throw ValidationException::withMessages([
                'starts_at' => 'You can book this room only one time.',
            ]);
        }

        $hasPendingRequest = BookingRequest::query()
            ->where('room_id', $room->id)
            ->where('renter_id', $request->user()->id)
            ->where('status', 'pending')
            ->whereDate('starts_at', '<=', $validated['ends_at'])
            ->whereDate('ends_at', '>=', $validated['starts_at'])
            ->exists();

        if ($hasPendingRequest) {
            throw ValidationException::withMessages([
                'starts_at' => 'You already sent a pending request for overlapping dates.',
            ]);
        }

        BookingRequest::query()->create([
            'room_id' => $room->id,
            'renter_id' => $request->user()->id,
            'landlord_id' => $room->owner_id,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'status' => 'pending',
        ]);

        return to_route('dashboard.tenant.rooms.show', $room);
    }

    /**
     * Calculate match percentage between user volunteer preferences and room requirements.
     *
     * @param  User  $user
     * @param  Room  $room
     */
    private function calculateMatchPercentage($user, $room): int
    {
        $userVolunteer = is_array($user->volunteer) ? $user->volunteer : [];
        $roomVolunteerHelp = is_array($room->volunteer_help_needed) ? $room->volunteer_help_needed : [];

        // If room has no volunteer requirements, return 100% (no matching needed)
        if (empty($roomVolunteerHelp)) {
            return 100;
        }

        // If user has no volunteer preferences but room requires help, return 0%
        if (empty($userVolunteer)) {
            return 0;
        }

        // Normalize strings for comparison (convert to lowercase, replace spaces with underscores)
        $normalize = fn (string $s): string => strtolower(str_replace(' ', '_', $s));

        $normalizedUser = array_map($normalize, $userVolunteer);
        $normalizedRoom = array_map($normalize, $roomVolunteerHelp);

        // Count matches
        $matches = count(array_intersect($normalizedUser, $normalizedRoom));

        // Calculate percentage
        return (int) round(($matches / count($roomVolunteerHelp)) * 100);
    }
}
