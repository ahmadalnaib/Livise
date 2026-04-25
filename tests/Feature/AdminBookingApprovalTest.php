<?php

use App\Models\BookingRequest;
use App\Models\City;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

test('admin can view all booking requests table', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Ocean Light Room',
    ]);

    BookingRequest::query()->create([
        'room_id' => $room->id,
        'renter_id' => $tenant->id,
        'landlord_id' => $landlord->id,
        'starts_at' => now()->addDays(2)->toDateString(),
        'ends_at' => now()->addDays(5)->toDateString(),
        'status' => 'pending',
    ]);

    actingAs($admin)
        ->get(route('dashboard.admin'))
        ->assertOk()
        ->assertSee('All Booking Requests')
        ->assertSee('Ocean Light Room')
        ->assertSee($tenant->email)
        ->assertSee($landlord->email);
});

test('admin can approve pending booking request and create rental', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
    ]);

    $request = BookingRequest::query()->create([
        'room_id' => $room->id,
        'renter_id' => $tenant->id,
        'landlord_id' => $landlord->id,
        'starts_at' => now()->addDays(3)->toDateString(),
        'ends_at' => now()->addDays(8)->toDateString(),
        'status' => 'pending',
    ]);

    actingAs($admin)
        ->post(route('dashboard.admin.bookings.approve', $request))
        ->assertRedirect();

    $request->refresh();

    expect($request->status)->toBe('approved');
    expect($request->approved_by)->toBe($admin->id);
    expect($request->approved_at)->not->toBeNull();

    $rental = Rental::query()
        ->where('room_id', $room->id)
        ->where('renter_id', $tenant->id)
        ->first();

    expect($rental)->not->toBeNull();
});

test('landlord dashboard shows approved booking requests', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $tenant = User::factory()->create(['role' => 'tenant']);
    $admin = User::factory()->create(['role' => 'admin']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Golden Corner Room',
    ]);

    BookingRequest::query()->create([
        'room_id' => $room->id,
        'renter_id' => $tenant->id,
        'landlord_id' => $landlord->id,
        'starts_at' => now()->addDays(4)->toDateString(),
        'ends_at' => now()->addDays(10)->toDateString(),
        'status' => 'approved',
        'approved_by' => $admin->id,
        'approved_at' => now(),
    ]);

    actingAs($landlord)
        ->get(route('dashboard.landlord'))
        ->assertOk()
        ->assertSee('Golden Corner Room')
        ->assertSee($tenant->name);
});
