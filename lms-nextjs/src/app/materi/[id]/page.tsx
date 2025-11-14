'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LocalVideoPlayer from '@/components/LocalVideoPlayer'
import { isAuthenticated, isSiswa } from '@/lib/auth'
import api from '@/lib/api'
import { Material, Quiz } from '@/lib/types'

export default function MaterialDetailPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params.id

  const [material, setMaterial] = useState<Material | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [showVideoCompleted, setShowVideoCompleted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    if (!isSiswa()) {
      router.push('/dashboard/guru')
      return
    }

    if (materialId) {
      fetchMaterial()
    }
  }, [materialId])

  const fetchMaterial = async () => {
    try {
      setIsLoading(true)
      
      console.log('=== FETCHING MATERIAL AND QUIZ ===')
      console.log('Material ID:', materialId)
      
      const [materialResponse, quizResponse] = await Promise.all([
        api.get(`/materials/${materialId}`),
        api.get(`/materials/${materialId}/quiz`).catch((err) => {
          console.error('Quiz fetch error:', err)
          return { data: null }
        })
      ])
      
      console.log('Material Response:', materialResponse.data)
      console.log('Quiz Response:', quizResponse.data)
      
      if (quizResponse.data?.quiz) {
        console.log('📝 Quiz Loaded:')
        console.log('  - Quiz ID:', quizResponse.data.quiz.id)
        console.log('  - Quiz Variant:', quizResponse.data.quiz.quiz_variant)
        console.log('  - Quiz Title:', quizResponse.data.quiz.title)
        console.log('  - Completed:', quizResponse.data.quiz.completed)
        
        if (quizResponse.data.debug_info) {
          console.log('🐛 Debug Info:', quizResponse.data.debug_info)
        }
      }
      
      setMaterial(materialResponse.data.material)
      setQuiz(quizResponse.data?.quiz || null)
      setVideoCompleted(materialResponse.data.material.progress?.video_completed || false)
      
      if (quizResponse.data?.quiz?.completed) {
        setQuizSubmitted(true)
      }
    } catch (error: any) {
      console.error('Error fetching material:', error)
      setError('Gagal memuat materi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoComplete = async () => {
    try {
      await api.post(`/materials/${materialId}/video-progress`, {
        video_completed: true,
        watch_duration: material?.duration || 0
      })
      setVideoCompleted(true)
      setShowVideoCompleted(true)
    } catch (error) {
      console.error('Error updating video progress:', error)
    }
  }

  const handleQuizSubmit = async () => {
    if (!selectedAnswer || !quiz) return

    try {
      console.log('=== SUBMITTING QUIZ ANSWER ===')
      console.log('Quiz ID:', quiz.id)
      console.log('Quiz Variant:', quiz.quiz_variant)
      console.log('Selected Answer:', selectedAnswer)
      
      const response = await api.post(`/quiz/${quiz.id}/submit`, {
        answer: selectedAnswer
      })

      console.log('=== SUBMIT RESPONSE ===')
      console.log('Response:', response.data)
      console.log('Is Correct:', response.data.is_correct)
      console.log('Action:', response.data.action)
      
      setQuizResult(response.data)
      setQuizSubmitted(true)

      // Tunggu 2 detik untuk menampilkan hasil
      setTimeout(() => {
        if (response.data.action === 'back_to_video') {
          // Quiz A salah: balik ke video
          console.log('❌ Quiz A Wrong - Going back to video. Next quiz will be variant B')
          handleBackToVideo()
        } else if (response.data.action === 'next_material') {
          // Quiz A benar atau Quiz B (apapun hasilnya): ke materi selanjutnya
          if (response.data.next_material_id) {
            router.push(`/materi/${response.data.next_material_id}`)
          } else {
            router.push('/materi') // Kembali ke daftar jika sudah selesai semua
          }
        }
      }, 2500)
    } catch (error: any) {
      console.error('Error submitting quiz:', error)
      setError(error.response?.data?.message || 'Gagal mengirim jawaban')
    }
  }

  const handleBackToVideo = () => {
    setQuizMode(false)
    setQuizSubmitted(false)
    setQuizResult(null)
    setSelectedAnswer('')
    setVideoCompleted(false)
    setShowVideoCompleted(false)
  }

  // Handle ketika tombol Next diklik setelah video selesai
  const handleNextToQuiz = async () => {
    if (quiz) {
      console.log('=== REFETCHING QUIZ BEFORE SHOWING ===')
      
      // PENTING: Refetch quiz untuk mendapatkan variant terbaru
      try {
        const quizResponse = await api.get(`/materials/${materialId}/quiz`)
        
        console.log('New Quiz Response:', quizResponse.data)
        
        if (quizResponse.data?.quiz) {
          console.log('✅ Quiz Reloaded:')
          console.log('  - Quiz ID:', quizResponse.data.quiz.id)
          console.log('  - Quiz Variant:', quizResponse.data.quiz.quiz_variant)
          console.log('  - Quiz Title:', quizResponse.data.quiz.title)
          
          if (quizResponse.data.debug_info) {
            console.log('🐛 Debug Info:', quizResponse.data.debug_info)
          }
          
          // Update quiz dengan data terbaru
          setQuiz(quizResponse.data.quiz)
        }
        
        setQuizMode(true)
        setShowVideoCompleted(false)
      } catch (error) {
        console.error('Error refetching quiz:', error)
        // Fallback: tetap tampilkan quiz lama
        setQuizMode(true)
        setShowVideoCompleted(false)
      }
    } else {
      // Jika tidak ada quiz, langsung ke materi berikutnya
      const nextMaterialId = parseInt(materialId as string) + 1
      if (nextMaterialId <= 3) {
        router.push(`/materi/${nextMaterialId}`)
      } else {
        router.push('/materi') // Kembali ke daftar materi jika sudah selesai semua
      }
    }
  }

  if (!isAuthenticated()) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="card-glass p-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="card-glass p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => router.push('/materi')} className="btn-primary">
              Kembali ke Daftar Materi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/materi')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Kembali ke Daftar Materi
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {material?.title}
            </h1>
          </div>

          {!quizMode ? (
            /* Video Mode */
            <div className="mb-6">
              {/* Local Video Player */}
              <LocalVideoPlayer
                videoPath={material?.video_url || ''}
                onVideoComplete={handleVideoComplete}
                onNextClicked={handleNextToQuiz}
                materialId={materialId as string}
                materialTitle={material?.title || 'Video Pembelajaran'}
                duration={material?.duration || 300}
              />
            </div>
          ) : (
            /* Quiz Mode */
            <div className="card-glass p-8">
              {!quizSubmitted ? (
                <>
                  {/* Quiz Header */}
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz?.title}</h2>
                    <p className="text-gray-600">Pilih jawaban yang paling tepat</p>
                    {quiz?.quiz_variant && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Variant {quiz.quiz_variant}
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="text-lg font-medium text-gray-800">{quiz?.question}</h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-4 mb-8">
                    {quiz?.options && Object.entries(quiz.options).map(([key, value]) => (
                      <label 
                        key={key}
                        className={`
                          flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                          ${selectedAnswer === key 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={key}
                          checked={selectedAnswer === key}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-2">
                            {key}
                          </span>
                          <span className="text-gray-800">{value}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => setQuizMode(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      ← Kembali ke Video
                    </button>
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={!selectedAnswer}
                      className={`
                        px-8 py-3 rounded-lg font-medium transition-all duration-200
                        ${selectedAnswer 
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      Kirim Jawaban
                    </button>
                  </div>
                </>
              ) : (
                /* Quiz Result */
                <div className="text-center">
                  {quizResult?.action === 'back_to_video' ? (
                    /* Quiz A Wrong - Back to Video */
                    <div className="mb-6">
                      <div className="text-6xl mb-4">🔄</div>
                      <h2 className="text-2xl font-bold text-orange-600 mb-2">Attempt Pertama Salah!</h2>
                      <p className="text-gray-600 mb-4">{quizResult.message}</p>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                        <p className="text-red-800">
                          Jawaban yang benar: <strong>{quizResult.correct_answer}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-800">
                          📺 Mengarahkan kembali ke video untuk menonton ulang...
                        </p>
                        <p className="text-blue-600 text-sm mt-2">
                          Setelah menonton, Anda akan mendapat soal yang berbeda
                        </p>
                        <div className="mt-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ) : quizResult?.is_correct ? (
                    /* Correct Answer */
                    <div className="mb-6">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-2xl font-bold text-green-600 mb-2">Jawaban Benar!</h2>
                      <p className="text-gray-600 mb-4">{quizResult.message}</p>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                        <p className="text-green-800">
                          🏆 <strong>{quiz?.quiz_variant === 'A' ? 'Kuis A' : 'Kuis B'}</strong> - Berhasil!
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-800">
                          ➡️ Mengarahkan ke materi selanjutnya...
                        </p>
                        <div className="mt-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Quiz B Wrong but Still Proceed */
                    <div className="mb-6">
                      <div className="text-6xl mb-4">⚠️</div>
                      <h2 className="text-2xl font-bold text-yellow-600 mb-2">Attempt Kedua</h2>
                      <p className="text-gray-600 mb-4">{quizResult.message}</p>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                        <p className="text-red-800">
                          Jawaban yang benar: <strong>{quizResult.correct_answer}</strong>
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800">
                          📝 <strong>Kuis B</strong> selesai - Lanjut ke materi selanjutnya
                        </p>
                        <p className="text-yellow-600 text-sm mt-2">
                          Meskipun salah, Anda tetap dapat melanjutkan pembelajaran
                        </p>
                        <div className="mt-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
