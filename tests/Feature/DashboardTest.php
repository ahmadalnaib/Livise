<?php

use App\Models\City;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated tenants are redirected to tenant dashboard', function () {
    $user = User::factory()->create(['role' => 'tenant']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('dashboard.tenant', absolute: false));
});

test('admin can access only admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get(route('dashboard.admin'))->assertOk();
    $this->get(route('dashboard.tenant'))->assertForbidden();
    $this->get(route('dashboard.landlord'))->assertForbidden();
});

test('landlord can access only landlord dashboard', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Berlin']);

    Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'status' => 'pending',
        'title' => 'Dashboard Listing',
        'address_line_1' => 'Alexanderplatz 1',
        'postal_code' => '10178',
        'listing_type' => 'room',
        'price_per_night' => 950,
        'price_period' => 'month',
        'facilities' => ['wifi'],
    ]);

    $this->actingAs($landlord);

    $this->get(route('dashboard.landlord'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/tenant')
            ->where('activeFilter', 'all')
            ->where('stats.publishedRooms', 1)
            ->where('stats.pendingListings', 1)
            ->where('stats.confirmedListings', 0)
            ->where('stats.withPhotos', 0)
            ->has('listings', 1)
            ->where('listings.0.title', 'Dashboard Listing')
            ->where('listings.0.status', 'pending')
            ->where('listings.0.image', asset('images/default-room1.jpg'))
            ->where('listings.0.price_period', 'month'),
        );
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.tenant'))->assertForbidden();
});

test('landlord dashboard listings fall back to a shared default image', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Munich']);

    Room::factory()->count(2)->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'status' => 'confirmed',
    ]);

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/tenant')
            ->has('listings', 2)
            ->where('listings.0.image', asset('images/default-room1.jpg'))
            ->where('listings.1.image', asset('images/default-room1.jpg')),
        );
});

test('landlord dashboard can filter pending and confirmed listings', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create(['name' => 'Berlin']);

    Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'status' => 'pending',
        'title' => 'Pending Listing',
    ]);

    Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'status' => 'confirmed',
        'title' => 'Confirmed Listing',
    ]);

    $this->actingAs($landlord);

    $this->get(route('dashboard.landlord', ['status' => 'pending']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/tenant')
            ->where('activeFilter', 'pending')
            ->has('listings', 1)
            ->where('listings.0.title', 'Pending Listing'),
        );

    $this->get(route('dashboard.landlord', ['status' => 'confirmed']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/tenant')
            ->where('activeFilter', 'confirmed')
            ->has('listings', 1)
            ->where('listings.0.title', 'Confirmed Listing'),
        );

    $this->get(route('dashboard.landlord', ['status' => 'requests']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/tenant')
            ->where('activeFilter', 'requests')
            ->has('listings', 0),
        );
});

test('tenant can access only tenant dashboard', function () {
    $tenant = User::factory()->create(['role' => 'tenant']);
    $this->actingAs($tenant);

    $this->get(route('dashboard.tenant'))->assertOk();
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.landlord'))->assertForbidden();
});
