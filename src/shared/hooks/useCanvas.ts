/**
 * Custom hook for managing canvas element
 * Handles canvas creation, context, and resizing
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import type { CanvasContext } from '@shared/types'

interface UseCanvasOptions {
  width: number
  height: number
  onInit?: (context: CanvasContext) => void
}

export const useCanvas = ({ width, height, onInit }: UseCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasContext | null>(null)

  const clearCanvas = useCallback(() => {
    if (context) {
      context.ctx.clearRect(0, 0, context.width, context.height)
    }
  }, [context])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    const canvasContext: CanvasContext = {
      ctx,
      canvas,
      width,
      height,
    }

    setContext(canvasContext)

    // Call initialization callback
    if (onInit) {
      onInit(canvasContext)
    }
  }, [width, height, onInit])

  return {
    canvasRef,
    context,
    clearCanvas,
  }
}
