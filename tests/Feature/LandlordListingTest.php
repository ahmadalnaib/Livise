<?php

use App\Models\City;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guest sees the landlord teaser page', function () {
    $this->get(route('welcome.landlord'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome/tenant')
            ->where('isLandlordWorkspace', false)
            ->where('canRegister', true)
            ->missing('draftContact')
            ->missing('existingListings')
            ->missing('listingTypeOptions')
            ->missing('facilityOptions'),
        );
});

test('authenticated landlord sees the listing workspace props', function () {
    $landlord = User::factory()->create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'role' => 'landlord',
    ]);

    $city = City::factory()->create();

    Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'title' => 'Garden Flat',
        'listing_type' => 'apartment',
        'contact_first_name' => 'Jane',
        'contact_last_name' => 'Doe',
        'contact_email' => 'jane@example.com',
        'size_label' => '85 sqm',
        'facilities' => ['washing_machine'],
    ]);

    $this->actingAs($landlord)
        ->get(route('welcome.landlord'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome/tenant')
            ->where('isLandlordWorkspace', true)
            ->where('draftContact.first_name', 'Jane')
            ->where('draftContact.last_name', 'Doe')
            ->where('draftContact.email', 'jane@example.com')
            ->has('listingTypeOptions', 2)
            ->has('facilityOptions', 3)
            ->has('existingListings', 1)
            ->where('existingListings.0.title', 'Garden Flat')
            ->where('existingListings.0.listing_type', 'apartment'),
        );
});

test('non-landlord users cannot create listings', function () {
    $user = User::factory()->create([
        'role' => 'tenant',
    ]);

    $response = $this->actingAs($user)
        ->post(route('landlord.listings.store'), landlordListingPayload());

    $response->assertForbidden();
});

test('landlord can create a listing with images', function () {
    Storage::fake('public');

    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $response = $this->actingAs($landlord)
        ->from(route('welcome.landlord'))
        ->post(route('landlord.listings.store'), landlordListingPayload([
            'photos' => [
                UploadedFile::fake()->image('room-1.jpg'),
                UploadedFile::fake()->image('room-2.jpg'),
            ],
        ]));

    $response->assertRedirect(route('welcome.landlord'));
    $response->assertSessionHasNoErrors();

    $room = Room::query()->first();

    expect($room)->not->toBeNull()
        ->and($room?->owner_id)->toBe($landlord->id)
        ->and($room?->listing_type)->toBe('room')
        ->and($room?->contact_first_name)->toBe('John')
        ->and($room?->contact_last_name)->toBe('Doe')
        ->and($room?->contact_email)->toBe('john@example.com')
        ->and($room?->size_label)->toBe('25 sqm')
        ->and($room?->facilities)->toBe(['washing_machine', 'lift']);

    expect($room?->images)->toHaveCount(2);

    foreach ($room->images as $image) {
        Storage::disk('public')->assertExists($image->path);
    }
});

test('listing creation validates the required fields and file uploads', function () {
    Storage::fake('public');

    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $response = $this->actingAs($landlord)
        ->from(route('welcome.landlord'))
        ->post(route('landlord.listings.store'), landlordListingPayload([
            'listing_type' => '',
            'contact_first_name' => '',
            'contact_last_name' => '',
            'contact_email' => 'not-an-email',
            'size_label' => '',
            'facilities' => ['washing_machine', 'pool'],
            'photos' => ['not-a-file'],
        ]));

    $response->assertRedirect(route('welcome.landlord'));
    $response->assertSessionHasErrors([
        'listing_type',
        'contact_first_name',
        'contact_last_name',
        'contact_email',
        'size_label',
        'facilities.1',
        'photos.0',
    ]);
});

/**
 * @return array<string, mixed>
 */
function landlordListingPayload(array $overrides = []): array
{
    $city = City::factory()->create();

    return array_replace([
        'title' => 'Sunny room',
        'description' => 'Bright room with a calm study corner.',
        'city_id' => $city->id,
        'price_per_night' => '65.00',
        'listing_type' => 'room',
        'contact_first_name' => 'John',
        'contact_last_name' => 'Doe',
        'contact_email' => 'john@example.com',
        'size_label' => '25 sqm',
        'facilities' => ['washing_machine', 'lift'],
        'photos' => [UploadedFile::fake()->image('room-1.jpg')],
    ], $overrides);
}
