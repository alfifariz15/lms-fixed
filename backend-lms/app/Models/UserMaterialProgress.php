<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMaterialProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'material_id',
        'video_completed',
        'watch_duration',
        'quiz_completed',
        'is_unlocked'
    ];

    protected $casts = [
        'video_completed' => 'boolean',
        'quiz_completed' => 'boolean',
        'is_unlocked' => 'boolean',
    ];

    // Relasi dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi dengan material
    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
