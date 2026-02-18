"use client"

import { useEffect, useRef } from "react"

/** Extract YouTube video ID from various URL formats */
function getYoutubeVideoId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = url.trim()
    const shortMatch = u.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]
    const longMatch = u.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/)
    if (longMatch) return longMatch[1]
    const embedMatch = u.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (embedMatch) return embedMatch[1]
    return null
  } catch {
    return null
  }
}

/** Extract start time in seconds from URL (e.g. ?t=7 or &t=7) */
function getYoutubeStartTime(url: string): number {
  const match = url.match(/[?&]t=(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: { videoId: string; playerVars?: Record<string, number | string>; events?: Record<string, () => void> }
      ) => { playVideo: () => void; pauseVideo: () => void; destroy: () => void }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface BackgroundMusicPlayerProps {
  enabled: boolean
  youtubeUrl?: string
}

export function BackgroundMusicPlayer({ enabled, youtubeUrl }: BackgroundMusicPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ReturnType<Window["YT"]["Player"]> | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const videoId = getYoutubeVideoId(youtubeUrl ?? "")
    if (!videoId) return

    const startTime = getYoutubeStartTime(youtubeUrl ?? "")

    function initPlayer() {
      if (!containerRef.current || !window.YT?.Player) return
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo()
        } catch {
          /* ignore */
        }
        playerRef.current = null
      }

      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          start: startTime,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            playerRef.current?.playVideo()
          },
        },
      })
    }

    let prevReady: (() => void) | undefined = window.onYouTubeIframeAPIReady

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (existingScript) {
        window.onYouTubeIframeAPIReady = () => {
          prevReady?.()
          initPlayer()
        }
        if (window.YT?.Player) initPlayer()
      } else {
        const script = document.createElement("script")
        script.src = "https://www.youtube.com/iframe_api"
        script.async = true
        window.onYouTubeIframeAPIReady = () => {
          prevReady?.()
          initPlayer()
        }
        document.head.appendChild(script)
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo()
        } catch {
          /* ignore */
        }
        playerRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      window.onYouTubeIframeAPIReady = prevReady
    }
  }, [enabled, youtubeUrl])

  if (!youtubeUrl?.trim()) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed -left-[9999px] top-0 h-[200px] w-[200px] opacity-0"
      aria-hidden
    />
  )
}
