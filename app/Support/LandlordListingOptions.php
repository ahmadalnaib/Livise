<?php

namespace App\Support;

use App\Models\City;
use App\Models\Room;

class LandlordListingOptions
{
    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function cityOptions(): array
    {
        foreach (City::COMMON_GERMAN_CITIES as $cityName) {
            City::query()->firstOrCreate(['name' => $cityName]);
        }

        return City::query()
            ->orderBy('name')
            ->get()
            ->map(fn(City $city): array => [
                'value' => (string) $city->id,
                'label' => $city->name,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function pricePeriodOptions(): array
    {
        return [
            ['value' => 'night', 'label' => 'Per night'],
            ['value' => 'month', 'label' => 'Per month'],
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function listingTypeOptions(): array
    {
        return [
            ['value' => 'room', 'label' => 'Room'],
            ['value' => 'apartment', 'label' => 'Apartment'],
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function facilityOptions(): array
    {
        return collect(Room::FACILITIES)
            ->map(fn(string $facility): array => [
                'value' => $facility,
                'label' => match ($facility) {
                    'wifi' => 'Wi-Fi',
                    'air_conditioning' => 'Air conditioning',
                    'private_bathroom' => 'Private bathroom',
                    'pets_allowed' => 'Pets allowed',
                    'smoke_alarm' => 'Smoke alarm',
                    default => str($facility)->replace('_', ' ')->title()->value(),
                },
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function volunteerHelpOptions(): array
    {
        return collect(Room::VOLUNTEER_HELP_OPTIONS)
            ->map(fn(string $option): array => [
                'value' => $option,
                'label' => match ($option) {
                    'help_with_shopping' => 'Help with shopping',
                    'help_with_cooking' => 'Help with cooking',
                    'help_with_appointments' => 'Help with appointments',
                    'help_with_garden' => 'Help with garden',
                    'pet_care' => 'Pet care',
                    'tech_help' => 'Tech help',
                    'errands' => 'Errands',
                    'moving_help' => 'Moving help',
                    'light_cleaning' => 'Light cleaning',
                    'car_rides' => 'Car rides',
                    'friendly_visits' => 'Friendly visits',
                    'other' => 'Other',
                    default => str($option)->replace('_', ' ')->title()->value(),
                },
            ])
            ->values()
            ->all();
    }
}
