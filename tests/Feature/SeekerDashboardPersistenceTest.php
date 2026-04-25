<?php

use App\Models\SeekerSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

test('seeker can save questionnaire answers', function () {
    /** @var User $seeker */
    $seeker = User::factory()->create(['role' => 'seeker']);

    $response = actingAs($seeker)->post(route('dashboard.seeker.preferences.store'), [
        'roomSize' => 'medium',
        'budget' => 'mid',
        'roommatePreference' => 'private',
        'preferredCityType' => 'central',
        'stayLength' => 'long',
    ]);

    $response->assertRedirect();

    $session = SeekerSession::query()->where('user_id', $seeker->id)->first();

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

test('seeker right swipe is stored as a favorite', function () {
    /** @var User $seeker */
    $seeker = User::factory()->create(['role' => 'seeker']);

    $response = actingAs($seeker)->post(route('dashboard.seeker.swipe.store'), [
        'roomId' => 1,
        'direction' => 'right',
    ]);

    $response->assertRedirect();

    $session = SeekerSession::query()->where('user_id', $seeker->id)->first();

    expect($session)->not->toBeNull();
    expect($session->liked_room_ids)->toContain(1);
    expect($session->passed_room_ids)->not->toContain(1);
    expect($session->current_index)->toBe(1);
});

test('non seeker cannot use seeker persistence routes', function () {
    /** @var User $tenant */
    $tenant = User::factory()->create(['role' => 'tenant']);

    actingAs($tenant);

    post(route('dashboard.seeker.preferences.store'), [
        'roomSize' => 'medium',
        'budget' => 'mid',
        'roommatePreference' => 'private',
        'preferredCityType' => 'central',
        'stayLength' => 'long',
    ])
        ->assertForbidden();

    post(route('dashboard.seeker.swipe.store'), [
        'roomId' => 1,
        'direction' => 'right',
    ])
        ->assertForbidden();

    assertDatabaseMissing('seeker_sessions', [
        'user_id' => $tenant->id,
    ]);
});
