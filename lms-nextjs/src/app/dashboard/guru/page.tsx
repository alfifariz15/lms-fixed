'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, isGuru, logout } from '@/lib/auth'
import api from '@/lib/api'
import { DashboardGuru } from '@/lib/types'

export default function DashboardGuruPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardGuru | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!isGuru()) {
      router.push('/dashboard/siswa')
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/dashboard/guru')
      setDashboardData(response.data.dashboard)
    } catch (error: any) {
      console.error('Error fetching dashboard:', error)
      setError('Gagal memuat data dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Logout Button */}
            <div className="mb-8 mt-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Selamat Datang Guru!
                </h1>
                <p className="text-gray-600">
                  Dashboard monitoring pembelajaran siswa
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-6">
                <div className="card-glass p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="card-glass p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : dashboardData && (
              <>
                {/* Stats Card */}
                <div className="mb-8">
                  <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                          Total Siswa
                        </h2>
                        <p className="text-3xl font-bold text-blue-600">
                          {dashboardData.total_siswa}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-3xl">👥</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Data Table */}
                <div className="card-glass p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Data Hasil Pembelajaran Siswa
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">No</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K1A</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K1B</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K2A</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K2B</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K3A</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Jawaban K3B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.siswa_data.map((siswa: any, index: number) => (
                          <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 font-medium">{siswa.name}</td>
                            <td className="py-3 px-4">{siswa.kelas}</td>
                            
                            {/* Columns for each quiz result */}
                            {['K1A', 'K1B', 'K2A', 'K2B', 'K3A', 'K3B'].map((code) => {
                              const answer = siswa.quiz_answers?.[code]
                              return (
                                <td key={code} className="py-3 px-4 text-center">
                                  {answer ? (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      answer.is_correct 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {answer.answer} {answer.is_correct ? '✓' : '✗'}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                        
                        {dashboardData.siswa_data.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-gray-500">
                              Belum ada data hasil pembelajaran siswa
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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