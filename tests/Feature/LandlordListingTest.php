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
            ->where('showCreateListing', false)
            ->missing('existingListings')
            ->missing('cityOptions')
            ->missing('pricePeriodOptions')
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
        'status' => 'confirmed',
        'address_line_1' => '12 Garden Street',
        'postal_code' => '10115',
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
            ->where('showCreateListing', false)
            ->has('cityOptions', count(City::COMMON_GERMAN_CITIES) + 1)
            ->has('pricePeriodOptions', 2)
            ->has('listingTypeOptions', 2)
            ->has('facilityOptions', count(Room::FACILITIES))
            ->has('existingListings', 1)
            ->where('existingListings.0.status', 'confirmed')
            ->where('existingListings.0.title', 'Garden Flat')
            ->where('existingListings.0.listing_type', 'apartment')
            ->where('existingListings.0.address_line_1', '12 Garden Street')
            ->where('existingListings.0.postal_code', '10115')
            ->where('existingListings.0.price_period', 'night'),
        );
});

test('landlord can open the focused create listing panel from the query string', function () {
    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $this->actingAs($landlord)
        ->get(route('welcome.landlord', ['create' => 1]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome/tenant')
            ->where('isLandlordWorkspace', true)
            ->where('showCreateListing', true),
        );
});

test('landlord can view an existing listing in the view screen', function () {
    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'status' => 'pending',
        'listing_type' => 'room',
        'address_line_1' => '14 Market Street',
        'postal_code' => '10115',
        'price_period' => 'month',
        'facilities' => ['wifi', 'parking'],
    ]);

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord.listings.show', $room))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/landlord-listing-show')
            ->where('listing.id', $room->id)
            ->where('listing.status', 'pending')
            ->where('listing.title', $room->title)
            ->where('listing.price_period', 'month')
            ->where('listing.images.0.url', asset('images/default-room1.jpg'))
            ->where('listing.city', $room->city?->name),
        );
});

test('landlord listing view always uses the shared default image', function () {
    Storage::fake('public');

    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
    ]);

    $room->images()->create([
        'path' => UploadedFile::fake()->image('room-photo.png')->store("room-images/{$landlord->id}/{$room->id}", 'public'),
        'sort_order' => 0,
    ]);

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord.listings.show', $room))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/landlord-listing-show')
            ->where('listing.images.0.url', asset('images/default-room1.jpg')),
        );
});

test('landlord can open the edit screen for an existing listing', function () {
    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'status' => 'pending',
        'listing_type' => 'room',
        'address_line_1' => '14 Market Street',
        'postal_code' => '10115',
        'price_period' => 'month',
        'facilities' => ['wifi', 'parking'],
    ]);

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord.listings.edit', $room))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/landlord-listing-edit')
            ->where('listing.id', $room->id)
            ->where('listing.status', 'pending')
            ->where('listing.title', $room->title)
            ->where('listing.price_period', 'month')
            ->has('facilityOptions', count(Room::FACILITIES)),
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
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
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
        ->and($room?->title)->toBe('Sunny room')
        ->and($room?->description)->toBe('Bright room with a calm study corner.')
        ->and($room?->city_id)->toBeInt()
        ->and($room?->address_line_1)->toBe('14 Market Street')
        ->and($room?->address_line_2)->toBe('Unit 3B')
        ->and($room?->postal_code)->toBe('10115')
        ->and((string) $room?->price_per_night)->toBe('65.00')
        ->and($room?->price_period)->toBe('month')
        ->and($room?->status)->toBe('pending')
        ->and($room?->listing_type)->toBe('room')
        ->and($room?->contact_first_name)->toBe('Jane')
        ->and($room?->contact_last_name)->toBe('Doe')
        ->and($room?->contact_email)->toBe('jane@example.com')
        ->and($room?->size_label)->toBe('25 sqm')
        ->and($room?->facilities)->toBe(['wifi', 'washing_machine', 'lift']);

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
            'title' => '',
            'description' => '',
            'city_id' => '',
            'address_line_1' => '',
            'postal_code' => '',
            'price_per_night' => '',
            'price_period' => '',
            'listing_type' => '',
            'size_label' => '',
            'facilities' => ['washing_machine', 'pool'],
            'photos' => ['not-a-file'],
        ]));

    $response->assertRedirect(route('welcome.landlord'));
    $response->assertSessionHasErrors([
        'title',
        'description',
        'city_id',
        'address_line_1',
        'postal_code',
        'price_per_night',
        'price_period',
        'listing_type',
        'size_label',
        'facilities.1',
        'photos.0',
    ]);
});

test('landlord can update their listing', function () {
    Storage::fake('public');

    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $city = City::factory()->create(['name' => 'Hamburg']);
    $room = Room::factory()->create([
        'owner_id' => $landlord->id,
        'city_id' => $city->id,
        'status' => 'pending',
        'listing_type' => 'room',
        'address_line_1' => '14 Market Street',
        'postal_code' => '10115',
        'price_period' => 'month',
        'facilities' => ['wifi'],
    ]);

    $response = $this->actingAs($landlord)
        ->from(route('dashboard.landlord.listings.edit', $room))
        ->patch(route('landlord.listings.update', $room), [
            ...landlordListingPayload([
                'city_id' => $city->id,
                'title' => 'Updated Listing',
                'address_line_1' => '99 Harbour Street',
                'price_period' => 'night',
                'facilities' => ['wifi', 'parking'],
                'photos' => [UploadedFile::fake()->image('updated-room.jpg')],
            ]),
        ]);

    $response->assertRedirect(route('dashboard.landlord.listings.edit', $room));
    $response->assertSessionHasNoErrors();

    $room->refresh();

    expect($room->title)->toBe('Updated Listing')
        ->and($room->status)->toBe('pending')
        ->and($room->address_line_1)->toBe('99 Harbour Street')
        ->and($room->price_period)->toBe('night')
        ->and($room->facilities)->toBe(['wifi', 'parking']);

    expect($room->images)->toHaveCount(1);
});

test('landlord cannot edit another landlords listing', function () {
    $landlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $otherLandlord = User::factory()->create([
        'role' => 'landlord',
    ]);

    $room = Room::factory()->create([
        'owner_id' => $otherLandlord->id,
        'status' => 'confirmed',
    ]);

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord.listings.show', $room))
        ->assertForbidden();

    $this->actingAs($landlord)
        ->get(route('dashboard.landlord.listings.edit', $room))
        ->assertForbidden();

    $this->actingAs($landlord)
        ->patch(route('landlord.listings.update', $room), landlordListingPayload())
        ->assertForbidden();
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
        'address_line_1' => '14 Market Street',
        'address_line_2' => 'Unit 3B',
        'postal_code' => '10115',
        'price_per_night' => '65.00',
        'price_period' => 'month',
        'listing_type' => 'room',
        'size_label' => '25 sqm',
        'facilities' => ['wifi', 'washing_machine', 'lift'],
        'photos' => [UploadedFile::fake()->image('room-1.jpg')],
    ], $overrides);
}
