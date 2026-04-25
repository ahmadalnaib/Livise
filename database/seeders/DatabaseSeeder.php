<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CitySeeder::class);
        $this->call(RoomSeeder::class);

        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Demo',
                'role' => 'admin',
                'tenant_approved_at' => now(),
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'tenant@example.com'],
            [
                'name' => 'Tenant Demo',
                'role' => 'tenant',
                'tenant_approved_at' => now(),
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'landlord@example.com'],
            [
                'name' => 'Landlord Demo',
                'role' => 'landlord',
                'tenant_approved_at' => now(),
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );
    }
}
