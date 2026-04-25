<?php

use App\Http\Controllers\Dashboard\AdminBookingController;
use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\LandlordDashboardController;
use App\Http\Controllers\Dashboard\SeekerDashboardController;
use App\Http\Controllers\Dashboard\SeekerRoomController;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/welcome/tenant', function () {
    $rooms = Room::query()
        ->with('city:id,name')
        ->latest('id')
        ->take(6)
        ->get()
        ->map(fn (Room $room): array => [
            'id' => $room->id,
            'title' => $room->title,
            'city' => (string) $room->city?->name,
            'price' => $room->pricePerNightLabel(),
            'rating' => number_format(4.6 + (($room->id % 4) * 0.1), 1),
            'image' => $room->catalogImage(),
        ])
        ->all();

    return Inertia::render('welcome/seeker', [
        'canRegister' => Features::enabled(Features::registration()),
        'featuredRooms' => $rooms,
    ]);
})->name('welcome.tenant');

Route::inertia('/welcome/landlord', 'welcome/tenant', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('welcome.landlord');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        return redirect()->route(match ($request->user()->role) {
            'admin' => 'dashboard.admin',
            'landlord' => 'dashboard.landlord',
            default => 'dashboard.tenant',
        });
    })->name('dashboard');

    Route::get('dashboard/admin', [AdminDashboardController::class, 'show'])
        ->middleware('role:admin')
        ->name('dashboard.admin');

    Route::get('dashboard/admin/users-list', [AdminDashboardController::class, 'users'])
        ->middleware('role:admin')
        ->name('dashboard.admin.users.list');

    Route::get('dashboard/admin/users/{user}', [AdminDashboardController::class, 'user'])
        ->middleware('role:admin')
        ->name('dashboard.admin.users.show');

    Route::get('dashboard/admin/rooms-list', [AdminDashboardController::class, 'rooms'])
        ->middleware('role:admin')
        ->name('dashboard.admin.rooms.list');

    Route::get('dashboard/admin/rooms/{room}', [AdminDashboardController::class, 'room'])
        ->middleware('role:admin')
        ->name('dashboard.admin.rooms.show');

    Route::post('dashboard/admin/bookings/{bookingRequest}/approve', [AdminBookingController::class, 'approve'])
        ->middleware('role:admin')
        ->name('dashboard.admin.bookings.approve');

    Route::post('dashboard/admin/users/{user}/approve', [AdminBookingController::class, 'approveTenant'])
        ->middleware('role:admin')
        ->name('dashboard.admin.users.approve');

    Route::get('dashboard/tenant', [SeekerDashboardController::class, 'show'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant');

    Route::post('dashboard/tenant/preferences', [SeekerDashboardController::class, 'storePreferences'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant.preferences.store');

    Route::post('dashboard/tenant/swipe', [SeekerDashboardController::class, 'storeSwipe'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant.swipe.store');

    Route::post('dashboard/tenant/reset', [SeekerDashboardController::class, 'reset'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant.reset');

    Route::get('dashboard/tenant/rooms/{room}', [SeekerRoomController::class, 'show'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant.rooms.show');

    Route::post('dashboard/tenant/rooms/{room}/rent', [SeekerRoomController::class, 'storeRental'])
        ->middleware('role:tenant')
        ->name('dashboard.tenant.rooms.rent.store');

    Route::get('dashboard/landlord', [LandlordDashboardController::class, 'show'])
        ->middleware('role:landlord')
        ->name('dashboard.landlord');
});

require __DIR__.'/settings.php';
