'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUser } from '@/lib/auth'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    setUser(userData)
  }, [])

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, go to pendahuluan
      router.push('/pendahuluan')
    } else {
      // If not logged in, go to login
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-glass max-w-md w-full p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manajemen Pembelajaran
          </h1>
          <p className="text-gray-600">
            Sistem pembelajaran interaktif dengan video dan kuis
          </p>
        </div>
        
        <div className="space-y-4">
          {user ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-medium">Selamat datang kembali!</p>
                <p>{user.name} - {user.role}</p>
              </div>
              <button
                onClick={handleGetStarted}
                className="btn-primary w-full"
              >
                Lanjutkan Pembelajaran
              </button>
              <button
                onClick={() => router.push(user.role === 'guru' ? '/dashboard/guru' : '/dashboard/siswa')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
              >
                Ke Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="btn-primary w-full"
              >
                Masuk ke Sistem
              </button>
              
            </div>
          )}
        </div>
        
        <footer className="mt-8 text-sm text-gray-400">
          © 2025 Aurylia | ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  )
}
