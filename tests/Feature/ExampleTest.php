<?php

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('seeker and tenant welcome pages return successful responses', function () {
    $this->get(route('welcome.seeker'))->assertOk();
    $this->get(route('welcome.tenant'))->assertOk();
});
