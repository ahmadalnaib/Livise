<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLandlordListingRequest;
use App\Http\Requests\UpdateLandlordListingRequest;
use App\Models\Rating;
use App\Models\Room;
use App\Models\User;
use App\Support\LandlordListingOptions;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandlordListingController extends Controller
{
    public function store(StoreLandlordListingRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $landlord = $request->user();
        [$firstName, $lastName] = $this->splitName($landlord);

        $room = Room::create([
            'owner_id' => $landlord->id,
            'status' => 'pending',
            'city_id' => $validated['city_id'],
            'address_line_1' => $validated['address_line_1'],
            'address_line_2' => $validated['address_line_2'] ?? null,
            'postal_code' => $validated['postal_code'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price_per_night' => $validated['price_per_night'],
            'price_period' => $validated['price_period'],
            'listing_type' => $validated['listing_type'],
            'contact_first_name' => $firstName,
            'contact_last_name' => $lastName,
            'contact_email' => $landlord->email,
            'size_label' => $validated['size_label'],
            'facilities' => array_values($validated['facilities'] ?? []),
        ]);

        foreach ($request->file('photos', []) as $index => $photo) {
            $room->images()->create([
                'path' => $photo->store("room-images/{$landlord->id}/{$room->id}", 'public'),
                'sort_order' => $index,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Listing created.')]);

        return to_route('welcome.landlord');
    }

    public function edit(Room $room): Response
    {
        abort_unless(request()->user()?->id === $room->owner_id, 403);

        $room->load(['city', 'images']);

        return Inertia::render('dashboard/landlord-listing-edit', [
            'listing' => $this->listingPayload($room),
            'cityOptions' => LandlordListingOptions::cityOptions(),
            'pricePeriodOptions' => LandlordListingOptions::pricePeriodOptions(),
            'listingTypeOptions' => LandlordListingOptions::listingTypeOptions(),
            'facilityOptions' => LandlordListingOptions::facilityOptions(),
        ]);
    }

    public function show(Room $room): Response
    {
        abort_unless(request()->user()?->id === $room->owner_id, 403);

        $room->load(['city', 'images']);

        // Get ratings for the landlord (owner of this room)
        $landlord = $room->owner;
        $ratingsReceived = $landlord->ratingsReceived()
            ->with('rater')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn(Rating $rating): array => [
                'id' => $rating->id,
                'rater_name' => $rating->rater->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'type' => $rating->type,
                'created_at' => $rating->created_at->toISOString(),
            ]);

        return Inertia::render('dashboard/landlord-listing-show', [
            'listing' => $this->listingPayload($room),
            'landlordRating' => [
                'averageRating' => round($landlord->averageRating(), 1),
                'totalRatings' => $landlord->ratingsReceived()->count(),
            ],
            'ratingsReceived' => $ratingsReceived,
        ]);
    }

    public function update(UpdateLandlordListingRequest $request, Room $room): RedirectResponse
    {
        $validated = $request->validated();

        $room->update([
            'city_id' => $validated['city_id'],
            'address_line_1' => $validated['address_line_1'],
            'address_line_2' => $validated['address_line_2'] ?? null,
            'postal_code' => $validated['postal_code'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price_per_night' => $validated['price_per_night'],
            'price_period' => $validated['price_period'],
            'listing_type' => $validated['listing_type'],
            'size_label' => $validated['size_label'],
            'facilities' => array_values($validated['facilities'] ?? []),
        ]);

        $nextSortOrder = (int) $room->images()->max('sort_order') + 1;

        foreach ($request->file('photos', []) as $photo) {
            $room->images()->create([
                'path' => $photo->store("room-images/{$request->user()->id}/{$room->id}", 'public'),
                'sort_order' => $nextSortOrder++,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Listing updated.')]);

        return to_route('dashboard.landlord.listings.edit', $room);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function splitName(User $landlord): array
    {
        $segments = preg_split('/\s+/', trim($landlord->name)) ?: [];

        return [
            $segments[0] ?? '',
            trim(implode(' ', array_slice($segments, 1))),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function listingPayload(Room $room): array
    {
        return [
            'id' => $room->id,
            'status' => $room->status,
            'title' => $room->title,
            'description' => $room->description,
            'city_id' => (string) $room->city_id,
            'city' => $room->city?->name,
            'address_line_1' => $room->address_line_1,
            'address_line_2' => $room->address_line_2,
            'postal_code' => $room->postal_code,
            'price_per_night' => $room->price_per_night,
            'price_period' => $room->price_period,
            'listing_type' => $room->listing_type,
            'size_label' => $room->size_label,
            'facilities' => $room->facilities ?? [],
            'images' => $room->images->map(fn($image): array => [
                'id' => $image->id,
                'url' => asset('storage/' . $image->path),
            ])->values()->all(),
        ];
    }
}
