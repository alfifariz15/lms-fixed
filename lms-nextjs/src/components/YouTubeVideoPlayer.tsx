'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface YouTubeVideoPlayerProps {
  youtubeId: string // ID video YouTube
  onVideoComplete: () => void
  materialId: string
  materialTitle: string
  duration: number
}

export default function YouTubeVideoPlayer({ 
  youtubeId, 
  onVideoComplete, 
  materialId, 
  materialTitle,
  duration 
}: YouTubeVideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWatching, setIsWatching] = useState(false)
  const [timeWatched, setTimeWatched] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [player, setPlayer] = useState<any>(null)

  // YouTube embed URL dengan autoplay
  const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false) => {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      controls: '1',
      showinfo: '0',
      enablejsapi: '1',
      origin: window.location.origin,
    })
    
    if (autoplay) {
      params.append('autoplay', '1')
    }
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  // Load YouTube API
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }
  }, [])

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
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{materialTitle}</h3>
            <p className="text-red-100 text-sm">Video Pembelajaran YouTube</p>
          </div>
          <div className="text-right">
            <p className="text-red-100 text-sm">Durasi: {formatTime(duration)}</p>
            {isWatching && (
              <p className="text-red-200 text-xs">
                Progress: {Math.round(progress)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        {/* YouTube iframe */}
        <iframe
          src={showPlayButton ? 
            getYouTubeEmbedUrl(youtubeId, false) : 
            getYouTubeEmbedUrl(youtubeId, true)
          }
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                className="group w-24 h-24 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 mb-4"
              >
                <svg className="w-10 h-10 ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <p className="text-white font-semibold text-xl mb-2">▶️ Start Learning</p>
              <p className="text-gray-300 text-sm max-w-xs">Video YouTube akan auto-play dengan timer tracking</p>
            </div>
          </div>
        )}

        {/* Progress Overlay */}
        {isWatching && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress Video</span>
                <span className="text-sm font-bold text-red-400">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-red-400">LIVE</span>
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

      {/* Controls - sama seperti sebelumnya */}
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

        {/* Instructions */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
            <span className="mr-1">🎥</span>
            YouTube Player Instructions:
          </h4>
          <ul className="text-xs text-red-700 space-y-1">
            <li>• Klik tombol play merah untuk auto-start video + timer</li>
            <li>• Video YouTube akan auto-play bersamaan dengan tracking</li>
            <li>• Progress tracking otomatis selama {formatTime(duration)}</li>
            <li>• 100% completion required untuk unlock quiz</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
