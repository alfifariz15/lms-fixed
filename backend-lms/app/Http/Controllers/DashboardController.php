<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\QuizResult;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function guruDashboard()
    {
        $user = Auth::user();
        
        if ($user->role !== 'guru') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya guru yang dapat mengakses halaman ini'
            ], 403);
        }

        // Get total siswa
        $totalSiswa = User::where('role', 'siswa')->count();

        // Get all quizzes untuk referensi
        $quizzes = \App\Models\Quiz::with('material')
            ->orderBy('material_id')
            ->orderBy('quiz_variant')
            ->get();

        // Get siswa dengan SEMUA hasil quiz mereka (benar dan salah)
        $siswaData = User::where('role', 'siswa')
            ->with(['quizResults.quiz.material'])
            ->orderBy('name')
            ->get()
            ->map(function($siswa) use ($quizzes) {
                // Buat array untuk menyimpan jawaban per quiz
                $quizAnswers = [];
                
                foreach($quizzes as $quiz) {
                    $key = 'K' . $quiz->material_id . $quiz->quiz_variant;
                    
                    // Cari jawaban siswa untuk quiz ini
                    $result = $siswa->quizResults->firstWhere('quiz_id', $quiz->id);
                    
                    if ($result) {
                        $quizAnswers[$key] = [
                            'answer' => $result->answer,
                            'is_correct' => $result->is_correct,
                            'quiz_variant' => $quiz->quiz_variant,
                            'material_id' => $quiz->material_id
                        ];
                    } else {
                        $quizAnswers[$key] = null;
                    }
                }

                return [
                    'id' => $siswa->id,
                    'name' => $siswa->name,
                    'kelas' => $siswa->kelas,
                    'quiz_answers' => $quizAnswers
                ];
            });

        return response()->json([
            'success' => true,
            'dashboard' => [
                'total_siswa' => $totalSiswa,
                'siswa_data' => $siswaData
            ]
        ]);
    }

    public function siswaDashboard()
    {
        $user = Auth::user();
        
        if ($user->role !== 'siswa') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya siswa yang dapat mengakses halaman ini'
            ], 403);
        }

        // Get user progress
        $userProgress = $user->materialProgress()
            ->with(['material'])
            ->get();

        $completedMaterials = $userProgress->where('quiz_completed', true)->count();
        $totalMaterials = \App\Models\Material::where('is_active', true)->count();

        return response()->json([
            'success' => true,
            'dashboard' => [
                'user' => [
                    'name' => $user->name,
                    'kelas' => $user->kelas
                ],
                'progress' => [
                    'completed_materials' => $completedMaterials,
                    'total_materials' => $totalMaterials,
                    'percentage' => $totalMaterials > 0 ? round(($completedMaterials / $totalMaterials) * 100, 1) : 0
                ],
                'recent_activities' => $user->quizResults()
                    ->with(['quiz.material'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function($result) {
                        return [
                            'material_title' => $result->quiz->material->title,
                            'is_correct' => $result->is_correct,
                            'date' => $result->created_at->format('d/m/Y H:i')
                        ];
                    })
            ]
        ]);
    }
}
