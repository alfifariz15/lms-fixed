'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { isAuthenticated, isSiswa } from '@/lib/auth'
import api from '@/lib/api'
import { DashboardSiswa } from '@/lib/types'

export default function DashboardSiswaPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardSiswa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!isSiswa()) {
      router.push('/dashboard/guru')
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/dashboard/siswa')
      setDashboardData(response.data.dashboard)
    } catch (error: any) {
      console.error('Error fetching dashboard:', error)
      setError('Gagal memuat data dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 mt-16 lg:mt-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Selamat Datang!
              </h1>
              <p className="text-gray-600">
                {dashboardData?.user ? 
                  `Halo ${dashboardData.user.name} - ${dashboardData.user.kelas}` : 
                  'Memuat informasi...'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-glass p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : dashboardData && (
              <>
                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Progress Pembelajaran</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboardData.progress.percentage}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📈</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dashboardData.progress.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {dashboardData.progress.completed_materials} dari {dashboardData.progress.total_materials} materi selesai
                      </p>
                    </div>
                  </div>

                  <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Materi Tersedia</p>
                        <p className="text-2xl font-bold text-green-600">
                          {dashboardData.progress.total_materials}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📚</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Materi Selesai</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {dashboardData.progress.completed_materials}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mb-8">
                  <div className="card-glass p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Siap untuk belajar?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Mulai atau lanjutkan perjalanan belajar Anda
                    </p>
                    <button
                      onClick={() => router.push('/materi')}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      🚀 Mulai Materi
                    </button>
                  </div>
                </div>

                {/* Recent Activities */}
                {dashboardData.recent_activities.length > 0 && (
                  <div className="card-glass p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Aktivitas Terakhir
                    </h3>
                    <div className="space-y-3">
                      {dashboardData.recent_activities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className={`text-2xl mr-3 ${activity.is_correct ? '✅' : '❌'}`}>
                              {activity.is_correct ? '✅' : '❌'}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">
                                {activity.material_title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {activity.is_correct ? 'Kuis berhasil diselesaikan' : 'Kuis perlu diulang'}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">
                            {activity.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-6 text-center">
          <p className="text-gray-600 text-sm">© 2025 Aurylia | ALL RIGHTS RESERVED</p>
        </footer>
    </div>
  )
}
