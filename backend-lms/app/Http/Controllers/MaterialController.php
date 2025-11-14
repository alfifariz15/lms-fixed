<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\UserMaterialProgress;
use App\Models\Quiz;
use Illuminate\Support\Facades\Auth;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::where('is_active', true)
            ->orderBy('order')
            ->get();

        $user = Auth::user();
        
        if ($user->role === 'siswa') {
            // Add progress information for each material
            foreach ($materials as $material) {
                $progress = UserMaterialProgress::where('user_id', $user->id)
                    ->where('material_id', $material->id)
                    ->first();

                $material->progress = $progress ? [
                    'video_completed' => $progress->video_completed,
                    'quiz_completed' => $progress->quiz_completed,
                    'is_unlocked' => $progress->is_unlocked,
                    'watch_duration' => $progress->watch_duration,
                ] : [
                    'video_completed' => false,
                    'quiz_completed' => false,
                    'is_unlocked' => $material->order === 1, // First material is always unlocked
                    'watch_duration' => 0,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'materials' => $materials
        ]);
    }

    public function show($id)
    {
        $material = Material::findOrFail($id);
        $user = Auth::user();

        if ($user->role === 'siswa') {
            // Check if user can access this material
            $progress = UserMaterialProgress::where('user_id', $user->id)
                ->where('material_id', $material->id)
                ->first();

            // If no progress record exists and this is not the first material, check if previous material is completed
            if (!$progress && $material->order > 1) {
                $previousMaterial = Material::where('order', $material->order - 1)->first();
                if ($previousMaterial) {
                    $previousProgress = UserMaterialProgress::where('user_id', $user->id)
                        ->where('material_id', $previousMaterial->id)
                        ->first();
                    
                    if (!$previousProgress || !$previousProgress->quiz_completed) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Selesaikan materi sebelumnya terlebih dahulu'
                        ], 403);
                    }
                }
            }

            // Create progress record if not exists
            if (!$progress) {
                $progress = UserMaterialProgress::create([
                    'user_id' => $user->id,
                    'material_id' => $material->id,
                    'is_unlocked' => $material->order === 1
                ]);
            }

            $material->progress = [
                'video_completed' => $progress->video_completed,
                'quiz_completed' => $progress->quiz_completed,
                'is_unlocked' => $progress->is_unlocked,
                'watch_duration' => $progress->watch_duration,
            ];
        }

        return response()->json([
            'success' => true,
            'material' => $material
        ]);
    }

    public function updateVideoProgress(Request $request, $id)
    {
        $request->validate([
            'watch_duration' => 'required|integer|min:0',
            'video_completed' => 'boolean'
        ]);

        $user = Auth::user();
        $material = Material::findOrFail($id);

        $progress = UserMaterialProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'material_id' => $material->id
            ],
            [
                'watch_duration' => $request->watch_duration,
                'video_completed' => $request->video_completed ?? false,
                'is_unlocked' => true
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Progress video berhasil disimpan',
            'progress' => $progress
        ]);
    }
}
