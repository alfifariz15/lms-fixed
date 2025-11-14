'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default function PendahuluanPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(userData)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Selamat Datang!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistem pembelajaran interaktif dengan video dan kuis untuk meningkatkan pemahaman materi
            </p>
          </div>

          {/* Main Content Card */}
          <div className="card-glass p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Learning Objectives */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Tujuan Pembelajaran
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start">
                    <span className="text-blue-500 font-bold mr-3">1.</span>
                    <p>Peserta didik mampu mendeskripsilkan cara kerja Wi-Fi secara runtut</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 font-bold mr-3">2.</span>
                    <p>Peserta didik mampu menganalisis pentingnya keamanan Wi-Fi dengan menyebutkan risiko</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 font-bold mr-3">3.</span>
                    <p>Peserta didik mampu mengkonfigurasi jaringan Wi-Fi sederhana pada Access Point hingga</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Learning Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  Apersepsi
                </h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Kalian pasti sering pakai Wi-Fi di rumah, kan? Kalian tahu nggak, Wi-Fi itu pakai gelombang radio, lho. Kira-kira kenapa ya kita bisa internet tanpa pakai kabel? Kalau begitu, bagaimana data bisa dikirim lewat udara tanpa kabel sama sekali?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Learning Button */}
            <div className="card-glass p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">▶️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Mulai Pembelajaran
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai mempelajari materi dan tonton video pembelajaran
              </p>
              <button
                onClick={() => router.push('/materi')}
                className="btn-primary w-full"
              >
                Mulai Materi
              </button>
            </div>

            {/* Assessment Criteria Button */}
            <div className="card-glass p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Kriteria Penilaian
              </h3>
              <p className="text-gray-600 mb-6">
                Lihat kriteria dan rubrik penilaian untuk pembelajaran ini
              </p>
              <button
                onClick={() => router.push('/kriteria-penilaian')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
              >
                Kriteria Penilaian
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-gray-600 text-sm">© 2025 Aurylia | ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  )
}
