/**
 * Hill Climb Racing Game Component
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCanvas } from '@shared/hooks/useCanvas'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import { HILLCLIMB_CONFIG, COLORS } from './config'
import type { HillClimbState, Vehicle } from './types'
import { createInitialState, updatePhysics, handleKeyDown, handleKeyUp } from './gameLogic'

export const HillClimbGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<HillClimbState>(createInitialState())
  const lastUpdateRef = useRef<number>(0)
  const animationFrameRef = useRef<number>(0)

  const canvasWidth = HILLCLIMB_CONFIG.CANVAS_WIDTH
  const canvasHeight = HILLCLIMB_CONFIG.CANVAS_HEIGHT

  // Canvas setup
  const { canvasRef, context } = useCanvas({
    width: canvasWidth,
    height: canvasHeight,
  })

  // Draw terrain
  const drawTerrain = (ctx: CanvasRenderingContext2D, cameraX: number) => {
    const { terrain } = gameState

    ctx.fillStyle = COLORS.GRASS
    ctx.beginPath()
    ctx.moveTo(-cameraX, HILLCLIMB_CONFIG.CANVAS_HEIGHT)

    for (const point of terrain.points) {
      ctx.lineTo(point.x - cameraX, point.y)
    }

    ctx.lineTo(terrain.points[terrain.points.length - 1].x - cameraX, HILLCLIMB_CONFIG.CANVAS_HEIGHT)
    ctx.closePath()
    ctx.fill()

    // Draw ground line
    ctx.strokeStyle = COLORS.GROUND
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i < terrain.points.length; i++) {
      const point = terrain.points[i]
      if (i === 0) {
        ctx.moveTo(point.x - cameraX, point.y)
      } else {
        ctx.lineTo(point.x - cameraX, point.y)
      }
    }
    ctx.stroke()
  }

  // Draw vehicle
  const drawVehicle = (ctx: CanvasRenderingContext2D, vehicle: Vehicle, cameraX: number) => {
    const x = vehicle.position.x - cameraX
    const y = vehicle.position.y

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(vehicle.rotation)

    // Draw body
    ctx.fillStyle = COLORS.VEHICLE_BODY
    ctx.fillRect(
      -HILLCLIMB_CONFIG.VEHICLE_WIDTH / 2,
      -HILLCLIMB_CONFIG.VEHICLE_HEIGHT / 2,
      HILLCLIMB_CONFIG.VEHICLE_WIDTH,
      HILLCLIMB_CONFIG.VEHICLE_HEIGHT
    )

    // Draw window
    ctx.fillStyle = COLORS.VEHICLE_WINDOW
    ctx.fillRect(
      -HILLCLIMB_CONFIG.VEHICLE_WIDTH / 4,
      -HILLCLIMB_CONFIG.VEHICLE_HEIGHT / 2,
      HILLCLIMB_CONFIG.VEHICLE_WIDTH / 2,
      HILLCLIMB_CONFIG.VEHICLE_HEIGHT / 3
    )

    ctx.restore()

    // Draw wheels
    const drawWheel = (wheelX: number, wheelY: number) => {
      ctx.fillStyle = COLORS.WHEEL
      ctx.beginPath()
      ctx.arc(wheelX - cameraX, wheelY, HILLCLIMB_CONFIG.WHEEL_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#666'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    drawWheel(vehicle.rearWheel.position.x, vehicle.rearWheel.position.y)
    drawWheel(vehicle.frontWheel.position.x, vehicle.frontWheel.position.y)
  }

  // Render function
  const render = useCallback(() => {
    if (!context) return

    const { ctx, width, height } = context

    // Clear canvas with sky
    ctx.fillStyle = COLORS.SKY
    ctx.fillRect(0, 0, width, height)

    // Draw terrain
    drawTerrain(ctx, gameState.cameraX)

    // Draw vehicle
    drawVehicle(ctx, gameState.vehicle, gameState.cameraX)

    // Draw UI
    const padding = 20

    // Fuel bar
    const fuelBarWidth = 200
    const fuelBarHeight = 20
    ctx.fillStyle = COLORS.FUEL_BG
    ctx.fillRect(padding, padding, fuelBarWidth, fuelBarHeight)
    ctx.fillStyle = COLORS.FUEL_BAR
    const fuelWidth = (gameState.fuel / HILLCLIMB_CONFIG.INITIAL_FUEL) * fuelBarWidth
    ctx.fillRect(padding, padding, fuelWidth, fuelBarHeight)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.strokeRect(padding, padding, fuelBarWidth, fuelBarHeight)

    // Text
    ctx.fillStyle = COLORS.UI_TEXT
    ctx.font = 'bold 16px Arial'
    ctx.fillText(`Fuel: ${Math.round(gameState.fuel)}%`, padding, padding + 35)
    ctx.fillText(`Distance: ${Math.round(gameState.distance)}m`, padding, padding + 55)
    ctx.fillText(`Score: ${gameState.score}`, padding, padding + 75)
  }, [context, gameState])

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!gameState.isPlaying || gameState.isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const deltaTime = timestamp - lastUpdateRef.current

      if (deltaTime >= 1000 / HILLCLIMB_CONFIG.FPS) {
        setGameState(prev => {
          const newState = updatePhysics(prev, deltaTime)

          // Save score if game over
          if (newState.isGameOver && !prev.isGameOver && user) {
            updateStats('hill-climb-racing', newState.score)
            addScore('hill-climb-racing', user.id, user.username, user.avatar, newState.score)
          }

          return newState
        })
        lastUpdateRef.current = timestamp
      }

      render()
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    },
    [gameState.isPlaying, gameState.isPaused, render, user, updateStats, addScore]
  )

  // Start game loop
  useEffect(() => {
    if (gameState.isPlaying) {
      lastUpdateRef.current = performance.now()
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState.isPlaying, gameLoop])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (gameState.isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          setGameState(createInitialState())
          setGameState(prev => ({ ...prev, isPlaying: true }))
        }
        return
      }

      if (e.key === 'Escape') {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
        return
      }

      if (e.key === ' ') {
        e.preventDefault()
        if (!gameState.isPlaying) {
          setGameState(prev => ({ ...prev, isPlaying: true }))
        } else {
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
        }
        return
      }

      if (gameState.isPaused || !gameState.isPlaying) return

      setGameState(prev => handleKeyDown(prev, e.key))
    }

    const handleKeyUpEvent = (e: KeyboardEvent) => {
      if (gameState.isPaused || !gameState.isPlaying) return
      setGameState(prev => handleKeyUp(prev, e.key))
    }

    window.addEventListener('keydown', handleKeyDownEvent)
    window.addEventListener('keyup', handleKeyUpEvent)
    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent)
      window.removeEventListener('keyup', handleKeyUpEvent)
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver])

  // Initial render
  useEffect(() => {
    render()
  }, [render])

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-game font-bold">HILL CLIMB RACING</h2>
        <p className="text-gray-400">Climb the hills without flipping over!</p>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-primary-600 rounded-lg shadow-2xl"
          style={{ backgroundColor: COLORS.SKY }}
        />

        {/* Overlay messages */}
        {!gameState.isPlaying && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">Press SPACE to Start</p>
              <div className="text-gray-400 text-sm">
                <p>Arrow Right / W: Accelerate</p>
                <p>Arrow Left / S: Brake</p>
              </div>
            </div>
          </div>
        )}

        {gameState.isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">PAUSED</p>
              <p className="text-gray-400">Press SPACE to Resume</p>
            </div>
          </div>
        )}

        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold mb-4 text-red-500">GAME OVER</p>
              <p className="text-2xl mb-2">Distance: {Math.round(gameState.maxDistance)}m</p>
              <p className="text-2xl mb-2">Score: {gameState.score}</p>
              <p className="text-gray-400 mb-4">Time: {Math.round(gameState.time)}s</p>
              <p className="text-sm text-gray-500">Press SPACE to Play Again</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-game-card rounded-lg p-4 text-center">
        <h3 className="text-sm font-bold mb-2 text-gray-400">CONTROLS</h3>
        <div className="text-xs space-y-1 text-gray-400">
          <p>→ / W : Accelerate</p>
          <p>← / S : Brake</p>
          <p>SPACE : Pause</p>
          <p>ESC : Pause</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button onClick={() => navigate('/')} className="btn-secondary">
          🏠 Exit
        </button>
      </div>
    </div>
  )
}
