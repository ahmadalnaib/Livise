<?php

namespace App\Models;

use Database\Factories\RoomImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['room_id', 'path', 'sort_order'])]
class RoomImage extends Model
{
    /** @use HasFactory<RoomImageFactory> */
    use HasFactory;

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
