<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class LandlordDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $landlord = request()->user();
        $statusFilter = request()->string('status')->value();
        $allowedFilters = [...Room::STATUSES, 'requests'];
        $allListings = $landlord->rooms()
            ->with(['city', 'images'])
            ->latest()
            ->get();
        $listings = match ($statusFilter) {
            'pending' => $allListings->where('status', 'pending')->values(),
            'confirmed' => $allListings->where('status', 'confirmed')->values(),
            'requests' => collect(),
            default => $allListings,
        };

        return Inertia::render('dashboard/tenant', [
            'activeFilter' => in_array($statusFilter, $allowedFilters, true) ? $statusFilter : 'all',
            'stats' => [
                'publishedRooms' => $allListings->count(),
                'pendingListings' => $allListings->where('status', 'pending')->count(),
                'confirmedListings' => $allListings->where('status', 'confirmed')->count(),
                'estimatedRevenue' => $allListings->sum(fn (Room $room): float => (float) $room->price_per_night),
                'withPhotos' => $allListings->filter(fn (Room $room): bool => $room->images->isNotEmpty())->count(),
            ],
            'listings' => $listings->map(fn (Room $room): array => [
                'id' => $room->id,
                'status' => $room->status,
                'title' => $room->title,
                'listing_type' => $room->listing_type,
                'city' => $room->city?->name,
                'address_line_1' => $room->address_line_1,
                'postal_code' => $room->postal_code,
                'price_per_night' => $room->price_per_night,
                'price_period' => $room->price_period,
                'image_count' => $room->images->count(),
                'facilities' => $room->facilities ?? [],
            ])->values()->all(),
        ]);
    }
}
