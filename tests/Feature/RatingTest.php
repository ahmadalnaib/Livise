<?php

use App\Models\Rating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('landlord can rate a tenant with selected qualities', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $tenant = User::factory()->create(['role' => 'tenant']);

    $response = $this->actingAs($landlord)
        ->post(route('dashboard.ratings.store'), [
            'rated_id' => $tenant->id,
            'rating' => 5,
            'comment' => 'Very easy to host and communicate with.',
            'qualities' => ['cleanliness', 'communication', 'polite'],
            'type' => 'landlord_to_tenant',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $rating = Rating::query()->first();

    expect($rating)->not->toBeNull()
        ->and($rating?->rater_id)->toBe($landlord->id)
        ->and($rating?->rated_id)->toBe($tenant->id)
        ->and($rating?->qualities)->toBe(['cleanliness', 'communication', 'polite']);
});

test('tenant rating qualities must be valid when submitted', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $tenant = User::factory()->create(['role' => 'tenant']);

    $response = $this->actingAs($landlord)
        ->from(route('dashboard.landlord'))
        ->post(route('dashboard.ratings.store'), [
            'rated_id' => $tenant->id,
            'rating' => 4,
            'comment' => 'Nice guest overall.',
            'qualities' => ['cleanliness', 'invalid_quality'],
            'type' => 'landlord_to_tenant',
        ]);

    $response->assertRedirect(route('dashboard.landlord'));
    $response->assertSessionHasErrors(['qualities.1']);

    expect(Rating::query()->count())->toBe(0);
});
