<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\DashboardController;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard/guru', [DashboardController::class, 'guruDashboard'])->middleware('role:guru');
    Route::get('/dashboard/siswa', [DashboardController::class, 'siswaDashboard'])->middleware('role:siswa');
    
    // Materials
    Route::get('/materials', [MaterialController::class, 'index']);
    Route::get('/materials/{id}', [MaterialController::class, 'show']);
    Route::post('/materials/{id}/video-progress', [MaterialController::class, 'updateVideoProgress']);
    
    // Quizzes
    Route::get('/materials/{materialId}/quiz', [QuizController::class, 'getQuiz']);
    Route::post('/quiz/{quizId}/submit', [QuizController::class, 'submitAnswer']);
    Route::get('/quiz-results/{userId?}', [QuizController::class, 'getUserResults']);
});

// Public Routes
Route::get('/users', function () {
    return response()->json(User::all());
});
