<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminBookingController extends Controller
{
    public function approveTenant(User $user): RedirectResponse
    {
        if ($user->role !== 'tenant') {
            throw ValidationException::withMessages([
                'tenant' => 'Only tenant accounts can be approved.',
            ]);
        }

        if ($user->tenant_approved_at !== null) {
            return back();
        }

        $user->update([
            'tenant_approved_at' => now(),
        ]);

        return back();
    }

    public function approve(Request $request, BookingRequest $bookingRequest): RedirectResponse
    {
        if ($bookingRequest->status !== 'pending') {
            throw ValidationException::withMessages([
                'booking' => 'This booking request has already been processed.',
            ]);
        }

        $bookingRequest->loadMissing('room');

        if ($bookingRequest->room?->overlapsRentalPeriod($bookingRequest->starts_at->toDateString(), $bookingRequest->ends_at->toDateString())) {
            throw ValidationException::withMessages([
                'booking' => 'This request overlaps an existing approved booking.',
            ]);
        }

        DB::transaction(function () use ($request, $bookingRequest): void {
            Rental::query()->create([
                'room_id' => $bookingRequest->room_id,
                'renter_id' => $bookingRequest->renter_id,
                'starts_at' => $bookingRequest->starts_at,
                'ends_at' => $bookingRequest->ends_at,
            ]);

            $bookingRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);
        });

        return back();
    }
}
