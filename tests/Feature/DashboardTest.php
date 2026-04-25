<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated seekers are redirected to seeker dashboard', function () {
    $user = User::factory()->create(['role' => 'seeker']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('dashboard.seeker', absolute: false));
});

test('admin can access only admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get(route('dashboard.admin'))->assertOk();
    $this->get(route('dashboard.seeker'))->assertForbidden();
    $this->get(route('dashboard.tenant'))->assertForbidden();
});

test('tenant can access only tenant dashboard', function () {
    $tenant = User::factory()->create(['role' => 'tenant']);
    $this->actingAs($tenant);

    $this->get(route('dashboard.tenant'))->assertOk();
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.seeker'))->assertForbidden();
});

test('seeker can access only seeker dashboard', function () {
    $seeker = User::factory()->create(['role' => 'seeker']);
    $this->actingAs($seeker);

    $this->get(route('dashboard.seeker'))->assertOk();
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.tenant'))->assertForbidden();
});
