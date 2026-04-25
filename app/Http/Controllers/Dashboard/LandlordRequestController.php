<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\LandlordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandlordRequestController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        LandlordRequest::query()->create($validated);

        return redirect()->back()->with('success', 'Thank you! We will contact you soon.');
    }

    public function index(): Response
    {
        $requests = LandlordRequest::query()
            ->latest()
            ->get();

        return Inertia::render('dashboard/admin-landlord-requests', [
            'requests' => $requests,
        ]);
    }

    public function updateStatus(Request $request, LandlordRequest $landlordRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
        ]);

        $landlordRequest->update($validated);

        return redirect()->back()->with('success', 'Status updated.');
    }
}
