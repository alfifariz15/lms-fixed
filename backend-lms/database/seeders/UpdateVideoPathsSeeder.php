<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;

class UpdateVideoPathsSeeder extends Seeder
{
    public function run()
    {
        // Update materi dengan video paths yang sesuai file yang diupload
        $materials = [
            [
                'id' => 1,
                'title' => 'Pengenalan Wi-Fi',
                'video_url' => '/videos/materi-1-cara-kerja-wifi.mp4',
                'duration' => 71  // 1:11 menit
            ],
            [
                'id' => 2, 
                'title' => 'Keamanan Wi-Fi',
                'video_url' => '/videos/materi-2-keamanan-wifi.mp4',
                'duration' => 93  // 1:33 menit
            ],
            [
                'id' => 3,
                'title' => 'Praktik Konfigurasi Wi-Fi',
                'video_url' => '/videos/materi-3-praktik-konfigurasi-wifi.mp4', 
                'duration' => 186  // 3:06 menit
            ]
        ];

        foreach ($materials as $materialData) {
            $material = Material::find($materialData['id']);
            if ($material) {
                $material->update([
                    'title' => $materialData['title'],
                    'video_url' => $materialData['video_url'],
                    'duration' => $materialData['duration']
                ]);
                $this->command->info("✅ Updated Material ID {$materialData['id']}: {$materialData['title']}");
                $this->command->info("   Video: {$materialData['video_url']}");
            } else {
                $this->command->error("❌ Material ID {$materialData['id']} not found");
            }
        }

        $this->command->info('🎬 Video paths updated successfully!');
        $this->command->info('');
        $this->command->info('Videos ready:');
        $this->command->info('1. Pengenalan Wi-Fi (1:11)');
        $this->command->info('2. Keamanan Wi-Fi (1:33)');
        $this->command->info('3. Praktik Konfigurasi Wi-Fi (3:06)');
    }
}
