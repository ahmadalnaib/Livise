<?php

namespace App\Models;

use Database\Factories\CityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class City extends Model
{
    /** @use HasFactory<CityFactory> */
    use HasFactory;

    public const COMMON_GERMAN_CITIES = [
        'Berlin',
        'Hamburg',
        'Munich',
        'Cologne',
        'Frankfurt am Main',
        'Stuttgart',
        'Dusseldorf',
        'Leipzig',
        'Dortmund',
        'Essen',
        'Bremen',
        'Dresden',
        'Hanover',
        'Nuremberg',
        'Bonn',
        'Mannheim',
        'Heidelberg',
        'Freiburg im Breisgau',
    ];

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
