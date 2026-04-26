<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Contracts\RegisterResponse;

class RegisteredUserController extends Controller implements CreatesNewUsers
{
    public function __construct(
        private CreatesNewUsers $creator,
    ) {}

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RegisterResponse
    {
        $user = $this->creator->create($request->all());

        Auth::login($user);

        return app(RegisterResponse::class);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array<string, string>
     * @return Model|User
     */
    public function create(array $input)
    {
        return User::class;
    }
}
