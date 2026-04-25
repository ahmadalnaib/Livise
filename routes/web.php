<?php

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

    Route::inertia('dashboard/seeker', 'dashboard/seeker')
        ->middleware('role:seeker')
        ->name('dashboard.seeker');

    Route::inertia('dashboard/tenant', 'dashboard/tenant')
        ->middleware('role:tenant')
        ->name('dashboard.tenant');
});

require __DIR__ . '/settings.php';
