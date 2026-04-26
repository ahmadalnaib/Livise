<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['rater_id', 'rated_id', 'rating', 'comment', 'qualities', 'type'])]
class Rating extends Model
{
    public const TENANT_QUALITIES = [
        'cleanliness',
        'polite',
        'helpful',
        'communication',
        'respectful',
        'reliable',
    ];

    protected function casts(): array
    {
        return [
            'qualities' => 'array',
        ];
    }

    public function rater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function rated(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rated_id');
    }
}
