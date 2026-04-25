<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated tenants are redirected to tenant dashboard', function () {
    $user = User::factory()->create(['role' => 'tenant']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('dashboard.tenant', absolute: false));
});

test('admin can access only admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get(route('dashboard.admin'))->assertOk();
    $this->get(route('dashboard.tenant'))->assertForbidden();
    $this->get(route('dashboard.landlord'))->assertForbidden();
});

test('landlord can access only landlord dashboard', function () {
    $landlord = User::factory()->create(['role' => 'landlord']);
    $this->actingAs($landlord);

    $this->get(route('dashboard.landlord'))->assertOk();
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.tenant'))->assertForbidden();
});

test('tenant can access only tenant dashboard', function () {
    $tenant = User::factory()->create(['role' => 'tenant']);
    $this->actingAs($tenant);

    $this->get(route('dashboard.tenant'))->assertOk();
    $this->get(route('dashboard.admin'))->assertForbidden();
    $this->get(route('dashboard.landlord'))->assertForbidden();
});
