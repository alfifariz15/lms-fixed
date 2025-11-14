'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { isAuthenticated, isSiswa } from '@/lib/auth'

export default function KriteriaPenilaianPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!isSiswa()) {
      router.push('/dashboard/guru')
      return
    }
  }, [])

  const kriteria = [
    {
      aspek: "Pemahaman Materi",
      bobot: "40%",
      indikator: [
        "Mampu memahami konsep dasar yang diajarkan dalam video",
        "Dapat mengidentifikasi poin-poin penting dari materi",
        "Menunjukkan pemahaman yang baik saat menjawab kuis"
      ]
    },
    {
      aspek: "Ketuntasan Belajar",
      bobot: "30%", 
      indikator: [
        "Menonton video pembelajaran hingga selesai",
        "Menjawab kuis dengan benar",
        "Menyelesaikan semua materi yang tersedia"
      ]
    },
    {
      aspek: "Interaksi dan Partisipasi",
      bobot: "20%",
      indikator: [
        "Aktif mengikuti pembelajaran dari awal hingga akhir",
        "Mengerjakan kuis dengan jujur dan mandiri",
        "Mengulang materi jika diperlukan"
      ]
    },
    {
      aspek: "Kesesuaian Waktu",
      bobot: "10%",
      indikator: [
        "Mengikuti pembelajaran sesuai urutan yang ditentukan",
        "Menyelesaikan kuis dalam waktu yang wajar",
        "Konsisten dalam mengikuti pembelajaran"
      ]
    }
  ]

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 mt-16 lg:mt-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Kriteria Penilaian
              </h1>
              <p className="text-gray-600">
                Panduan penilaian pembelajaran dalam sistem LMS
              </p>
            </div>

            {/* Pengetahuan Section */}
            <div className="card-glass p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengetahuan</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Materi Pembelajaran</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Fokus Pembahasan</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Jumlah Soal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Materi 1</td>
                      <td className="border border-gray-300 px-4 py-2 italic">Menguji pemahaman terhadap cara kerja Wifi</td>
                      <td className="border border-gray-300 px-4 py-2">2 Soal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Materi 2</td>
                      <td className="border border-gray-300 px-4 py-2 italic">Menguji kemampuan dalam menganalisis pentingnya keamanan Wifi</td>
                      <td className="border border-gray-300 px-4 py-2">2 Soal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Materi 3</td>
                      <td className="border border-gray-300 px-4 py-2 italic">Menguji kemampuan dalam menganalisis dan memecahkan masalah dalam mengkonfigurasi jaringan wifi</td>
                      <td className="border border-gray-300 px-4 py-2">2 Soal</td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="border border-gray-300 px-4 py-2">TOTAL KESELURUHAN</td>
                      <td className="border border-gray-300 px-4 py-2">3 Materi</td>
                      <td className="border border-gray-300 px-4 py-2">6 Soal</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold mb-2">Catatan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pastikan kalian menguasai semua konsep dari 3 materi tersebut.</li>
                  <li>Hasil ulangan ini akan digunakan sebagai dasar untuk remedial atau pengayaan pada materi yang belum dikuasai secara maksimal.</li>
                </ul>
              </div>
            </div>

            {/* Keterampilan Section */}
            <div className="card-glass p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Keterampilan</h2>
              
              {/* Praktikum */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">a. Praktikum</h3>
                
                <div className="space-y-6">
                  {/* Persiapan Setup */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">1. Persiapan Setup (Penyiapan Lingkungan Simulasi) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">4 aspek Dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Perangkat AP dan Router sudah ditempatkan dan terhubung dengan kabel Copper Straight-Through</li>
                        <li>Laptop Klien berhasil mengganti modul Ethernet ke Wireless Card (WPC300N) di tab Physical.</li>
                        <li>Alamat IP Laptop konfigurasi diatur agar satu segmen dengan AP default.</li>
                        <li>Semua perangkat sudah dinyalakan dan siap untuk konfigurasi.</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 3 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">Tidak ada aspek</p>
                      </div>
                    </div>
                  </div>

                  {/* Pelaksanaan Konfigurasi */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">2. Pelaksanaan Konfigurasi (Pengaturan Access Point Inti) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">4 Aspek dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Berhasil masuk ke Mode Config AP (Port 0).</li>
                        <li>Berhasil mengatur IP Statis AP 192.168.1.10 dan mematikan fitur DHCP Server pada AP.</li>
                        <li>Berhasil mengatur SSID unik (misalnya Kelas_Jaringan_10A) di Port 1.</li>
                        <li>Berhasil memilih protokol keamanan WPA2-PSK dan memasukkan Passphrase.</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 3 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">Tidak ada aspek</p>
                      </div>
                    </div>
                  </div>

                  {/* Keberhasilan Koneksi */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">3. Keberhasilan Koneksi (Verifikasi TP 6) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">3 aspek dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Laptop Klien berhasil terhubung ke SSID baru melalui tab PC Wireless.</li>
                        <li>Laptop Klien berhasil mendapatkan alamat IP dari Router utama (melalui DHCP).</li>
                        <li>Laptop Klien sukses ping ke Router utama (koneksi terverifikasi dan fungsional).</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Gagal terhubung/gagal ping total</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">-</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">Rumus perhitungan nilai praktik:</p>
                  <p className="text-sm text-gray-700 mt-1">Nilai praktik = skor persiapan + skor pelaksanaan + skor keberhasilan koneksi / skor maksimal (4 + 4 + 4) x 100</p>
                </div>
              </div>

              {/* Presentasi */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">b. Presentasi</h3>
                
                <div className="space-y-6">
                  {/* Kejelasan Langkah Kerja */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">1. Kejelasan Langkah Kerja (Menjelaskan Konfigurasi) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">4 aspek Dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Menjelaskan seluruh langkah konfigurasi (IP, SSID, WPA, DHCP Disable).</li>
                        <li>Penjelasan disampaikan runtut, jelas, dan akurat.</li>
                        <li>Menggunakan istilah teknis (IP Statis, DHCP Disable) dengan tepat.</li>
                        <li>Mampu menunjukkan bukti screenshot hasil konfigurasi yang benar.</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 3 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">Tidak ada aspek</p>
                      </div>
                    </div>
                  </div>

                  {/* Analisis Troubleshooting */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">2. Analisis Troubleshooting (Critical Thinking) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">3 Aspek dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Mampu menjelaskan masalah yang ditemui selama praktik (misalnya: conflict IP atau Authentication Error).</li>
                        <li>Memberikan solusi teknis yang efektif dan logis untuk mengatasi masalah tersebut.</li>
                        <li>Mampu menjelaskan mengapa troubleshooting itu berhasil (analisis sebab-akibat).</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Menyatakan tidak ada masalah atau solusi tidak relevan</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">-</p>
                      </div>
                    </div>
                  </div>

                  {/* Keberhasilan Koneksi TP 6 */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-800 mb-3">3. Keberhasilan Koneksi (Verifikasi TP 6) - Skor: 4</h4>
                    <div className="bg-blue-50 p-3 rounded mb-3">
                      <p className="font-medium text-blue-900">3 aspek dikuasai:</p>
                      <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                        <li>Penyampaian lantang, jelas, dan percaya diri (komunikatif).</li>
                        <li>Mampu menjawab seluruh pertanyaan audiens/guru mengenai konfigurasi secara teknis.</li>
                        <li>Menggunakan bahasa yang sopan dan terstruktur saat menjelaskan.</li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-800">Skor 3</p>
                        <p className="text-green-700">Ada 2 aspek dipenuhi</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded text-center">
                        <p className="font-semibold text-yellow-800">Skor 2</p>
                        <p className="text-yellow-700">Ada 1 aspek dipenuhi</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded text-center">
                        <p className="font-semibold text-orange-800">Skor 1</p>
                        <p className="text-orange-700">Gagal menjawab pertanyaan dan menunjukkan sikap ragu</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-center">
                        <p className="font-semibold text-red-800">Skor 0</p>
                        <p className="text-red-700">-</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">Rumus perhitungan nilai presentasi:</p>
                  <p className="text-sm text-gray-700 mt-1">Nilai presentasi = skor kualitas presentasi + skor analisis masalah + skor sikap komunikasi / skor maksimal (4 + 4 + 4) x 100</p>
                </div>
              </div>
            </div>

            {/* Sikap Section */}
            <div className="card-glass p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sikap</h2>
              
              <div className="space-y-6">
                {/* Partisipasi & Kolaborasi */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-3">1. Partisipasi & Kolaborasi - Skor: 4</h4>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-medium text-blue-900">3 aspek Dikuasai:</p>
                    <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                      <li>Seluruh anggota kelompok berkontribusi aktif (tidak ada yang pasif).</li>
                      <li>Membagi tugas konfigurasi dan troubleshooting dengan adil.</li>
                      <li>Menunjukkan kerjasama yang tinggi dan inisiatif.</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="font-semibold text-green-800">Skor 3</p>
                      <p className="text-green-700">Ada 2 aspek dipenuhi (Sebagian besar anggota aktif, tetapi pembagian tugas kurang inisiatif)</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="font-semibold text-yellow-800">Skor 2</p>
                      <p className="text-yellow-700">Ada 1 aspek dipenuhi (Kontribusi didominasi 1-2 orang)</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <p className="font-semibold text-orange-800">Skor 1</p>
                      <p className="text-orange-700">Tidak ada kontribusi atau anggota pasif total dalam aktivitas kelompok</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <p className="font-semibold text-red-800">Skor 0</p>
                      <p className="text-red-700">-</p>
                    </div>
                  </div>
                </div>

                {/* Tanggung jawab dan Ketekunan */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-3">2. Tanggung jawab dan Ketekunan - Skor: 4</h4>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-medium text-blue-900">3 Aspek dikuasai:</p>
                    <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                      <li>Menyelesaikan tugas praktik tepat waktu.</li>
                      <li>Menunjukkan ketekunan tinggi dalam troubleshooting kendala teknis.</li>
                      <li>Bekerja secara mandiri (tidak bergantung sepenuhnya pada guru).</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="font-semibold text-green-800">Skor 3</p>
                      <p className="text-green-700">Ada 2 aspek dipenuhi (Menyelesaikan tugas, tetapi mudah menyerah atau butuh bantuan berulang)</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="font-semibold text-yellow-800">Skor 2</p>
                      <p className="text-yellow-700">Ada 1 aspek dipenuhi (Mengumpulkan tugas terlambat atau perlu diingatkan)</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <p className="font-semibold text-orange-800">Skor 1</p>
                      <p className="text-orange-700">Gagal menyelesaikan tugas dan tidak menunjukkan upaya serius</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <p className="font-semibold text-red-800">Skor 0</p>
                      <p className="text-red-700">-</p>
                    </div>
                  </div>
                </div>

                {/* Keberhasilan Koneksi */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-3">3. Keberhasilan Koneksi (Verifikasi TP 6) - Skor: 4</h4>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-medium text-blue-900">3 aspek dikuasai:</p>
                    <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                      <li>Menerima kritik/saran dari guru dan teman dengan terbuka.</li>
                      <li>Mampu memperbaiki hasil kerja atau argumen berdasarkan landasan konsep yang benar.</li>
                      <li>Berkomunikasi secara sopan dan logis.</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="font-semibold text-green-800">Skor 3</p>
                      <p className="text-green-700">Ada 2 aspek dipenuhi (Menerima kritik, tetapi tidak menunjukkan perbaikan atau tanggapan logis)</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="font-semibold text-yellow-800">Skor 2</p>
                      <p className="text-yellow-700">Ada 1 aspek dipenuhi (Cenderung menolak kritik tanpa memberikan dasar konsep yang kuat)</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded text-center">
                      <p className="font-semibold text-orange-800">Skor 1</p>
                      <p className="text-orange-700">Menolak saran dan berdebat secara emosional/tidak sopan</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-center">
                      <p className="font-semibold text-red-800">Skor 0</p>
                      <p className="text-red-700">-</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">Rumus perhitungan nilai sikap:</p>
                <p className="text-sm text-gray-700 mt-1">Nilai sikap = skor kolaborasi + tanggung jawab + skor penerimaan kritik / skor maksimal (4 + 4 + 4) x 100</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center">
          <p className="text-gray-600 text-sm">© 2025 Aurylia | ALL RIGHTS RESERVED</p>
        </footer>
    </div>
  )
}
