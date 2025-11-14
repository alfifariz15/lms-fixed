'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default function AsesmenPage() {
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
              Asesmen Sumatif
            </h1>
            <p className="text-lg text-gray-600">
              Ujian akhir untuk mengukur pemahaman materi pembelajaran
            </p>
          </div>

          {/* Main Assessment Card */}
          <div className="card-glass p-8">
            {/* Scan Barcode Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Scan Barcode
              </h2>
              
              {/* Barcode Scanner Area */}
              <div className="max-w-md mx-auto">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md">
                  {/* QR Code Image */}
                  <div className="w-64 h-64 mx-auto mb-4 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                    <img 
                      src="/images/assesment.jpg" 
                      alt="QR Code Asesmen Sumatif" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl text-gray-400">📷</span><p class="text-gray-500 text-sm mt-2">QR Code</p>';
                      }}
                    />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    Scan QR Code untuk mengakses soal asesmen
                  </p>
                  <p className="text-gray-500 text-sm">
                    Arahkan kamera smartphone ke QR Code di atas
                  </p>
                </div>
                
                {/* Sample Barcode Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm mb-2">
                    Link barcode untuk testing:
                  </p>
                  <p className="text-blue-600 font-mono text-xs break-all">
                    https://wayground.com/join?gc=12771418&source=liveDashboard
                  </p>
                </div>
              </div>
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
