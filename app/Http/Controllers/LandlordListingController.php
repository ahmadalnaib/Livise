<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLandlordListingRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LandlordListingController extends Controller
{
    public function store(StoreLandlordListingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $room = Room::create([
            'owner_id' => $request->user()->id,
            'city_id' => $validated['city_id'] ?? null,
            'title' => $validated['title'] ?? $this->defaultTitle($validated),
            'description' => $validated['description'] ?? null,
            'price_per_night' => $validated['price_per_night'] ?? 0,
            'listing_type' => $validated['listing_type'],
            'contact_first_name' => $validated['contact_first_name'],
            'contact_last_name' => $validated['contact_last_name'],
            'contact_email' => $validated['contact_email'],
            'size_label' => $validated['size_label'],
            'facilities' => array_values($validated['facilities'] ?? []),
        ]);

        foreach ($request->file('photos', []) as $index => $photo) {
            $room->images()->create([
                'path' => $photo->store("room-images/{$request->user()->id}/{$room->id}", 'public'),
                'sort_order' => $index,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Listing created.')]);

        return to_route('welcome.landlord');
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function defaultTitle(array $validated): string
    {
        $name = trim($validated['contact_first_name'].' '.$validated['contact_last_name']);
        $listingType = Str::of($validated['listing_type'])->replace('_', ' ')->lower()->value();

        return "{$name}'s {$listingType}";
    }
}
