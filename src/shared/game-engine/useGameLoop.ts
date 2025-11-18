/**
 * Custom hook for game loop using requestAnimationFrame
 * Follows best practices for 60fps game loops
 */

import { useEffect, useRef, useCallback } from 'react'

interface UseGameLoopOptions {
  onUpdate: (deltaTime: number) => void
  onRender: () => void
  isPlaying: boolean
  fps?: number
}

export const useGameLoop = ({ onUpdate, onRender, isPlaying, fps = 60 }: UseGameLoopOptions) => {
  const frameIdRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const fpsIntervalRef = useRef<number>(1000 / fps)

  const gameLoop = useCallback(
    (currentTime: number) => {
      frameIdRef.current = requestAnimationFrame(gameLoop)

      // Calculate time since last frame
      const deltaTime = currentTime - lastTimeRef.current

      // Only update if enough time has passed (fps throttling)
      if (deltaTime >= fpsIntervalRef.current) {
        lastTimeRef.current = currentTime - (deltaTime % fpsIntervalRef.current)

        // Update game state
        onUpdate(deltaTime)

        // Render frame
        onRender()
      }
    },
    [onUpdate, onRender]
  )

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now()
      frameIdRef.current = requestAnimationFrame(gameLoop)
    } else {
      cancelAnimationFrame(frameIdRef.current)
    }

    return () => {
      cancelAnimationFrame(frameIdRef.current)
    }
  }, [isPlaying, gameLoop])
}
