<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Rental;
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

        // Get ratings received by landlord
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

        // Get tenants who have rented from this landlord (for rating)
        $tenantsRated = Rating::where('rater_id', $landlord->id)
            ->where('type', 'landlord_to_tenant')
            ->pluck('rated_id')
            ->toArray();

        $recentTenants = Rental::whereHas('room', fn($query) => $query->where('owner_id', $landlord->id))
            ->with('renter')
            ->latest()
            ->take(10)
            ->get()
            ->unique('renter_id')
            ->map(fn($rental): array => [
                'id' => $rental->renter->id,
                'name' => $rental->renter->name,
                'already_rated' => in_array($rental->renter->id, $tenantsRated),
            ])
            ->values()
            ->all();

        return Inertia::render('dashboard/tenant', [
            'activeFilter' => in_array($statusFilter, $allowedFilters, true) ? $statusFilter : 'all',
            'stats' => [
                'publishedRooms' => $allListings->count(),
                'pendingListings' => $allListings->where('status', 'pending')->count(),
                'confirmedListings' => $allListings->where('status', 'confirmed')->count(),
                'estimatedRevenue' => $allListings->sum(fn(Room $room): float => (float) $room->price_per_night),
                'withPhotos' => $allListings->filter(fn(Room $room): bool => $room->images->isNotEmpty())->count(),
                'averageRating' => round($landlord->averageRating(), 1),
                'totalRatings' => $landlord->ratingsReceived()->count(),
            ],
            'ratingsReceived' => $ratingsReceived,
            'recentTenants' => $recentTenants,
            'listings' => $listings->map(fn(Room $room): array => [
                'id' => $room->id,
                'status' => $room->status,
                'title' => $room->title,
                'listing_type' => $room->listing_type,
                'city' => $room->city?->name,
                'address_line_1' => $room->address_line_1,
                'postal_code' => $room->postal_code,
                'price_per_night' => $room->price_per_night,
                'price_period' => $room->price_period,
                'image' => $room->images->first()?->path
                    ? asset('storage/' . $room->images->first()->path)
                    : null,
                'image_count' => $room->images->count(),
                'facilities' => is_array($room->facilities) ? $room->facilities : [],
            ])->values()->all(),
        ]);
    }
}
