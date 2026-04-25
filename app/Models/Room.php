<?php

namespace App\Models;

use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['city_id', 'owner_id', 'title', 'description', 'price_per_night'])]
class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }

    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class);
    }

    public function pricePerNightLabel(): string
    {
        return '$'.number_format((float) $this->price_per_night, 0);
    }

    /**
     * @return list<string>
     */
    public function catalogHighlights(): array
    {
        $highlightSets = [
            ['Fast Wi-Fi', 'Private Bath', 'Flexible Stay'],
            ['Bright Interior', 'Quiet Street', 'Easy Check-in'],
            ['Near Downtown', 'Kitchen Access', 'Long Stay'],
            ['Balcony View', 'Safe Area', 'Work Desk'],
            ['Air Conditioning', 'Natural Light', 'Parking'],
            ['Garden Corner', 'Calm Nights', 'City Access'],
        ];

        return $highlightSets[$this->id % count($highlightSets)];
    }

    public function catalogImage(): string
    {
        $images = [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        ];

        return $images[$this->id % count($images)];
    }

    public function overlapsRentalPeriod(string $startsAt, string $endsAt): bool
    {
        return $this->rentals()
            ->whereDate('starts_at', '<=', $endsAt)
            ->whereDate('ends_at', '>=', $startsAt)
            ->exists();
    }
}
