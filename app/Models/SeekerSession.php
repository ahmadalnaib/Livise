<?php

namespace App\Models;

use Database\Factories\SeekerSessionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeekerSession extends Model
{
    /** @use HasFactory<SeekerSessionFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'answers',
        'liked_room_ids',
        'passed_room_ids',
        'current_index',
        'questionnaire_completed',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'liked_room_ids' => 'array',
            'passed_room_ids' => 'array',
            'questionnaire_completed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
