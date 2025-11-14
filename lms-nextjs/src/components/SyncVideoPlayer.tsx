'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface SyncVideoPlayerProps {
  videoUrl: string
  onVideoComplete: () => void
  materialId: string
  materialTitle: string
  duration: number
}

export default function SyncVideoPlayer({ 
  videoUrl, 
  onVideoComplete, 
  materialId, 
  materialTitle,
  duration 
}: SyncVideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWatching, setIsWatching] = useState(false)
  const [timeWatched, setTimeWatched] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const getEmbedUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/)
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview?autoplay=1`
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)

  // Progress tracking timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isWatching && !isCompleted) {
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
  }, [isWatching, isCompleted, duration, onVideoComplete])

  const handleStartVideo = useCallback(() => {
    setIsWatching(true)
    setShowPlayButton(false)
    
    // Reload iframe untuk trigger autoplay
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
        }
      }, 100)
    }
  }, [])

  const handleComplete = useCallback(() => {
    setIsCompleted(true)
    setProgress(100)
    setTimeWatched(duration)
    setIsWatching(false)
    onVideoComplete()
  }, [duration, onVideoComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{materialTitle}</h3>
            <p className="text-blue-100 text-sm">Video Pembelajaran Wi-Fi</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Durasi: {formatTime(duration)}</p>
            {isWatching && (
              <p className="text-blue-200 text-xs">
                Progress: {Math.round(progress)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        {/* Video iframe */}
        <iframe
          ref={iframeRef}
          src={showPlayButton ? getEmbedUrl(videoUrl).replace('?autoplay=1', '') : embedUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          frameBorder="0"
          title={materialTitle}
        />
        
        {/* Start Overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center flex flex-col items-center justify-center h-full">
              <button
                onClick={handleStartVideo}
                className="group w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 mb-4"
              >
                <svg className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <p className="text-white font-semibold text-lg mb-2">Mulai Video & Timer</p>
              <p className="text-gray-300 text-sm max-w-xs">Video akan diputar bersamaan dengan tracking progress</p>
            </div>
          </div>
        )}

        {/* Progress Overlay */}
        {isWatching && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress Video</span>
                <span className="text-sm font-bold text-blue-400">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-400">LIVE</span>
                  <span className="text-gray-300">•</span>
                  <span>{formatTime(timeWatched)}</span>
                </div>
                <span className="text-gray-300">Target: {formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🎉 Selamat!
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Video pembelajaran telah selesai ditonton
              </p>
              <p className="text-green-600 font-medium text-sm">
                Waktu: {formatTime(timeWatched)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-t">
        {progress >= 100 && !isCompleted && (
          <div className="text-center mb-4">
            <button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✅ Selesai Menonton
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Video sudah selesai, klik untuk melanjutkan ke kuis
            </p>
          </div>
        )}

        {isWatching && !isCompleted && progress < 100 && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm font-medium">Sedang menonton video...</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Jangan tutup halaman sampai video selesai
            </p>
          </div>
        )}

        {showPlayButton && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-sm">Siap untuk memulai pembelajaran</span>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center text-green-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span className="font-medium">Video pembelajaran selesai!</span>
            </div>
            <p className="text-green-600 text-sm">
              Total durasi menonton: {formatTime(timeWatched)} / {formatTime(duration)}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Petunjuk Menonton:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Klik tombol play merah untuk memulai video dan timer</li>
            <li>• Video Google Drive dan timer akan berjalan bersamaan</li>
            <li>• Progress akan ter-tracking otomatis selama {formatTime(duration)}</li>
            <li>• Setelah 100%, klik "Selesai Menonton" untuk lanjut ke kuis</li>
            <li>• Pastikan koneksi internet stabil selama menonton</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
