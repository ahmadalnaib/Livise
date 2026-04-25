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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'city_id' => ['required', 'exists:cities,id'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'price_period' => ['required', Rule::in(Room::PRICE_PERIODS)],
            'size_label' => ['required', 'string', 'max:255'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', Rule::in(Room::FACILITIES)],
            'photos' => ['required', 'array', 'min:1', 'max:10'],
            'photos.*' => ['required', File::image()->max('5mb')],
        ];
    }
}
