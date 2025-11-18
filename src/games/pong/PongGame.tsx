/**
 * Pong Game Component
 * Main game component that manages game state and rendering
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCanvas } from '@shared/hooks/useCanvas'
import { useGameLoop } from '@shared/game-engine/useGameLoop'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import { PONG_CONFIG, COLORS } from './config'
import type { PongState } from './types'
import {
  createInitialState,
  updatePaddle,
  updateAIPaddle,
  updateBall,
  checkWinner,
} from './gameLogic'

export const PongGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<PongState>(createInitialState())
  const keysPressed = useRef<Set<string>>(new Set())

  // Canvas setup
  const { canvasRef, context } = useCanvas({
    width: PONG_CONFIG.CANVAS_WIDTH,
    height: PONG_CONFIG.CANVAS_HEIGHT,
  })

  // Render function
  const render = useCallback(() => {
    if (!context) return

    const { ctx, width, height } = context

    // Clear canvas
    ctx.fillStyle = COLORS.BACKGROUND
    ctx.fillRect(0, 0, width, height)

    // Draw center line
    ctx.strokeStyle = COLORS.CENTER_LINE
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = COLORS.PADDLE
    ctx.fillRect(
      gameState.playerPaddle.position.x,
      gameState.playerPaddle.position.y,
      gameState.playerPaddle.size.width,
      gameState.playerPaddle.size.height
    )
    ctx.fillRect(
      gameState.aiPaddle.position.x,
      gameState.aiPaddle.position.y,
      gameState.aiPaddle.size.width,
      gameState.aiPaddle.size.height
    )

    // Draw ball
    ctx.fillStyle = COLORS.BALL
    ctx.fillRect(
      gameState.ball.position.x,
      gameState.ball.position.y,
      gameState.ball.size.width,
      gameState.ball.size.height
    )

    // Draw scores
    ctx.fillStyle = COLORS.TEXT
    ctx.font = 'bold 48px Orbitron, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(gameState.playerScore.toString(), width / 4, 60)
    ctx.fillText(gameState.aiScore.toString(), (width * 3) / 4, 60)

    // Draw instructions if not playing
    if (!gameState.isPlaying && !gameState.isGameOver) {
      ctx.font = '24px Orbitron, sans-serif'
      ctx.fillText('Press SPACE to start', width / 2, height / 2 + 50)
      ctx.font = '16px sans-serif'
      ctx.fillText('Use W/S or Arrow keys to move', width / 2, height / 2 + 80)
    }

    // Draw pause screen
    if (gameState.isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = COLORS.TEXT
      ctx.font = 'bold 48px Orbitron, sans-serif'
      ctx.fillText('PAUSED', width / 2, height / 2)
      ctx.font = '20px sans-serif'
      ctx.fillText('Press SPACE to resume', width / 2, height / 2 + 40)
    }

    // Draw game over screen
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = COLORS.TEXT
      ctx.font = 'bold 56px Orbitron, sans-serif'
      ctx.fillText(gameState.winner === 'player' ? 'YOU WIN!' : 'AI WINS!', width / 2, height / 2 - 40)
      ctx.font = '24px sans-serif'
      ctx.fillText(`Final Score: ${gameState.playerScore} - ${gameState.aiScore}`, width / 2, height / 2 + 20)
      ctx.font = '20px sans-serif'
      ctx.fillText('Press SPACE to play again', width / 2, height / 2 + 60)
      ctx.fillText('Press ESC to exit', width / 2, height / 2 + 90)
    }
  }, [context, gameState])

  // Update function
  const update = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return

    setGameState(prevState => {
      // Update player paddle based on input
      let newState = { ...prevState }

      let playerVelocity = 0
      if (keysPressed.current.has('w') || keysPressed.current.has('ArrowUp')) {
        playerVelocity = -prevState.playerPaddle.speed
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('ArrowDown')) {
        playerVelocity = prevState.playerPaddle.speed
      }

      newState.playerPaddle = updatePaddle({
        ...prevState.playerPaddle,
        velocity: { x: 0, y: playerVelocity },
      })

      // Update AI paddle
      newState.aiPaddle = updateAIPaddle(prevState.aiPaddle, prevState.ball)

      // Update ball
      newState = updateBall(newState)

      // Check winner
      newState = checkWinner(newState)

      // Save score when game ends
      if (newState.isGameOver && !prevState.isGameOver && user) {
        updateStats('pong', newState.playerScore)
        addScore('pong', user.id, user.username, user.avatar, newState.playerScore)
      }

      return newState
    })
  }, [gameState.isPlaying, gameState.isPaused, user, updateStats, addScore])

  // Game loop
  useGameLoop({
    onUpdate: update,
    onRender: render,
    isPlaying: true,
    fps: PONG_CONFIG.FPS,
  })

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (key === ' ') {
        e.preventDefault()
        if (gameState.isGameOver) {
          setGameState(createInitialState())
          setGameState(prev => ({ ...prev, isPlaying: true }))
        } else if (!gameState.isPlaying) {
          setGameState(prev => ({ ...prev, isPlaying: true }))
        } else {
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
        }
        return
      }

      if (key === 'escape') {
        if (gameState.isGameOver) {
          navigate('/')
        } else {
          setGameState(prev => ({ ...prev, isPaused: true }))
        }
        return
      }

      keysPressed.current.add(key)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, navigate])

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-game font-bold text-center mb-2">PONG</h2>
        <p className="text-gray-400 text-center">First to {PONG_CONFIG.MAX_SCORE} wins!</p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-primary-600 rounded-lg shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
          <div>
            <kbd className="px-2 py-1 bg-game-card rounded">W</kbd> /{' '}
            <kbd className="px-2 py-1 bg-game-card rounded">↑</kbd> - Move Up
          </div>
          <div>
            <kbd className="px-2 py-1 bg-game-card rounded">S</kbd> /{' '}
            <kbd className="px-2 py-1 bg-game-card rounded">↓</kbd> - Move Down
          </div>
        </div>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
          <div>
            <kbd className="px-2 py-1 bg-game-card rounded">SPACE</kbd> - Start/Pause
          </div>
          <div>
            <kbd className="px-2 py-1 bg-game-card rounded">ESC</kbd> - Exit
          </div>
        </div>
      </div>
    </div>
  )
}
