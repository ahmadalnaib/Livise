<?php

use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('tenant and landlord welcome pages return successful responses', function () {
    $this->get(route('welcome.tenant'))->assertOk();
    $this->get(route('welcome.landlord'))->assertOk();
});

test('tenant welcome page includes real room cards', function () {
    Room::factory()->count(3)->create();

    $this->get(route('welcome.tenant'))
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome/seeker')
                ->has('featuredRooms', 3)
                ->where('featuredRooms.0.id', fn (mixed $value): bool => is_int($value))
                ->where('featuredRooms.0.title', fn (mixed $value): bool => is_string($value) && $value !== '')
                ->where('featuredRooms.0.city', fn (mixed $value): bool => is_string($value))
                ->where('featuredRooms.0.price', fn (mixed $value): bool => is_string($value) && str_starts_with($value, '€')),
        );
});
