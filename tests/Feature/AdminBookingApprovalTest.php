<?php

use App\Models\BookingRequest;
use App\Models\City;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

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
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin')
                ->where('bookingRequests', fn ($requests): bool => collect($requests)->pluck('room.title')->contains('Ocean Light Room'))
                ->where('bookingRequests', fn ($requests): bool => collect($requests)->pluck('tenant.email')->contains($tenant->email))
                ->where('bookingRequests', fn ($requests): bool => collect($requests)->pluck('landlord.email')->contains($landlord->email))
        );
});

test('admin can view all users and all rooms tables', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Madaba']);
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Admin Full List Room',
    ]);

    actingAs($admin)
        ->get(route('dashboard.admin'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin')
                ->where('stats.allUsers', 3)
                ->where('stats.allRooms', 1)
        );
});

test('admin can access dedicated users and rooms pages', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Amman']);
    Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Route Test Room',
    ]);

    actingAs($admin)
        ->get(route('dashboard.admin.users.list'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin-users')
                ->where('users', fn ($users): bool => collect($users)->pluck('role')->contains('landlord'))
        );

    actingAs($admin)
        ->get(route('dashboard.admin.rooms.list'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin-rooms')
                ->where('rooms', fn ($rooms): bool => collect($rooms)->pluck('title')->contains('Route Test Room'))
        );
});

test('admin can open user and room profile pages', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Irbid']);
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Profile Detail Room',
    ]);

    actingAs($admin)
        ->get(route('dashboard.admin.users.show', $tenant))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin-user-show')
                ->where('user.email', $tenant->email)
                ->where('user.role', 'tenant')
        );

    actingAs($admin)
        ->get(route('dashboard.admin.rooms.show', $room))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('dashboard/admin-room-show')
                ->where('room.title', 'Profile Detail Room')
                ->where('room.city', 'Irbid')
        );
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

test('admin can approve pending tenant account', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tenant = User::factory()->create([
        'role' => 'tenant',
        'tenant_approved_at' => null,
    ]);

    actingAs($admin)
        ->post(route('dashboard.admin.users.approve', $tenant))
        ->assertRedirect();

    $tenant->refresh();

    expect($tenant->tenant_approved_at)->not->toBeNull();
});
