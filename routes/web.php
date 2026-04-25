<?php

use App\Http\Controllers\Dashboard\SeekerDashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/welcome/seeker', 'welcome/seeker', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('welcome.seeker');

Route::inertia('/welcome/tenant', 'welcome/tenant', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('welcome.tenant');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        return redirect()->route(match ($request->user()->role) {
            'admin' => 'dashboard.admin',
            'tenant' => 'dashboard.tenant',
            default => 'dashboard.seeker',
        });
    })->name('dashboard');

    Route::inertia('dashboard/admin', 'dashboard/admin')
        ->middleware('role:admin')
        ->name('dashboard.admin');

    Route::get('dashboard/seeker', [SeekerDashboardController::class, 'show'])
        ->middleware('role:seeker')
        ->name('dashboard.seeker');

    Route::post('dashboard/seeker/preferences', [SeekerDashboardController::class, 'storePreferences'])
        ->middleware('role:seeker')
        ->name('dashboard.seeker.preferences.store');

    Route::post('dashboard/seeker/swipe', [SeekerDashboardController::class, 'storeSwipe'])
        ->middleware('role:seeker')
        ->name('dashboard.seeker.swipe.store');

    Route::post('dashboard/seeker/reset', [SeekerDashboardController::class, 'reset'])
        ->middleware('role:seeker')
        ->name('dashboard.seeker.reset');

    Route::inertia('dashboard/tenant', 'dashboard/tenant')
        ->middleware('role:tenant')
        ->name('dashboard.tenant');
});

require __DIR__.'/settings.php';
