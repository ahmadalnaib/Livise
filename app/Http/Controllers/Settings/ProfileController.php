<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Rating;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Get ratings received by this user
        $ratingsReceived = $user->ratingsReceived()
            ->with('rater')
            ->latest()
            ->get()
            ->map(fn (Rating $rating): array => [
                'id' => $rating->id,
                'rater_name' => $rating->rater->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'qualities' => is_array($rating->qualities) ? $rating->qualities : [],
                'type' => $rating->type,
                'created_at' => $rating->created_at->toISOString(),
            ]);

        // Get ratings given by this user
        $ratingsGiven = $user->ratingsGiven()
            ->with('rated')
            ->latest()
            ->get()
            ->map(fn (Rating $rating): array => [
                'id' => $rating->id,
                'rated_name' => $rating->rated->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'qualities' => is_array($rating->qualities) ? $rating->qualities : [],
                'type' => $rating->type,
                'created_at' => $rating->created_at->toISOString(),
            ]);

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'averageRating' => round($user->averageRating(), 1),
            'totalRatings' => $user->ratingsReceived()->count(),
            'ratingsReceived' => $ratingsReceived,
            'ratingsGiven' => $ratingsGiven,
            'languages' => is_array($user->languages) ? $user->languages : [],
            'skills' => is_array($user->skills) ? $user->skills : [],
            'hobbies' => is_array($user->hobbies) ? $user->hobbies : [],
            'bio' => $user->bio,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
