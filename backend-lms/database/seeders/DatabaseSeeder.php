<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Material;
use App\Models\Quiz;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Guru
        User::create([
            'name' => 'Guru Matematika',
            'username' => 'guru1',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'kelas' => null,
        ]);

        // Create Siswa
        $siswaData = [
            ['name' => 'Asap', 'username' => 'asap', 'kelas' => 'X IPA 1'],
            ['name' => 'Budi', 'username' => 'budi', 'kelas' => 'X IPA 1'],
            ['name' => 'Andi', 'username' => 'andi', 'kelas' => 'X IPA 1'],
            ['name' => 'Dimas', 'username' => 'dimas', 'kelas' => 'X IPA 2'],
            ['name' => 'Alfi', 'username' => 'alfi', 'kelas' => 'X IPA 3'],
            ['name' => 'Azam', 'username' => 'azam', 'kelas' => 'X IPA 3'],
            ['name' => 'Muklis', 'username' => 'muklis', 'kelas' => 'X IPA 2'],
        ];

        foreach ($siswaData as $siswa) {
            User::create([
                'name' => $siswa['name'],
                'username' => $siswa['username'],
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'kelas' => $siswa['kelas'],
            ]);
        }

        // Create Materials dengan local video files
        $materials = [
            [
                'title' => 'Materi 1: Pengenalan Wi-Fi',
                'description' => 'Video pembelajaran tentang pengenalan Wi-Fi dan cara kerjanya',
                'video_url' => '/videos/materi-1-cara-kerja-wifi.mp4',
                'order' => 1,
                'duration' => 71, // 1:11 menit = 71 detik
                'is_active' => true,
            ],
            [
                'title' => 'Materi 2: Keamanan Nirkabel Wi-Fi',
                'description' => 'Video pembelajaran tentang cara mengkonfigurasi access point Wi-Fi',
                'video_url' => '/videos/materi-2-keamanan-wifi.mp4',
                'order' => 2,
                'duration' => 93, // 1:33 menit = 93 detik
                'is_active' => true,
            ],
            [
                'title' => 'Materi 3: Praktik Konfigurasi Wi-Fi',
                'description' => 'Video pembelajaran tentang mengatasi masalah koneksi Wi-Fi',
                'video_url' => '/videos/materi-3-praktik-konfigurasi-wifi.mp4',
                'order' => 3,
                'duration' => 186, // 3:06 menit = 186 detik
                'is_active' => true,
            ],
        ];

        foreach ($materials as $materialData) {
            Material::create($materialData);
        }

        // Create Quizzes dengan sistem A/B variant
        $quizzes = [
            // Materi 1 - Kuis A (Soal 1)
            [
                'material_id' => 1,
                'title' => 'Kuis Materi 1A',
                'question' => 'Di rumah digital Fathia, ia sering bertanya-tanya bagaimana pesan teks yang ia ketik di ponsel bisa sampai ke internet. Ia tahu bahwa data teksnya adalah data digital, tetapi yang bergerak di udara adalah gelombang radio. Ia mengamati bahwa ada satu alat di rumahnya yang menjadi titik pusat, yang bertugas mengambil data digital dari internet dan mengubahnya menjadi gelombang radio, dan sebaliknya. Alat utama apakah yang digambarkan sebagai "Pusatnya" yang bertugas menerjemahkan data digital dari internet menjadi gelombang radio (biasanya pada frekuensi 2.4 atau 5 GHz) dan menyebarkannya ke udara?',
                'options' => [
                    'A' => 'Alat tersebut adalah Modem, karena ia yang pertama kali menerima sinyal internet dari kabel.',
                    'B' => 'Alat tersebut adalah Adaptor Nirkabel di ponsel Fathia, karena ia yang paling dekat dengan Fathia.',
                    'C' => 'Alat tersebut adalah Router WiFi, karena ia yang mengubah data digital menjadi gelombang radio dan memancarkannya ke udara, menjadikannya pusat jaringan nirkabel.',
                    'D' => 'Alat tersebut adalah Kabel Coaxial, karena ia yang membawa sinyal dari jalan ke dalam rumah.'
                ],
                'correct_answer' => 'C',
                'quiz_variant' => 'A',
            ],
            // Materi 1 - Kuis B (Soal 2)
            [
                'material_id' => 1,
                'title' => 'Kuis Materi 1B',
                'question' => 'Adit sedang menonton video streaming yang ia unduh dari internet. Agar video tersebut bisa ia tonton di laptopnya, ada dua proses "penerjemahan" yang harus terjadi. Proses pertama adalah saat sinyal gelombang radio ditangkap oleh laptop Adit. Proses kedua adalah saat gelombang radio tersebut dikembalikan menjadi data digital yang bisa ditampilkan sebagai video. Komponen manakah pada perangkat klien (laptop atau ponsel Adit) yang berfungsi seperti "telinga" untuk menangkap gelombang radio dan bertugas menerjemahkan gelombang radio kembali menjadi data digital yang bisa ia lihat (video streaming)?',
                'options' => [
                    'A' => 'Komponen tersebut adalah Adaptor Nirkabel (atau Wireless Card). Komponen ini bertindak seperti telinga yang menangkap sinyal gelombang radio dan menerjemahkannya kembali menjadi data digital yang dapat digunakan oleh sistem operasi.',
                    'B' => 'Komponen tersebut adalah CPU (Central Processing Unit), karena ia adalah otak yang memproses semua data digital.',
                    'C' => 'Komponen tersebut adalah Modem, karena ia bertanggung jawab penuh atas penerjemahan sinyal.',
                    'D' => 'Komponen tersebut adalah Antena Router, karena ia yang menghasilkan gelombang radio.'
                ],
                'correct_answer' => 'A',
                'quiz_variant' => 'B',
            ],
            // Materi 2 - Kuis A (Soal 1)
            [
                'material_id' => 2,
                'title' => 'Kuis Materi 2A',
                'question' => 'Seorang pemilik kedai kopi, Bu Rini, ingin meningkatkan keamanan WiFi untuk pelanggannya. Saat ini, Bu Rini menggunakan sistem yang dia tahu masih bisa diretas, tetapi dia berpikir itu sudah cukup karena "lebih baik dari yang paling lama." Namun, pelanggan setianya, Pak Tono, yang sering melakukan transaksi bisnis penting di kedai tersebut, selalu khawatir. Pak Tono tahu bahwa data yang dikirimkan lewat udara dapat dengan mudah "dibaca orang lain" jika tidak dilindungi. Pak Tono meminta Bu Rini melakukan langkah keamanan mendasar yang berfokus pada kerahasiaan data saat berpindah dari perangkat ke router. Sistem keamanan WiFi apakah yang kemungkinan saat ini digunakan oleh Bu Rini (yang "lebih baik dari yang paling lama," tetapi masih punya celah) dan langkah teknis apakah yang disarankan Pak Tono agar datanya tidak mudah dibaca orang lain?',
                'options' => [
                    'A' => 'Bu Rini saat ini menggunakan WEP. Pak Tono menyarankan Bu Rini untuk menggunakan enkripsi data, agar data yang dikirimkan lewat udara tidak mudah dibaca.',
                    'B' => 'Bu Rini saat ini menggunakan WPA. Pak Tono menyarankan Bu Rini untuk menggunakan enkripsi data, agar data yang dikirimkan lewat udara tidak mudah dibaca.',
                    'C' => 'Bu Rini saat ini menggunakan WPA2. Pak Tono menyarankan Bu Rini untuk hanya membuat SSID dan password WiFi yang panjang.',
                    'D' => 'Bu Rini saat ini menggunakan WPA3. Pak Tono menyarankan Bu Rini untuk sering-sering memperbarui perangkat lunak router-nya.'
                ],
                'correct_answer' => 'B',
                'quiz_variant' => 'A',
            ],
            // Materi 2 - Kuis B (Soal 2)
            [
                'material_id' => 2,
                'title' => 'Kuis Materi 2B',
                'question' => 'Timoti, seorang hacker yang agak malas, selalu berhasil membobol jaringan WiFi di sekitar lingkungannya. Dahulu, ia hanya perlu waktu singkat untuk meretas jaringan yang menggunakan sistem keamanan tertua, seolah-olah gembok itu pecah hanya dengan sentuhan. Namun, akhir-akhir ini, Timoti mulai frustrasi. Dia mencoba membobol jaringan tetangganya, AmanJayaNet, yang menggunakan sistem paling baru. Dia menemukan bahwa sistem ini menggunakan enkripsi yang sangat kuat dan juga memiliki mekanisme perlindungan tambahan terhadap password yang lemah, membuatnya hampir mustahil untuk ditembus. Sistem keamanan WiFi apakah yang paling mungkin digunakan oleh jaringan AmanJayaNet milik tetangga Timoti (yang memiliki "enkripsi sangat kuat" dan melindungi dari "password lemah") dan sistem keamanan WiFi apakah yang dulu paling mudah dibobol oleh Timoti ("gembok yang pecah hanya dengan sentuhan")?',
                'options' => [
                    'A' => 'Sistem AmanJayaNet menggunakan WPA2 (Sangat kuat) sedangkan sistem yang mudah dibobol adalah WPA',
                    'B' => 'Sistem AmanJayaNet menggunakan WPA (Masih punya celah) sedangkan sistem yang mudah dibobol adalah WEP',
                    'C' => 'Sistem AmanJayaNet menggunakan WEP (Sangat mudah diretas) sedangkan sistem yang mudah dibobol adalah WPA2',
                    'D' => 'Sistem AmanJayaNet menggunakan WPA3 (Sangat sulit dibobol, lindungi password lemah) sedangkan sistem yang mudah dibobol WEP (Paling lama dan mudah diretas)'
                ],
                'correct_answer' => 'D',
                'quiz_variant' => 'B',
            ],
            // Materi 3 - Kuis A (Soal 1)
            [
                'material_id' => 3,
                'title' => 'Kuis Materi 3A',
                'question' => 'Di sebuah kantor kecil, Pak Budi sedang merakit jaringan baru menggunakan Access Point dan Router. Ia sudah menyiapkan dua jenis perangkat klien: 1. Komputer Lama (PC): Ini adalah komputer desktop biasa yang hanya memiliki port kabel Ethernet. 2. Perangkat Modern (Tablet/Smartphone): Perangkat ini sudah dibeli dalam kondisi siap terhubung secara nirkabel. Ketika Pak Budi mencoba mengkonfigurasi perangkat klien untuk terhubung ke WiFi, ia sadar bahwa PC lama miliknya tidak bisa mendeteksi sinyal WiFi. Langkah penting apa yang wajib dilakukan Pak Budi pada Komputer Lama (PC) agar ia dapat terhubung ke jaringan nirkabel, dan mengapa langkah tersebut tidak diperlukan pada Perangkat Modern (Tablet/Smartphone)?',
                'options' => [
                    'A' => 'PC Lama harus dihubungkan menggunakan kabel straight-through langsung ke Access Point. Perangkat Modern tidak perlu karena sudah menggunakan koneksi Bluetooth.',
                    'B' => 'PC Lama harus diatur IP Default Gateway-nya secara manual ke IP Router. Perangkat Modern tidak perlu karena sudah mendapatkan IP secara otomatis dari DHCP.',
                    'C' => 'PC Lama harus diganti modul jaringan-nya dari Ethernet Card ke Wireless Card. Perangkat Modern tidak perlu karena chip wireless-nya sudah tertanam secara langsung.',
                    'D' => 'PC Lama harus dikonfigurasi sebagai DHCP Server agar bisa membagi IP. Perangkat Modern tidak perlu karena bertindak sebagai client.'
                ],
                'correct_answer' => 'C',
                'quiz_variant' => 'A',
            ],
            // Materi 3 - Kuis B (Soal 2)
            [
                'material_id' => 3,
                'title' => 'Kuis Materi 3B',
                'question' => 'Pak Andi sedang mengatur DHCP Server pada Router di jaringan kecilnya. Ia memutuskan untuk menggunakan rentang IP standar Class C, yaitu 192.168.1.0/24. Ia ingin semua klien menerima IP secara otomatis dari pool DHCP yang dibuatnya (mulai dari 192.168.1.2 hingga 192.168.1.254). Namun, Pak Andi secara eksplisit mengecualikan IP 192.168.1.1 dari rentang DHCP. Mengapa Pak Andi perlu melakukan konfigurasi pengecualian IP (Excluded Address) tersebut?',
                'options' => [
                    'A' => 'Karena IP 192.168.1.1 adalah IP publik yang harus dialokasikan secara manual oleh penyedia layanan internet (ISP).',
                    'B' => 'Karena pool DHCP secara otomatis selalu dimulai dari alamat IP tertinggi (.254), dan pengecualian IP .1 diperlukan untuk menyeimbangkannya.',
                    'C' => 'Untuk menghemat daya pada Router, karena IP yang tidak digunakan oleh klien akan diistirahatkan dari proses DHCP.',
                    'D' => 'Untuk mencegah terjadinya konflik IP di mana alamat Default Gateway (Router) tidak akan dibagikan secara otomatis kepada perangkat klien.'
                ],
                'correct_answer' => 'D',
                'quiz_variant' => 'B',
            ],
        ];

        foreach ($quizzes as $quizData) {
            Quiz::create($quizData);
        }
    }
}