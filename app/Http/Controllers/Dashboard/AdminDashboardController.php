<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function show(): Response
    {
        $bookingRequests = BookingRequest::query()
            ->with([
                'room.city:id,name',
                'renter:id,name,email',
                'landlord:id,name,email',
                'approvedBy:id,name',
            ])
            ->latest('id')
            ->get()
            ->map(fn(BookingRequest $bookingRequest): array => [
                'id' => $bookingRequest->id,
                'status' => $bookingRequest->status,
                'startsAt' => $bookingRequest->starts_at->toDateString(),
                'endsAt' => $bookingRequest->ends_at->toDateString(),
                'createdAt' => $bookingRequest->created_at?->toDateTimeString(),
                'approvedAt' => $bookingRequest->approved_at?->toDateTimeString(),
                'room' => [
                    'id' => $bookingRequest->room?->id,
                    'title' => (string) $bookingRequest->room?->title,
                    'city' => (string) $bookingRequest->room?->city?->name,
                ],
                'tenant' => [
                    'id' => $bookingRequest->renter?->id,
                    'name' => (string) $bookingRequest->renter?->name,
                    'email' => (string) $bookingRequest->renter?->email,
                ],
                'landlord' => [
                    'id' => $bookingRequest->landlord?->id,
                    'name' => (string) $bookingRequest->landlord?->name,
                    'email' => (string) $bookingRequest->landlord?->email,
                ],
                'approvedBy' => $bookingRequest->approvedBy === null ? null : [
                    'id' => $bookingRequest->approvedBy->id,
                    'name' => (string) $bookingRequest->approvedBy->name,
                ],
            ])
            ->all();

        $pendingTenantUsers = User::query()
            ->where('role', 'tenant')
            ->whereNull('tenant_approved_at')
            ->latest('id')
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(fn(User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'createdAt' => $user->created_at?->toDateTimeString(),
            ])
            ->all();

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'allUsers' => User::query()->count(),
                'allRooms' => Room::query()->count(),
                'activeRentals' => Rental::query()->count(),
                'pendingRequests' => BookingRequest::query()->where('status', 'pending')->count(),
                'pendingTenants' => count($pendingTenantUsers),
            ],
            'pendingTenantUsers' => $pendingTenantUsers,
            'bookingRequests' => $bookingRequests,
        ]);
    }

    public function users(): Response
    {
        $users = User::query()
            ->latest('id')
            ->get(['id', 'name', 'email', 'role', 'tenant_approved_at', 'created_at'])
            ->map(fn(User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'tenantApproved' => $user->role !== 'tenant' || $user->tenant_approved_at !== null,
                'createdAt' => $user->created_at?->toDateTimeString(),
            ])
            ->all();

        return Inertia::render('dashboard/admin-users', [
            'users' => $users,
        ]);
    }

    public function rooms(): Response
    {
        $rooms = Room::query()
            ->with(['city:id,name', 'owner:id,name,email'])
            ->withCount('rentals')
            ->latest('id')
            ->get()
            ->map(fn(Room $room): array => [
                'id' => $room->id,
                'title' => $room->title,
                'city' => (string) $room->city?->name,
                'landlordName' => (string) $room->owner?->name,
                'landlordEmail' => (string) $room->owner?->email,
                'rentalsCount' => $room->rentals_count,
                'status' => $room->rentals_count > 0 ? 'rented' : 'available',
            ])
            ->all();

        return Inertia::render('dashboard/admin-rooms', [
            'rooms' => $rooms,
        ]);
    }
}
