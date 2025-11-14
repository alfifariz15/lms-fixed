'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { isAuthenticated, isSiswa } from '@/lib/auth'
import api from '@/lib/api'
import { Material } from '@/lib/types'

export default function MateriPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
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

    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/materials')
      setMaterials(response.data.materials || [])
    } catch (error: any) {
      console.error('Error fetching materials:', error)
      setError('Gagal memuat data materi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartMaterial = (materialId: number) => {
    router.push(`/materi/${materialId}`)
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
                Mulai Materi Pembelajaran
              </h1>
              <p className="text-gray-600">
                Pilih materi yang ingin dipelajari
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-glass p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => {
                  const isUnlocked = material.progress?.is_unlocked || material.order === 1
                  const isVideoCompleted = material.progress?.video_completed || false
                  const isQuizCompleted = material.progress?.quiz_completed || false
                  
                  return (
                    <div key={material.id} className="card-glass p-6 relative">
                      {/* Lock indicator for locked materials */}
                      {!isUnlocked && (
                        <div className="absolute top-4 right-4 bg-gray-400 text-white p-2 rounded-full">
                          🔒
                        </div>
                      )}
                      
                      {/* Progress indicators */}
                      <div className="flex space-x-2 mb-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isVideoCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          📹 Video {isVideoCompleted ? 'Selesai' : 'Belum'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isQuizCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          📝 Kuis {isQuizCompleted ? 'Selesai' : 'Belum'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {material.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {material.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Urutan: {material.order}</span>
                        <span>Durasi: {Math.floor(material.duration / 60)} menit</span>
                      </div>

                      <button
                        onClick={() => handleStartMaterial(material.id)}
                        disabled={!isUnlocked}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          isUnlocked
                            ? 'btn-primary'
                            : 'btn-disabled'
                        }`}
                      >
                        {!isUnlocked ? 'Terkunci' : 
                         isQuizCompleted ? 'Lihat Kembali' :
                         isVideoCompleted ? 'Lanjut ke Kuis' : 'Mulai Belajar'}
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Belum Ada Materi
                </h3>
                <p className="text-gray-500">
                  Materi pembelajaran belum tersedia
                </p>
              </div>
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
