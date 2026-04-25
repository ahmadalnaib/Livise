<?php

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
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
