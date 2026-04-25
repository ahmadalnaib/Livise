<?php

namespace Database\Factories;

use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rental>
 */
class RentalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('+1 day', '+2 weeks');
        $endsAt = (clone $startsAt)->modify('+'.fake()->numberBetween(1, 14).' days');

        return [
            'room_id' => Room::factory(),
            'renter_id' => User::factory(),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
        ];
    }
}
