<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Support\LandlordListingOptions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class LandlordWelcomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isLandlordWorkspace = $user?->role === 'landlord';

        return Inertia::render('welcome/tenant', [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,
            ],
            'canRegister' => Features::enabled(Features::registration()),
            'isLandlordWorkspace' => $isLandlordWorkspace,
            'showCreateListing' => $isLandlordWorkspace && $request->boolean('create'),
            ...($isLandlordWorkspace ? [
                'cityOptions' => LandlordListingOptions::cityOptions(),
                'pricePeriodOptions' => LandlordListingOptions::pricePeriodOptions(),
                'listingTypeOptions' => LandlordListingOptions::listingTypeOptions(),
                'facilityOptions' => LandlordListingOptions::facilityOptions(),
                'existingListings' => $user->rooms()
                    ->with(['city', 'images'])
                    ->latest()
                    ->get()
                    ->map(fn(Room $room): array => [
                        'id' => $room->id,
                        'status' => $room->status,
                        'title' => $room->title,
                        'listing_type' => $room->listing_type,
                        'city' => $room->city?->name,
                        'address_line_1' => $room->address_line_1,
                        'postal_code' => $room->postal_code,
                        'price_per_night' => $room->price_per_night,
                        'price_period' => $room->price_period,
                        'size_label' => $room->size_label,
                        'contact_email' => $room->contact_email,
                        'facilities' => $room->facilities ?? [],
                        'image_count' => $room->images->count(),
                    ])
                    ->values()
                    ->all(),
            ] : []),
        ]);
    }
}
