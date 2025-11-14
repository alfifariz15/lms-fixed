<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'title',
        'question',
        'options',
        'correct_answer',
        'quiz_variant'
    ];

    protected $casts = [
        'options' => 'array',
    ];

    // Relasi dengan material
    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    // Relasi dengan quiz results
    public function results()
    {
        return $this->hasMany(QuizResult::class);
    }
}
