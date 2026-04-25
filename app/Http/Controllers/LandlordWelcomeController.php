<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class LandlordWelcomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isLandlordWorkspace = $user?->role === 'landlord';

        return Inertia::render('welcome/tenant', [
            'canRegister' => Features::enabled(Features::registration()),
            'isLandlordWorkspace' => $isLandlordWorkspace,
            ...($isLandlordWorkspace ? [
                'listingTypeOptions' => $this->listingTypeOptions(),
                'facilityOptions' => $this->facilityOptions(),
                'draftContact' => $this->draftContact($user->name, $user->email),
                'existingListings' => $user->rooms()
                    ->with('images')
                    ->latest()
                    ->get()
                    ->map(fn (Room $room): array => [
                        'id' => $room->id,
                        'title' => $room->title,
                        'listing_type' => $room->listing_type,
                        'size_label' => $room->size_label,
                        'contact_email' => $room->contact_email,
                        'facilities' => $room->facilities ?? [],
                        'image_count' => $room->images->count(),
                    ])
                    ->values()
                    ->all(),
            ] : []),
        ]);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function listingTypeOptions(): array
    {
        return [
            ['value' => 'room', 'label' => 'Room'],
            ['value' => 'apartment', 'label' => 'Apartment'],
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function facilityOptions(): array
    {
        return [
            ['value' => 'washing_machine', 'label' => 'Washing machine'],
            ['value' => 'dishwasher', 'label' => 'Dishwasher'],
            ['value' => 'lift', 'label' => 'Lift'],
        ];
    }

    /**
     * @return array{first_name: string, last_name: string, email: string}
     */
    private function draftContact(string $name, string $email): array
    {
        $segments = preg_split('/\s+/', trim($name)) ?: [];
        $firstName = $segments[0] ?? '';
        $lastName = trim(implode(' ', array_slice($segments, 1)));

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
        ];
    }
}
