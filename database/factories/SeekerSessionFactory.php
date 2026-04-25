<?php

namespace Database\Factories;

use App\Models\SeekerSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SeekerSession>
 */
class SeekerSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'answers' => null,
            'liked_room_ids' => [],
            'passed_room_ids' => [],
            'current_index' => 0,
            'questionnaire_completed' => false,
        ];
    }
}
