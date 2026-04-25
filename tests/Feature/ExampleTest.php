<?php

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('tenant and landlord welcome pages return successful responses', function () {
    $this->get(route('welcome.tenant'))->assertOk();
    $this->get(route('welcome.landlord'))->assertOk();
});
