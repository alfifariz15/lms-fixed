<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;

class LocalVideoPathsSeeder extends Seeder
{
    public function run()
    {
        // Update materi dengan local video paths
        $materials = [
            [
                'id' => 1,
                'video_url' => '/videos/materi-1-introduction.mp4',
                'duration' => 71  // 1:11 menit
            ],
            [
                'id' => 2, 
                'video_url' => '/videos/materi-2-basic-concepts.mp4',
                'duration' => 93  // 1:33 menit
            ],
            [
                'id' => 3,
                'video_url' => '/videos/materi-3-advanced-topics.mp4', 
                'duration' => 186  // 3:06 menit
            ]
        ];

        foreach ($materials as $materialData) {
            $material = Material::find($materialData['id']);
            if ($material) {
                $material->update([
                    'video_url' => $materialData['video_url'],
                    'duration' => $materialData['duration']
                ]);
                $this->command->info("✅ Updated Material ID {$materialData['id']} with local video: {$materialData['video_url']}");
            } else {
                $this->command->error("❌ Material ID {$materialData['id']} not found");
            }
        }

        $this->command->info('🎬 Local video URLs updated successfully!');
        $this->command->info('');
        $this->command->info('Next steps:');
        $this->command->info('1. Upload videos to public/videos/ folder');
        $this->command->info('2. Test the LocalVideoPlayer component');
        $this->command->info('3. Videos should auto-play with perfect sync!');
    }
}
