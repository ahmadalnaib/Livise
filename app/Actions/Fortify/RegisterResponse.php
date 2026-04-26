<?php

namespace App\Actions\Fortify;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\RegisterResponse as ContractsRegisterResponse;

class RegisterResponse implements ContractsRegisterResponse
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): RedirectResponse
    {
        // For tenants, redirect to onboarding to complete profile
        // For landlords, redirect to dashboard
        $user = $request->user();

        if ($user && $user->role === 'tenant' && ! $user->languages && ! $user->skills && ! $user->hobbies && ! $user->bio) {
            return redirect()->route('onboarding');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
