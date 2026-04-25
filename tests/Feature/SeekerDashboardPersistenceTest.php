<?php

use App\Models\City;
use App\Models\Rental;
use App\Models\Room;
use App\Models\SeekerSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

test('tenant can save questionnaire answers', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);

    $response = actingAs($tenant)->post(route('dashboard.tenant.preferences.store'), [
        'roomSize' => 'medium',
        'budget' => 'mid',
        'roommatePreference' => 'private',
        'preferredCityType' => 'central',
        'stayLength' => 'long',
    ]);

    $response->assertRedirect();

    $session = SeekerSession::query()->where('user_id', $tenant->id)->first();

    expect($session)->not->toBeNull();
    expect($session->questionnaire_completed)->toBeTrue();
    expect($session->answers)->toMatchArray([
        'roomSize' => 'medium',
        'budget' => 'mid',
        'roommatePreference' => 'private',
        'preferredCityType' => 'central',
        'stayLength' => 'long',
    ]);
});

test('tenant right swipe is stored as a favorite', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
    ]);

    $response = actingAs($tenant)->post(route('dashboard.tenant.swipe.store'), [
        'roomId' => $room->id,
        'direction' => 'right',
    ]);

    $response->assertRedirect();

    $session = SeekerSession::query()->where('user_id', $tenant->id)->first();

    expect($session)->not->toBeNull();
    expect($session->liked_room_ids)->toContain($room->id);
    expect($session->passed_room_ids)->not->toContain($room->id);
    expect($session->current_index)->toBe(1);
});

test('non tenant cannot use tenant persistence routes', function () {
    /** @var User $landlord */
    $landlord = User::factory()->create(['role' => 'landlord']);
    $owner = User::factory()->create(['role' => 'landlord']);
    $city = City::factory()->create();
    $room = Room::factory()->create([
        'owner_id' => $owner->id,
        'city_id' => $city->id,
    ]);

    actingAs($landlord);

    post(route('dashboard.tenant.preferences.store'), [
        'roomSize' => 'medium',
        'budget' => 'mid',
        'roommatePreference' => 'private',
        'preferredCityType' => 'central',
        'stayLength' => 'long',
    ])
        ->assertForbidden();

    post(route('dashboard.tenant.swipe.store'), [
        'roomId' => $room->id,
        'direction' => 'right',
    ])
        ->assertForbidden();

    assertDatabaseMissing('seeker_sessions', [
        'user_id' => $landlord->id,
    ]);
});

test('rented rooms are hidden from tenant room list', function () {
    $tenant = User::factory()->create(['role' => 'tenant']);
    $landlord = User::factory()->create(['role' => 'landlord']);
    $anotherTenant = User::factory()->create(['role' => 'tenant']);
    $city = City::factory()->create();

    $rentedRoom = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Already Rented Room',
    ]);

    $availableRoom = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Open Room',
    ]);

    Rental::factory()->create([
        'room_id' => $rentedRoom->id,
        'renter_id' => $anotherTenant->id,
        'starts_at' => now()->addDays(1)->toDateString(),
        'ends_at' => now()->addDays(4)->toDateString(),
    ]);

    actingAs($tenant)
        ->get(route('dashboard.tenant'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('dashboard/seeker')
                ->where('rooms', fn($rooms): bool => collect($rooms)->pluck('title')->contains('Already Rented Room') === false)
                ->where('rooms', fn($rooms): bool => collect($rooms)->pluck('title')->contains('Open Room'))
        );
});
