<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\UserMaterialProgress;
use App\Models\Material;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function getQuiz($materialId)
    {
        $user = Auth::user();
        $material = Material::findOrFail($materialId);
        
        // Check if user has completed the video
        $progress = UserMaterialProgress::where('user_id', $user->id)
            ->where('material_id', $materialId)
            ->first();

        // For testing purposes, create progress if not exists or auto-complete video
        if (!$progress) {
            $progress = UserMaterialProgress::create([
                'user_id' => $user->id,
                'material_id' => $materialId,
                'video_completed' => true,  // Auto-complete for testing
                'quiz_completed' => false,
                'last_video_position' => 100
            ]);
        } elseif (!$progress->video_completed) {
            // Auto-complete video for testing
            $progress->update(['video_completed' => true]);
        }

        // Determine which quiz variant to show (A or B)
        $quizVariant = $this->determineQuizVariant($user->id, $materialId);
        
        \Log::info("QuizController::getQuiz - User {$user->id}, Material {$materialId}, Determined variant: {$quizVariant}");
        
        $quiz = Quiz::where('material_id', $materialId)
            ->where('quiz_variant', $quizVariant)
            ->first();
        
        if (!$quiz) {
            \Log::error("QuizController::getQuiz - Quiz not found for material {$materialId}, variant {$quizVariant}");
            return response()->json([
                'success' => false,
                'message' => 'Kuis tidak ditemukan'
            ], 404);
        }

        // Check if user has completed this specific quiz variant
        $existingResult = QuizResult::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->first();

        // Get info about other variant attempts for debugging
        $otherVariant = $quizVariant === 'A' ? 'B' : 'A';
        $otherQuiz = Quiz::where('material_id', $materialId)
            ->where('quiz_variant', $otherVariant)
            ->first();
        $otherAttempt = null;
        if ($otherQuiz) {
            $otherAttempt = QuizResult::where('user_id', $user->id)
                ->where('quiz_id', $otherQuiz->id)
                ->first();
        }

        return response()->json([
            'success' => true,
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'question' => $quiz->question,
                'options' => $quiz->options,
                'material_id' => $quiz->material_id,
                'quiz_variant' => $quiz->quiz_variant,
                'completed' => $existingResult ? true : false
            ],
            'debug_info' => [
                'current_variant' => $quizVariant,
                'current_attempt' => $existingResult ? [
                    'is_correct' => $existingResult->is_correct,
                    'quiz_attempt' => $existingResult->quiz_attempt
                ] : null,
                'other_variant' => $otherVariant,
                'other_attempt' => $otherAttempt ? [
                    'is_correct' => $otherAttempt->is_correct,
                    'quiz_attempt' => $otherAttempt->quiz_attempt
                ] : null
            ]
        ]);
    }

    private function determineQuizVariant($userId, $materialId)
    {
        \Log::info("=================================================");
        \Log::info("DETERMINING QUIZ VARIANT");
        \Log::info("User ID: $userId");
        \Log::info("Material ID: $materialId");
        
        // Get both quiz A and B for this material
        $quizA = Quiz::where('material_id', $materialId)
            ->where('quiz_variant', 'A')
            ->first();
            
        $quizB = Quiz::where('material_id', $materialId)
            ->where('quiz_variant', 'B')
            ->first();
            
        \Log::info("Quiz A found: " . ($quizA ? "Yes (ID: {$quizA->id})" : 'No'));
        \Log::info("Quiz B found: " . ($quizB ? "Yes (ID: {$quizB->id})" : 'No'));
            
        if (!$quizA || !$quizB) {
            \Log::info("⚠️ Missing quiz A or B, returning default 'A'");
            \Log::info("=================================================");
            return 'A'; // Default if quizzes don't exist
        }

        // Check attempts for Quiz A
        $attemptA = QuizResult::where('user_id', $userId)
            ->where('quiz_id', $quizA->id)
            ->first();

        // Check attempts for Quiz B
        $attemptB = QuizResult::where('user_id', $userId)
            ->where('quiz_id', $quizB->id)
            ->first();

        \Log::info("--- Quiz A Attempt ---");
        if ($attemptA) {
            \Log::info("✅ EXISTS - QuizResult ID: {$attemptA->id}");
            \Log::info("   Answer: {$attemptA->answer}");
            \Log::info("   Is Correct: " . ($attemptA->is_correct ? 'TRUE (Correct)' : 'FALSE (Wrong)'));
            \Log::info("   Created: {$attemptA->created_at}");
        } else {
            \Log::info("❌ NO ATTEMPT YET");
        }
        
        \Log::info("--- Quiz B Attempt ---");
        if ($attemptB) {
            \Log::info("✅ EXISTS - QuizResult ID: {$attemptB->id}");
            \Log::info("   Answer: {$attemptB->answer}");
            \Log::info("   Is Correct: " . ($attemptB->is_correct ? 'TRUE (Correct)' : 'FALSE (Wrong)'));
            \Log::info("   Created: {$attemptB->created_at}");
        } else {
            \Log::info("❌ NO ATTEMPT YET");
        }

        // Logic:
        // 1. No attempts yet -> Show Quiz A
        // 2. Quiz A attempted and CORRECT -> Show Quiz A (completed)
        // 3. Quiz A attempted and WRONG, but no Quiz B attempt -> Show Quiz B
        // 4. Both attempted -> Show Quiz B (final attempt)

        \Log::info("--- Decision Logic ---");
        
        if (!$attemptA) {
            // No attempt A yet -> Show Quiz A
            \Log::info("DECISION: No Quiz A attempt → RETURN 'A'");
            \Log::info("=================================================");
            return 'A';
        } else if ($attemptA->is_correct) {
            // Quiz A was correct -> Show Quiz A (already completed)
            \Log::info("DECISION: Quiz A was CORRECT → RETURN 'A' (Already completed)");
            \Log::info("=================================================");
            return 'A';
        } else {
            // Quiz A was wrong -> Show Quiz B
            \Log::info("DECISION: Quiz A was WRONG → RETURN 'B' (Second chance)");
            \Log::info("=================================================");
            return 'B';
        }
    }

    public function submitAnswer(Request $request, $quizId)
    {
        $request->validate([
            'answer' => 'required|string'
        ]);

        $user = Auth::user();
        
        \Log::info("=== submitAnswer START ===");
        \Log::info("User: {$user->id} ({$user->username})");
        \Log::info("Quiz ID: {$quizId}");
        \Log::info("Answer: {$request->answer}");
        
        $quiz = Quiz::findOrFail($quizId);
        
        \Log::info("Quiz found: {$quiz->title} (variant: {$quiz->quiz_variant}, material: {$quiz->material_id})");
        \Log::info("Quiz correct answer: {$quiz->correct_answer}");
        
        // Check if user has completed the video for this material
        $progress = UserMaterialProgress::where('user_id', $user->id)
            ->where('material_id', $quiz->material_id)
            ->first();

        if (!$progress || !$progress->video_completed) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan menonton video terlebih dahulu'
            ], 403);
        }

        $isCorrect = $request->answer === $quiz->correct_answer;

        \Log::info("QuizController::submitAnswer - Is Answer Correct: " . ($isCorrect ? 'YES' : 'NO'));

        // Check if user already attempted this specific quiz
        $existingResult = QuizResult::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->first();

        if ($existingResult) {
            // Update existing result instead of creating duplicate
            $existingResult->update([
                'answer' => $request->answer,
                'is_correct' => $isCorrect
            ]);
            $result = $existingResult;
            \Log::info("✅ UPDATED existing QuizResult ID: {$result->id} - User: {$user->id}, Quiz: {$quiz->id}, Variant: {$quiz->quiz_variant}, Correct: " . ($isCorrect ? 'YES' : 'NO'));
        } else {
            // Save new quiz result with quiz attempt (variant)
            $result = QuizResult::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz->id,
                'answer' => $request->answer,
                'is_correct' => $isCorrect,
                'quiz_attempt' => $quiz->quiz_variant
            ]);
            \Log::info("✅ CREATED new QuizResult ID: {$result->id} - User: {$user->id}, Quiz: {$quiz->id}, Variant: {$quiz->quiz_variant}, Correct: " . ($isCorrect ? 'YES' : 'NO'));
        }
        
        // Verify the result was actually saved
        $verifyResult = QuizResult::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->first();
        if ($verifyResult) {
            \Log::info("✅ VERIFIED - QuizResult exists in DB: ID {$verifyResult->id}, is_correct: " . ($verifyResult->is_correct ? 'true' : 'false'));
        } else {
            \Log::error("❌ ERROR - QuizResult NOT FOUND in database after save!");
        }

        // Logic based on quiz variant and result
        if ($quiz->quiz_variant === 'A') {
            if ($isCorrect) {
                // A correct: proceed to next material
                return $this->proceedToNextMaterial($quiz, $user);
            } else {
                // A wrong: back to video (will get B quiz next time)
                return response()->json([
                    'success' => false,
                    'is_correct' => false,
                    'message' => 'Jawaban salah! Silahkan kembali menonton video materi',
                    'correct_answer' => $quiz->correct_answer,
                    'action' => 'back_to_video'
                ]);
            }
        } else { // quiz_variant === 'B'
            // B (correct or wrong): always proceed to next material
            return $this->proceedToNextMaterial($quiz, $user, $isCorrect);
        }
    }

    private function proceedToNextMaterial($quiz, $user, $isCorrect = true)
    {
        // Mark quiz as completed
        $progress = UserMaterialProgress::where('user_id', $user->id)
            ->where('material_id', $quiz->material_id)
            ->first();
            
        if ($progress) {
            $progress->update(['quiz_completed' => true]);
        }

        // Always proceed to next material (for both correct A and any B result)
        $nextMaterialId = $quiz->material_id + 1;
        $nextMaterial = null;
        
        if ($nextMaterialId <= 3) { // Assuming we have 3 materials
            $nextMaterial = Material::find($nextMaterialId);
            
            if ($nextMaterial) {
                UserMaterialProgress::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'material_id' => $nextMaterial->id
                    ],
                    ['is_unlocked' => true]
                );
            }
        }

        if ($isCorrect) {
            return response()->json([
                'success' => true,
                'is_correct' => true,
                'message' => 'Jawaban benar! Lanjut ke materi selanjutnya',
                'next_material_id' => $nextMaterial ? $nextMaterial->id : null,
                'action' => 'next_material'
            ]);
        } else {
            return response()->json([
                'success' => true,
                'is_correct' => false,
                'message' => 'Jawaban salah, tapi tetap lanjut ke materi selanjutnya',
                'correct_answer' => $quiz->correct_answer,
                'next_material_id' => $nextMaterial ? $nextMaterial->id : null,
                'action' => 'next_material'
            ]);
        }
    }

    public function getUserResults($userId = null)
    {
        $targetUserId = $userId ?? Auth::id();
        
        $results = QuizResult::where('user_id', $targetUserId)
            ->with(['quiz.material', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'results' => $results
        ]);
    }
}
