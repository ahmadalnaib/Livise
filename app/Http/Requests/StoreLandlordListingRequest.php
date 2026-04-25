<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreLandlordListingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'landlord';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'listing_type' => ['required', Rule::in(Room::LISTING_TYPES)],
            'contact_first_name' => ['required', 'string', 'max:255'],
            'contact_last_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'size_label' => ['required', 'string', 'max:255'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', Rule::in(Room::FACILITIES)],
            'photos' => ['required', 'array', 'min:1', 'max:10'],
            'photos.*' => ['required', File::image()->max('5mb')],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
