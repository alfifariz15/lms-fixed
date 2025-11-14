<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quiz;

class QuizABVariantsSeeder extends Seeder
{
    public function run()
    {
        // Create Quiz A and B variants for each material
        $quizVariants = [
            // Material 1 - Pengenalan Wi-Fi
            [
                'material_id' => 1,
                'variant' => 'A',
                'title' => 'Kuis Materi 1A - Pengenalan Wi-Fi',
                'question' => 'Apa kepanjangan dari Wi-Fi?',
                'options' => [
                    'A' => 'Wireless Fidelity',
                    'B' => 'Wide Frequency',
                    'C' => 'Wire Free',
                    'D' => 'Web Interface'
                ],
                'correct_answer' => 'A'
            ],
            [
                'material_id' => 1,
                'variant' => 'B', 
                'title' => 'Kuis Materi 1B - Pengenalan Wi-Fi',
                'question' => 'Standar IEEE untuk Wi-Fi yang paling umum adalah?',
                'options' => [
                    'A' => 'IEEE 802.3',
                    'B' => 'IEEE 802.11',
                    'C' => 'IEEE 802.15',
                    'D' => 'IEEE 802.16'
                ],
                'correct_answer' => 'B'
            ],
            
            // Material 2 - Keamanan Wi-Fi
            [
                'material_id' => 2,
                'variant' => 'A',
                'title' => 'Kuis Materi 2A - Keamanan Wi-Fi', 
                'question' => 'Protokol keamanan Wi-Fi yang paling aman adalah?',
                'options' => [
                    'A' => 'WEP',
                    'B' => 'WPA',
                    'C' => 'WPA2',
                    'D' => 'WPA3'
                ],
                'correct_answer' => 'D'
            ],
            [
                'material_id' => 2,
                'variant' => 'B',
                'title' => 'Kuis Materi 2B - Keamanan Wi-Fi',
                'question' => 'Apa fungsi utama dari enkripsi pada Wi-Fi?',
                'options' => [
                    'A' => 'Mempercepat koneksi',
                    'B' => 'Mengamankan data yang dikirim',
                    'C' => 'Menambah jangkauan sinyal',
                    'D' => 'Mengurangi interferensi'
                ],
                'correct_answer' => 'B'
            ],
            
            // Material 3 - Konfigurasi Wi-Fi
            [
                'material_id' => 3,
                'variant' => 'A',
                'title' => 'Kuis Materi 3A - Konfigurasi Wi-Fi',
                'question' => 'SSID pada Wi-Fi adalah?',
                'options' => [
                    'A' => 'Service Set Identifier',
                    'B' => 'Security Set ID',
                    'C' => 'Signal Strength Indicator',
                    'D' => 'System Security Interface'
                ],
                'correct_answer' => 'A'
            ],
            [
                'material_id' => 3,
                'variant' => 'B',
                'title' => 'Kuis Materi 3B - Konfigurasi Wi-Fi', 
                'question' => 'Channel yang tidak saling overlap pada Wi-Fi 2.4GHz adalah?',
                'options' => [
                    'A' => '1, 6, 11',
                    'B' => '2, 7, 12',
                    'C' => '3, 8, 13',
                    'D' => '4, 9, 14'
                ],
                'correct_answer' => 'A'
            ]
        ];

        // Delete existing quizzes first
        Quiz::query()->delete();

        foreach ($quizVariants as $quizData) {
            Quiz::create([
                'material_id' => $quizData['material_id'],
                'title' => $quizData['title'],
                'question' => $quizData['question'],
                'options' => $quizData['options'],
                'correct_answer' => $quizData['correct_answer'],
                'quiz_variant' => $quizData['variant']
            ]);
            
            $this->command->info("✅ Created Quiz {$quizData['material_id']}{$quizData['variant']}: {$quizData['title']}");
        }

        $this->command->info('🎯 Quiz A/B variants created successfully!');
        $this->command->info('');
        $this->command->info('Quiz Structure:');
        $this->command->info('K1A: Pengenalan Wi-Fi (Attempt 1)');
        $this->command->info('K1B: Pengenalan Wi-Fi (Attempt 2)');
        $this->command->info('K2A: Keamanan Wi-Fi (Attempt 1)');
        $this->command->info('K2B: Keamanan Wi-Fi (Attempt 2)'); 
        $this->command->info('K3A: Konfigurasi Wi-Fi (Attempt 1)');
        $this->command->info('K3B: Konfigurasi Wi-Fi (Attempt 2)');
    }
}
