<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'role', 'tenant_approved_at', 'password', 'languages', 'skills', 'hobbies', 'bio'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'tenant_approved_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'languages' => 'array',
            'skills' => 'array',
            'hobbies' => 'array',
        ];
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'owner_id');
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class, 'renter_id');
    }

    public function seekerSession(): HasOne
    {
        return $this->hasOne(SeekerSession::class);
    }

    public function bookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class, 'renter_id');
    }

    public function landlordBookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class, 'landlord_id');
    }

    public function approvedBookingRequests(): HasMany
    {
        return $this->hasMany(BookingRequest::class, 'approved_by');
    }

    public function ratingsGiven(): HasMany
    {
        return $this->hasMany(Rating::class, 'rater_id');
    }

    public function ratingsReceived(): HasMany
    {
        return $this->hasMany(Rating::class, 'rated_id');
    }

    public function averageRating(): float
    {
        return (float) $this->ratingsReceived()->avg('rating') ?? 0;
    }
}
