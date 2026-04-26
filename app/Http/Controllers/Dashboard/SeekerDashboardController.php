<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Room;
use App\Models\SeekerSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SeekerDashboardController extends Controller
{
    public function show(Request $request): Response
    {
        $session = $this->seekerSession($request);
        $rooms = Room::query()
            ->with(['city:id,name', 'owner:id,name'])
            ->doesntHave('rentals')
            ->latest('id')
            ->get();

        $roomCards = $rooms
            ->map(fn (Room $room): array => $this->roomCard($room))
            ->all();
        $availableRoomIds = $rooms->modelKeys();
        $likedRoomIds = collect($session->liked_room_ids ?? [])->intersect($availableRoomIds)->values()->all();
        $passedRoomIds = collect($session->passed_room_ids ?? [])->intersect($availableRoomIds)->values()->all();

        return Inertia::render('dashboard/seeker', [
            'rooms' => $roomCards,
            'seekerSession' => [
                'answers' => $session->answers,
                'likedRoomIds' => $likedRoomIds,
                'passedRoomIds' => $passedRoomIds,
                'currentIndex' => min($session->current_index, count($roomCards)),
                'questionnaireCompleted' => $session->questionnaire_completed,
            ],
            'favoriteRooms' => collect($roomCards)
                ->filter(fn (array $room): bool => in_array($room['id'], $likedRoomIds, true))
                ->values()
                ->all(),
        ]);
    }

    public function rentedRooms(Request $request): Response
    {
        $tenant = $request->user();
        $rentedRooms = $tenant->rentals()
            ->with(['room.city:id,name', 'room.owner:id,name'])
            ->latest('id')
            ->get()
            ->filter(fn ($rental): bool => $rental->room !== null)
            ->map(fn ($rental): array => [
                ...$this->roomCard($rental->room),
                'rentalId' => $rental->id,
                'startsAt' => $rental->starts_at->toDateString(),
                'endsAt' => $rental->ends_at->toDateString(),
                'landlordId' => $rental->room->owner_id,
                'landlordName' => $rental->room->owner->name,
            ])
            ->values()
            ->all();

        // Get landlords that tenant has already rated
        $landlordsRated = Rating::where('rater_id', $tenant->id)
            ->where('type', 'tenant_to_landlord')
            ->pluck('rated_id')
            ->toArray();

        // Add already_rated flag to each rented room
        $rentedRooms = array_map(function ($room) use ($landlordsRated) {
            $room['landlordAlreadyRated'] = in_array($room['landlordId'], $landlordsRated);

            return $room;
        }, $rentedRooms);

        // Get ratings received by tenant
        $ratingsReceived = $tenant->ratingsReceived()
            ->with('rater')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn (Rating $rating): array => [
                'id' => $rating->id,
                'rater_name' => $rating->rater->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'qualities' => is_array($rating->qualities) ? $rating->qualities : [],
                'type' => $rating->type,
                'created_at' => $rating->created_at->toISOString(),
            ]);

        return Inertia::render('dashboard/seeker-rented-rooms', [
            'rentedRooms' => $rentedRooms,
            'ratingsReceived' => $ratingsReceived,
            'averageRating' => round($tenant->averageRating(), 1),
            'totalRatings' => $tenant->ratingsReceived()->count(),
        ]);
    }

    public function storePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'roomSize' => ['required', Rule::in(['small', 'medium', 'large'])],
            'budget' => ['required', Rule::in(['low', 'mid', 'high'])],
            'roommatePreference' => ['required', Rule::in(['private', 'shared', 'either'])],
            'preferredCityType' => ['required', Rule::in(['central', 'quiet', 'coastal'])],
            'stayLength' => ['required', Rule::in(['short', 'medium', 'long'])],
        ]);

        $session = $this->seekerSession($request);
        $session->update([
            'answers' => $validated,
            'questionnaire_completed' => true,
        ]);

        return back();
    }

    public function storeSwipe(Request $request): RedirectResponse
    {
        $roomIds = Room::query()->pluck('id')->all();

        $validated = $request->validate([
            'roomId' => ['required', 'integer', Rule::in($roomIds)],
            'direction' => ['required', Rule::in(['left', 'right'])],
        ]);

        $session = $this->seekerSession($request);
        $likedRoomIds = collect($session->liked_room_ids ?? []);
        $passedRoomIds = collect($session->passed_room_ids ?? []);

        if ($validated['direction'] === 'right') {
            $likedRoomIds = $likedRoomIds->push($validated['roomId'])->unique()->values();
            $passedRoomIds = $passedRoomIds->reject(fn (int $roomId): bool => $roomId === $validated['roomId'])->values();
        } else {
            $passedRoomIds = $passedRoomIds->push($validated['roomId'])->unique()->values();
            $likedRoomIds = $likedRoomIds->reject(fn (int $roomId): bool => $roomId === $validated['roomId'])->values();
        }

        $session->update([
            'liked_room_ids' => $likedRoomIds->all(),
            'passed_room_ids' => $passedRoomIds->all(),
            'current_index' => min(count($roomIds), $session->current_index + 1),
            'questionnaire_completed' => true,
        ]);

        return back();
    }

    public function reset(Request $request): RedirectResponse
    {
        $session = $this->seekerSession($request);

        $session->update([
            'answers' => null,
            'liked_room_ids' => [],
            'passed_room_ids' => [],
            'current_index' => 0,
            'questionnaire_completed' => false,
        ]);

        return back();
    }

    private function seekerSession(Request $request): SeekerSession
    {
        return SeekerSession::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'answers' => null,
                'liked_room_ids' => [],
                'passed_room_ids' => [],
                'current_index' => 0,
                'questionnaire_completed' => false,
            ],
        );
    }

    /**
     * @return array{id: int, title: string, city: string, pricePerNight: string, pricePerNightValue: float, size: string, tags: list<string>, image: string, description: string, ownerName: string, volunteerHelpNeeded: array<string>, matchPercentage: int}
     */
    private function roomCard(Room $room): array
    {
        $user = request()->user();
        $userVolunteer = is_array($user->volunteer) ? $user->volunteer : [];
        $roomVolunteerHelp = is_array($room->volunteer_help_needed) ? $room->volunteer_help_needed : [];

        // Calculate match percentage
        $matchPercentage = $this->calculateMatchPercentage($userVolunteer, $roomVolunteerHelp);

        return [
            'id' => $room->id,
            'title' => $room->title,
            'city' => (string) $room->city?->name,
            'pricePerNight' => $room->pricePerNightLabel(),
            'pricePerNightValue' => (float) $room->price_per_night,
            'size' => $this->roomSize($room),
            'tags' => $room->catalogHighlights(),
            'image' => $room->catalogImage(),
            'description' => (string) $room->description,
            'ownerName' => (string) $room->owner?->name,
            'volunteerHelpNeeded' => $roomVolunteerHelp,
            'matchPercentage' => $matchPercentage,
        ];
    }

    /**
     * Calculate match percentage between user volunteer preferences and room requirements.
     *
     * @param  array<string>  $userVolunteer
     * @param  array<string>  $roomVolunteerHelp
     */
    private function calculateMatchPercentage(array $userVolunteer, array $roomVolunteerHelp): int
    {
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

    private function roomSize(Room $room): string
    {
        if ($room->price_per_night <= 80) {
            return 'small';
        }

        if ($room->price_per_night <= 150) {
            return 'medium';
        }

        return 'large';
    }
}
