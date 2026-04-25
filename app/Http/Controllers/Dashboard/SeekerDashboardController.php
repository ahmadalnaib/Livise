<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\SeekerSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SeekerDashboardController extends Controller
{
    public function show(Request $request): Response
    {
        $session = $this->seekerSession($request);
        $rooms = $this->roomDeck();
        $likedRoomIds = $session->liked_room_ids ?? [];

        return Inertia::render('dashboard/seeker', [
            'rooms' => $rooms,
            'seekerSession' => [
                'answers' => $session->answers,
                'likedRoomIds' => $likedRoomIds,
                'passedRoomIds' => $session->passed_room_ids ?? [],
                'currentIndex' => $session->current_index,
                'questionnaireCompleted' => $session->questionnaire_completed,
            ],
            'favoriteRooms' => collect($rooms)
                ->filter(fn (array $room): bool => in_array($room['id'], $likedRoomIds, true))
                ->values()
                ->all(),
        ]);
    }

    public function storePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'roomSize' => ['required', Rule::in(['small', 'medium', 'large'])],
            'budget' => ['required', Rule::in(['low', 'mid', 'high'])],
            'roommatePreference' => ['required', Rule::in(['private', 'shared', 'either'])],
            'preferredCityType' => ['required', Rule::in(['central', 'quiet', 'coastal'])],
            'stayLength' => ['required', Rule::in(['short', 'medium', 'long'])],
        ]);

        $session = $this->seekerSession($request);
        $session->update([
            'answers' => $validated,
            'questionnaire_completed' => true,
        ]);

        return back();
    }

    public function storeSwipe(Request $request): RedirectResponse
    {
        $roomIds = collect($this->roomDeck())->pluck('id')->all();

        $validated = $request->validate([
            'roomId' => ['required', 'integer', Rule::in($roomIds)],
            'direction' => ['required', Rule::in(['left', 'right'])],
        ]);

        $session = $this->seekerSession($request);
        $likedRoomIds = collect($session->liked_room_ids ?? []);
        $passedRoomIds = collect($session->passed_room_ids ?? []);

        if ($validated['direction'] === 'right') {
            $likedRoomIds = $likedRoomIds->push($validated['roomId'])->unique()->values();
            $passedRoomIds = $passedRoomIds->reject(fn (int $roomId): bool => $roomId === $validated['roomId'])->values();
        } else {
            $passedRoomIds = $passedRoomIds->push($validated['roomId'])->unique()->values();
            $likedRoomIds = $likedRoomIds->reject(fn (int $roomId): bool => $roomId === $validated['roomId'])->values();
        }

        $session->update([
            'liked_room_ids' => $likedRoomIds->all(),
            'passed_room_ids' => $passedRoomIds->all(),
            'current_index' => min(count($roomIds), $session->current_index + 1),
            'questionnaire_completed' => true,
        ]);

        return back();
    }

    public function reset(Request $request): RedirectResponse
    {
        $session = $this->seekerSession($request);

        $session->update([
            'answers' => null,
            'liked_room_ids' => [],
            'passed_room_ids' => [],
            'current_index' => 0,
            'questionnaire_completed' => false,
        ]);

        return back();
    }

    private function seekerSession(Request $request): SeekerSession
    {
        return SeekerSession::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'answers' => null,
                'liked_room_ids' => [],
                'passed_room_ids' => [],
                'current_index' => 0,
                'questionnaire_completed' => false,
            ],
        );
    }

    /**
     * @return list<array{id: int, title: string, city: string, pricePerNight: string, tags: list<string>, image: string}>
     */
    private function roomDeck(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Sunset Balcony Studio',
                'city' => 'Amman',
                'pricePerNight' => '$46',
                'tags' => ['Wi-Fi', 'Near Downtown', 'Balcony'],
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'id' => 2,
                'title' => 'Aqaba Sea Breeze Room',
                'city' => 'Aqaba',
                'pricePerNight' => '$58',
                'tags' => ['Sea View', 'Private Bath', 'AC'],
                'image' => 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'id' => 3,
                'title' => 'Minimal Corner Loft',
                'city' => 'Irbid',
                'pricePerNight' => '$39',
                'tags' => ['Quiet Area', 'Kitchen', 'Long Stay'],
                'image' => 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'id' => 4,
                'title' => 'Olive Garden Room',
                'city' => 'Jerash',
                'pricePerNight' => '$41',
                'tags' => ['Parking', 'Garden', 'Fast Check-in'],
                'image' => 'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1200&q=80',
            ],
        ];
    }
}
