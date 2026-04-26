<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    /**
     * Show the onboarding page for profile completion.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // If user already has profile info, skip onboarding
        if ($user->languages || $user->skills || $user->hobbies || $user->bio) {
            return redirect()->intended('/dashboard');
        }

        return Inertia::render('auth/onboarding', [
            'languages' => is_array($user->languages) ? $user->languages : [],
            'skills' => is_array($user->skills) ? $user->skills : [],
            'hobbies' => is_array($user->hobbies) ? $user->hobbies : [],
            'bio' => $user->bio,
        ]);
    }

    /**
     * Store the onboarding profile data.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:100'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'hobbies' => ['nullable', 'array'],
            'hobbies.*' => ['string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $request->user()->update($validated);

        return redirect()->intended('/dashboard');
    }
}
