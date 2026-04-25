<?php

use App\Models\BookingRequest;
use App\Models\City;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

test('tenant can open a room details page', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Amman']);
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Elegant City Room',
    ]);

    actingAs($tenant)
        ->get(route('dashboard.tenant.rooms.show', $room))
        ->assertOk()
        ->assertSee('Elegant City Room');
});

test('tenant can send a booking request for an available room', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
    ]);

    $response = actingAs($tenant)->post(route('dashboard.tenant.rooms.rent.store', $room), [
        'starts_at' => now()->addDays(2)->toDateString(),
        'ends_at' => now()->addDays(7)->toDateString(),
    ]);

    $response->assertRedirect(route('dashboard.tenant.rooms.show', $room, absolute: false));

    $request = BookingRequest::query()
        ->where('room_id', $room->id)
        ->where('renter_id', $tenant->id)
        ->where('status', 'pending')
        ->first();

    expect($request)->not->toBeNull();
    expect(Rental::query()->count())->toBe(0);
});

test('tenant cannot rent a room that overlaps an existing booking', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);
    $existingRenter = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
    ]);

    Rental::factory()->create([
        'room_id' => $room->id,
        'renter_id' => $existingRenter->id,
        'starts_at' => now()->addDays(5)->toDateString(),
        'ends_at' => now()->addDays(10)->toDateString(),
    ]);

    actingAs($tenant)->post(route('dashboard.tenant.rooms.rent.store', $room), [
        'starts_at' => now()->addDays(6)->toDateString(),
        'ends_at' => now()->addDays(12)->toDateString(),
    ])
        ->assertSessionHasErrors('starts_at');
});
