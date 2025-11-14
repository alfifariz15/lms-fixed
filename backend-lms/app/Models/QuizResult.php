<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'answer',
        'is_correct',
        'quiz_attempt'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relasi dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi dengan quiz
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
