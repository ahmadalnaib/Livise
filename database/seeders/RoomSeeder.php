<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Room::query()->exists()) {
            return;
        }

        /** @var array<string, City> $cities */
        $cities = [];

        foreach (City::COMMON_GERMAN_CITIES as $cityName) {
            $cities[$cityName] = City::query()->firstOrCreate(['name' => $cityName]);
        }

        $owners = collect([
            ['name' => 'Layla Host', 'email' => 'landlord1@example.com'],
            ['name' => 'Omar Suites', 'email' => 'landlord2@example.com'],
            ['name' => 'Mira Homes', 'email' => 'landlord3@example.com'],
            ['name' => 'Yazan Rooms', 'email' => 'landlord4@example.com'],
        ])->map(fn (array $owner): User => User::query()->updateOrCreate(
            ['email' => $owner['email']],
            [
                'name' => $owner['name'],
                'role' => 'landlord',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
            ],
        ));

        collect([
            [
                'city' => 'Berlin',
                'title' => 'Sunlit Studio Near Mitte',
                'description' => 'A calm studio with soft daylight, a compact desk, and easy access to cafes and transport in central Berlin.',
                'price_per_night' => 52,
            ],
            [
                'city' => 'Hamburg',
                'title' => 'Canal Side Private Room',
                'description' => 'A clean private room designed for short city stays, with a relaxed mood and quick access to the waterfront.',
                'price_per_night' => 64,
            ],
            [
                'city' => 'Leipzig',
                'title' => 'Quiet Student Loft',
                'description' => 'Ideal for focused stays, with a reading corner, practical storage, and a peaceful neighborhood atmosphere.',
                'price_per_night' => 38,
            ],
            [
                'city' => 'Heidelberg',
                'title' => 'Garden View Guest Room',
                'description' => 'An airy room with greenery outside, perfect for longer stays and travelers who prefer slower mornings.',
                'price_per_night' => 44,
            ],
            [
                'city' => 'Munich',
                'title' => 'Warm Corner Suite',
                'description' => 'A softly styled suite with flexible check-in, a comfortable bed, and enough space for work and rest.',
                'price_per_night' => 57,
            ],
            [
                'city' => 'Cologne',
                'title' => 'Historic Hillside Room',
                'description' => 'A cozy room in a classic neighborhood setting, with a welcoming host and easy city access.',
                'price_per_night' => 41,
            ],
            [
                'city' => 'Frankfurt am Main',
                'title' => 'Minimal Executive Stay',
                'description' => 'Designed for tenants who want a refined room, fast Wi-Fi, and a polished business-ready setting.',
                'price_per_night' => 72,
            ],
            [
                'city' => 'Stuttgart',
                'title' => 'Compact City Retreat',
                'description' => 'Small, bright, and efficient, with a fresh feel and a practical layout for weekend or weekly stays.',
                'price_per_night' => 49,
            ],
        ])->values()->each(function (array $roomData, int $index) use ($cities, $owners): void {
            Room::query()->create([
                'city_id' => $cities[$roomData['city']]->id,
                'owner_id' => $owners[$index % $owners->count()]->id,
                'status' => 'confirmed',
                'title' => $roomData['title'],
                'description' => $roomData['description'],
                'price_per_night' => $roomData['price_per_night'],
                'price_period' => 'night',
            ]);
        });
    }
}
