<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RatingController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'rated_id' => 'required|exists:users,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
            'qualities' => 'nullable|array',
            'qualities.*' => ['string', Rule::in(Rating::TENANT_QUALITIES)],
            'type' => 'required|in:tenant_to_landlord,landlord_to_tenant',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        // Prevent duplicate ratings
        $existingRating = Rating::where('rater_id', $request->user()->id)
            ->where('rated_id', $data['rated_id'])
            ->where('type', $data['type'])
            ->first();

        if ($existingRating) {
            return back()->with('error', 'You have already rated this user.');
        }

        Rating::create([
            'rater_id' => $request->user()->id,
            'rated_id' => $data['rated_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'qualities' => array_values($data['qualities'] ?? []),
            'type' => $data['type'],
        ]);

        return back()->with('success', 'Rating submitted successfully!');
    }
}
