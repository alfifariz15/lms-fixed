<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description', 
        'video_url',
        'order',
        'duration',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relasi dengan quizzes
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    // Relasi dengan user progress
    public function userProgress()
    {
        return $this->hasMany(UserMaterialProgress::class);
    }

    // Get quiz for this material
    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
}
