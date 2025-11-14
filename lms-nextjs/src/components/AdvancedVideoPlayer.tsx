'use client'

import { useState, useRef, useEffect } from 'react'

interface AdvancedVideoPlayerProps {
  videoUrl: string
  onVideoComplete: () => void
  materialId: string
  materialTitle: string
  duration: number
}

export default function AdvancedVideoPlayer({ 
  videoUrl, 
  onVideoComplete, 
  materialId, 
  materialTitle,
  duration 
}: AdvancedVideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWatching, setIsWatching] = useState(false)
  const [timeWatched, setTimeWatched] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [canStartTracking, setCanStartTracking] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Convert Google Drive URL to embed format
  const getEmbedUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/)
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  // Timer untuk tracking progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isWatching && !isCompleted && isVideoPlaying) {
      interval = setInterval(() => {
        setTimeWatched(prev => {
          const newTime = prev + 1
          const newProgress = Math.min((newTime / duration) * 100, 100)
          setProgress(newProgress)
          
          if (newTime >= duration) {
            setProgress(100)
            setIsCompleted(true)
            onVideoComplete()
            if (interval) clearInterval(interval)
            return duration
          }
          
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isWatching, isCompleted, isVideoPlaying, duration, onVideoComplete])

  // Detect video interaction
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for iframe interactions (video play/pause)
      if (event.origin.includes('drive.google.com')) {
        if (canStartTracking) {
          setIsVideoPlaying(true)
          if (!isWatching) {
            setIsWatching(true)
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [canStartTracking, isWatching])

  const handleStartTracking = () => {
    setCanStartTracking(true)
    setIsWatching(true)
    
    // Try to trigger video play by clicking on iframe
    if (iframeRef.current) {
      // Focus pada iframe untuk interaksi
      iframeRef.current.focus()
    }
  }

  const handleManualPlay = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  const handleManualComplete = () => {
    setIsCompleted(true)
    setProgress(100)
    setTimeWatched(duration)
    setIsWatching(false)
    setIsVideoPlaying(false)
    onVideoComplete()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Header */}
      <div className="bg-blue-600 text-white p-4">
        <h3 className="font-semibold text-lg">{materialTitle}</h3>
        <div className="flex justify-between items-center">
          <p className="text-blue-100 text-sm">Video Pembelajaran Wi-Fi</p>
          <p className="text-blue-100 text-sm">Durasi: {formatTime(duration)}</p>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-64 md:h-96"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          frameBorder="0"
          title={materialTitle}
        />
        
        {/* Start Tracking Overlay */}
        {!canStartTracking && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={handleStartTracking}
                className="w-24 h-24 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="text-white mt-4 font-semibold text-lg">Mulai Menonton Video</p>
              <p className="text-gray-300 text-sm">Klik untuk memulai tracking dan putar video</p>
            </div>
          </div>
        )}
        
        {/* Progress Overlay */}
        {isWatching && !isCompleted && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-85 rounded-lg p-4 text-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Progress Menonton</span>
                <span className="text-sm font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-300">
                <span>Waktu: {formatTime(timeWatched)}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleManualPlay}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-xs"
                  >
                    {isVideoPlaying ? '⏸️ Pause' : '▶️ Play'}
                  </button>
                  <span>Target: {formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                🎉 Video Selesai!
              </h4>
              <p className="text-gray-600 text-sm">
                Anda telah menyelesaikan video pembelajaran ini.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50">
        {isWatching && !isCompleted && progress >= 100 && (
          <div className="text-center">
            <button
              onClick={handleManualComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
            >
              ✅ Selesai Menonton
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Video sudah selesai, klik untuk lanjut ke kuis
            </p>
          </div>
        )}

        {isWatching && !isCompleted && progress < 100 && (
          <div className="text-center">
            <div className="inline-flex items-center text-blue-600">
              <div className={`rounded-full h-4 w-4 mr-2 ${isVideoPlaying ? 'animate-spin border-b-2 border-blue-600' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isVideoPlaying ? 'Video sedang berjalan...' : 'Video dijeda'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isVideoPlaying ? 
                `Tonton hingga ${formatTime(duration)} untuk melanjutkan` :
                'Klik play pada video untuk melanjutkan tracking'
              }
            </p>
          </div>
        )}

        {canStartTracking && !isWatching && !isCompleted && (
          <div className="text-center">
            <div className="inline-flex items-center text-green-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Siap untuk menonton!</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Klik play pada video untuk memulai pembelajaran
            </p>
          </div>
        )}

        {!canStartTracking && (
          <div className="text-center">
            <div className="inline-flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Siap untuk memulai</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Klik tombol play besar untuk memulai tracking
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Video berhasil diselesaikan!</span>
            </div>
            <p className="text-green-600 text-center text-sm mt-1">
              ⏱️ Total waktu menonton: {formatTime(timeWatched)}
            </p>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="px-4 pb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            📚 Petunjuk Menonton Video:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Klik tombol play besar untuk memulai tracking</li>
            <li>• Video dan timer akan berjalan bersamaan</li>
            <li>• Gunakan kontrol play/pause jika diperlukan</li>
            <li>• Tonton hingga 100% selesai ({formatTime(duration)})</li>
            <li>• Tombol "Selesai Menonton" muncul otomatis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
