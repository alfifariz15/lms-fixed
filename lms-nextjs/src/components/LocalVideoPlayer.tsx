'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface LocalVideoPlayerProps {
  videoPath: string // Path ke video di server (mp4, webm, etc)
  onVideoComplete: () => void
  onNextClicked: () => void // New callback for next button
  materialId: string
  materialTitle: string
  duration: number
}

export default function LocalVideoPlayer({ 
  videoPath, 
  onVideoComplete, 
  onNextClicked,
  materialId, 
  materialTitle,
  duration 
}: LocalVideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWatching, setIsWatching] = useState(false)
  const [timeWatched, setTimeWatched] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
    
    // Auto-play video lokal
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  const handleComplete = useCallback(() => {
    setIsCompleted(true)
    setProgress(100)
    setTimeWatched(duration)
    setIsWatching(false)
    onVideoComplete()
    
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [duration, onVideoComplete])

  const handleVideoError = useCallback(() => {
    setVideoError(`Video tidak ditemukan: ${videoPath}`)
    console.error('Video load error:', videoPath)
  }, [videoPath])

  const handleVideoLoaded = useCallback(() => {
    setVideoError(null)
    console.log('Video loaded successfully:', videoPath)
  }, [videoPath])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{materialTitle}</h3>
            <p className="text-purple-100 text-sm">Video Pembelajaran</p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Durasi: {formatTime(duration)}</p>
            {isWatching && (
              <p className="text-purple-200 text-xs">
                Progress: {Math.round(progress)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls={!showPlayButton}
          muted={showPlayButton}
          preload="metadata"
          onPlay={() => !isWatching && handleStartVideo()}
          onError={handleVideoError}
          onLoadedData={handleVideoLoaded}
        >
          <source src={videoPath} type="video/mp4" />
          <source src={videoPath.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Error Overlay */}
        {videoError && (
          <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Video Tidak Ditemukan</h3>
              <p className="text-sm mb-4">{videoError}</p>
              <div className="bg-black bg-opacity-50 p-3 rounded text-xs">
                <p>Path: {videoPath}</p>
                <p>Check file exists in public/videos/</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Start Overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center flex flex-col items-center justify-center h-full">
              <button
                onClick={handleStartVideo}
                className="group w-24 h-24 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 mb-4"
              >
                <svg className="w-10 h-10 ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <p className="text-white font-semibold text-xl mb-2">▶️ Play Video</p>
            </div>
          </div>
        )}

        {/* Progress Overlay */}
        {isWatching && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
            <div className="text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress Video</span>
                <span className="text-sm font-bold text-purple-400">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-purple-400">LIVE</span>
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
                🎉 Video Selesai!
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Video pembelajaran telah selesai ditonton
              </p>
              <p className="text-green-600 font-medium text-sm mb-4">
                Durasi: {formatTime(timeWatched)}
              </p>
              <button
                onClick={onNextClicked}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ➡️ Lanjut ke Kuis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
