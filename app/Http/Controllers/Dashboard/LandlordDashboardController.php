<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Rental;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandlordDashboardController extends Controller
{
    public function show(Request $request): Response
    {
        $landlordId = $request->user()->id;

        $approvedBookings = BookingRequest::query()
            ->with(['room.city:id,name', 'renter:id,name,email'])
            ->where('landlord_id', $landlordId)
            ->where('status', 'approved')
            ->latest('approved_at')
            ->get()
            ->map(fn (BookingRequest $bookingRequest): array => [
                'id' => $bookingRequest->id,
                'startsAt' => $bookingRequest->starts_at->toDateString(),
                'endsAt' => $bookingRequest->ends_at->toDateString(),
                'approvedAt' => $bookingRequest->approved_at?->toDateTimeString(),
                'roomTitle' => (string) $bookingRequest->room?->title,
                'roomCity' => (string) $bookingRequest->room?->city?->name,
                'tenantName' => (string) $bookingRequest->renter?->name,
                'tenantEmail' => (string) $bookingRequest->renter?->email,
            ])
            ->all();

        return Inertia::render('dashboard/tenant', [
            'stats' => [
                'publishedRooms' => Room::query()->where('owner_id', $landlordId)->count(),
                'approvedBookings' => count($approvedBookings),
                'upcomingCheckIns' => Rental::query()
                    ->whereHas('room', fn ($query) => $query->where('owner_id', $landlordId))
                    ->whereDate('starts_at', '>=', now()->toDateString())
                    ->count(),
            ],
            'approvedBookings' => $approvedBookings,
        ]);
    }
}
