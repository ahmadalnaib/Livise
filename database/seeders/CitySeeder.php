<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (City::COMMON_GERMAN_CITIES as $cityName) {
            City::query()->firstOrCreate(['name' => $cityName]);
        }
    }
}
