<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Room;
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
        $rooms = Room::query()
            ->with(['city:id,name', 'owner:id,name'])
            ->doesntHave('rentals')
            ->latest('id')
            ->get();

        $roomCards = $rooms
            ->map(fn(Room $room): array => $this->roomCard($room))
            ->all();
        $availableRoomIds = $rooms->modelKeys();
        $likedRoomIds = collect($session->liked_room_ids ?? [])->intersect($availableRoomIds)->values()->all();
        $passedRoomIds = collect($session->passed_room_ids ?? [])->intersect($availableRoomIds)->values()->all();

        return Inertia::render('dashboard/seeker', [
            'rooms' => $roomCards,
            'seekerSession' => [
                'answers' => $session->answers,
                'likedRoomIds' => $likedRoomIds,
                'passedRoomIds' => $passedRoomIds,
                'currentIndex' => min($session->current_index, count($roomCards)),
                'questionnaireCompleted' => $session->questionnaire_completed,
            ],
            'favoriteRooms' => collect($roomCards)
                ->filter(fn(array $room): bool => in_array($room['id'], $likedRoomIds, true))
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
        $roomIds = Room::query()->pluck('id')->all();

        $validated = $request->validate([
            'roomId' => ['required', 'integer', Rule::in($roomIds)],
            'direction' => ['required', Rule::in(['left', 'right'])],
        ]);

        $session = $this->seekerSession($request);
        $likedRoomIds = collect($session->liked_room_ids ?? []);
        $passedRoomIds = collect($session->passed_room_ids ?? []);

        if ($validated['direction'] === 'right') {
            $likedRoomIds = $likedRoomIds->push($validated['roomId'])->unique()->values();
            $passedRoomIds = $passedRoomIds->reject(fn(int $roomId): bool => $roomId === $validated['roomId'])->values();
        } else {
            $passedRoomIds = $passedRoomIds->push($validated['roomId'])->unique()->values();
            $likedRoomIds = $likedRoomIds->reject(fn(int $roomId): bool => $roomId === $validated['roomId'])->values();
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
     * @return array{id: int, title: string, city: string, pricePerNight: string, tags: list<string>, image: string, description: string, ownerName: string}
     */
    private function roomCard(Room $room): array
    {
        return [
            'id' => $room->id,
            'title' => $room->title,
            'city' => (string) $room->city?->name,
            'pricePerNight' => $room->pricePerNightLabel(),
            'tags' => $room->catalogHighlights(),
            'image' => $room->catalogImage(),
            'description' => (string) $room->description,
            'ownerName' => (string) $room->owner?->name,
        ];
    }
}
