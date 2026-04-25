<?php

use App\Models\City;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('a room belongs to an owner and city and can be rented by another user', function () {
    $owner = User::factory()->create();
    $renter = User::factory()->create();
    $city = City::factory()->create();

    $room = Room::factory()->create([
        'owner_id' => $owner->id,
        'city_id' => $city->id,
    ]);

    $rental = Rental::factory()->create([
        'room_id' => $room->id,
        'renter_id' => $renter->id,
    ]);

    expect($room->owner->is($owner))->toBeTrue()
        ->and($room->city->is($city))->toBeTrue()
        ->and($owner->rooms->first()?->is($room))->toBeTrue()
        ->and($renter->rentals->first()?->is($rental))->toBeTrue()
        ->and($room->rentals->first()?->is($rental))->toBeTrue();
});
