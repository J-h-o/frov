/**
 * Tetris Game Component
 * Classic block-stacking puzzle game
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCanvas } from '@shared/hooks/useCanvas'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import { TETRIS_CONFIG, COLORS } from './config'
import type { TetrisState, Tetromino, CellValue } from './types'
import {
  createInitialState,
  movePiece,
  rotate,
  hardDrop,
  holdPiece,
  getGhostPosition,
} from './gameLogic'

export const TetrisGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<TetrisState>(createInitialState())
  const lastUpdateRef = useRef<number>(0)
  const animationFrameRef = useRef<number>(0)

  const canvasWidth = TETRIS_CONFIG.GRID_WIDTH * TETRIS_CONFIG.CELL_SIZE
  const canvasHeight = TETRIS_CONFIG.GRID_HEIGHT * TETRIS_CONFIG.CELL_SIZE

  // Canvas setup
  const { canvasRef, context } = useCanvas({
    width: canvasWidth,
    height: canvasHeight,
  })

  // Draw a tetromino
  const drawTetromino = (
    ctx: CanvasRenderingContext2D,
    piece: Tetromino,
    offsetX: number = 0,
    offsetY: number = 0,
    alpha: number = 1
  ) => {
    const { shape, position, color } = piece

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const x = (position.x + colIndex + offsetX) * TETRIS_CONFIG.CELL_SIZE
          const y = (position.y + rowIndex + offsetY) * TETRIS_CONFIG.CELL_SIZE

          ctx.globalAlpha = alpha
          ctx.fillStyle = color
          ctx.fillRect(x, y, TETRIS_CONFIG.CELL_SIZE - 1, TETRIS_CONFIG.CELL_SIZE - 1)
          ctx.globalAlpha = 1

          // Add 3D effect
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.strokeRect(x + 2, y + 2, TETRIS_CONFIG.CELL_SIZE - 5, TETRIS_CONFIG.CELL_SIZE - 5)
        }
      })
    })
  }

  // Draw grid cell
  const drawCell = (ctx: CanvasRenderingContext2D, value: CellValue, x: number, y: number) => {
    const cellX = x * TETRIS_CONFIG.CELL_SIZE
    const cellY = y * TETRIS_CONFIG.CELL_SIZE

    if (value) {
      ctx.fillStyle = COLORS[`CELL_${value}` as keyof typeof COLORS] || COLORS.CELL_EMPTY
      ctx.fillRect(cellX, cellY, TETRIS_CONFIG.CELL_SIZE - 1, TETRIS_CONFIG.CELL_SIZE - 1)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.strokeRect(cellX + 2, cellY + 2, TETRIS_CONFIG.CELL_SIZE - 5, TETRIS_CONFIG.CELL_SIZE - 5)
    } else {
      ctx.fillStyle = COLORS.CELL_EMPTY
      ctx.fillRect(cellX, cellY, TETRIS_CONFIG.CELL_SIZE - 1, TETRIS_CONFIG.CELL_SIZE - 1)
    }
  }

  // Render function
  const render = useCallback(() => {
    if (!context) return

    const { ctx, width, height } = context

    // Clear canvas
    ctx.fillStyle = COLORS.GRID_BG
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    gameState.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        drawCell(ctx, cell, colIndex, rowIndex)
      })
    })

    // Draw ghost piece
    if (gameState.currentPiece && !gameState.isGameOver) {
      const ghostPos = getGhostPosition(gameState)
      if (ghostPos) {
        const ghostPiece = {
          ...gameState.currentPiece,
          position: ghostPos,
        }
        drawTetromino(ctx, ghostPiece, 0, 0, 0.3)
      }
    }

    // Draw current piece
    if (gameState.currentPiece && !gameState.isGameOver) {
      drawTetromino(ctx, gameState.currentPiece)
    }

    // Draw grid lines
    ctx.strokeStyle = COLORS.GRID_BORDER
    ctx.lineWidth = 0.5
    for (let i = 0; i <= TETRIS_CONFIG.GRID_WIDTH; i++) {
      ctx.beginPath()
      ctx.moveTo(i * TETRIS_CONFIG.CELL_SIZE, 0)
      ctx.lineTo(i * TETRIS_CONFIG.CELL_SIZE, height)
      ctx.stroke()
    }
    for (let i = 0; i <= TETRIS_CONFIG.GRID_HEIGHT; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * TETRIS_CONFIG.CELL_SIZE)
      ctx.lineTo(width, i * TETRIS_CONFIG.CELL_SIZE)
      ctx.stroke()
    }
  }, [context, gameState])

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!gameState.isPlaying || gameState.isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      const deltaTime = timestamp - lastUpdateRef.current

      if (deltaTime >= gameState.dropInterval) {
        setGameState(prev => {
          const newState = movePiece(prev, 'down')

          // Save score if game over
          if (newState.isGameOver && !prev.isGameOver && user) {
            updateStats('tetris', newState.score)
            addScore('tetris', user.id, user.username, user.avatar, newState.score)
          }

          return newState
        })
        lastUpdateRef.current = timestamp
      }

      render()
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    },
    [gameState.isPlaying, gameState.isPaused, gameState.dropInterval, render, user, updateStats, addScore]
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
    const handleKeyDown = (e: KeyboardEvent) => {
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

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setGameState(prev => movePiece(prev, 'left'))
          break
        case 'ArrowRight':
          e.preventDefault()
          setGameState(prev => movePiece(prev, 'right'))
          break
        case 'ArrowDown':
          e.preventDefault()
          setGameState(prev => movePiece(prev, 'down'))
          break
        case 'ArrowUp':
        case 'x':
          e.preventDefault()
          setGameState(prev => rotate(prev))
          break
        case 'c':
          e.preventDefault()
          setGameState(prev => holdPiece(prev))
          break
        case ' ':
          e.preventDefault()
          setGameState(prev => hardDrop(prev))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver])

  // Render hold and next pieces
  const renderPreview = (piece: Tetromino | null, label: string) => {
    if (!piece) return null

    return (
      <div className="bg-game-card rounded-lg p-4">
        <h3 className="text-sm font-bold mb-2 text-gray-400">{label}</h3>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(4, ${TETRIS_CONFIG.PREVIEW_SIZE}px)`,
            gap: '1px',
            backgroundColor: COLORS.GRID_BG,
            padding: '4px',
          }}
        >
          {Array.from({ length: 16 }, (_, i) => {
            const row = Math.floor(i / 4)
            const col = i % 4
            const cell = piece.shape[row]?.[col]
            return (
              <div
                key={i}
                style={{
                  width: TETRIS_CONFIG.PREVIEW_SIZE,
                  height: TETRIS_CONFIG.PREVIEW_SIZE,
                  backgroundColor: cell ? piece.color : COLORS.CELL_EMPTY,
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8 py-8">
      {/* Left Side - Hold */}
      <div className="flex flex-col gap-4">
        {renderPreview(gameState.holdPiece, 'HOLD (C)')}
        <div className="bg-game-card rounded-lg p-4">
          <h3 className="text-sm font-bold mb-2 text-gray-400">CONTROLS</h3>
          <div className="text-xs space-y-1 text-gray-400">
            <p>← → : Move</p>
            <p>↓ : Soft Drop</p>
            <p>↑ / X : Rotate</p>
            <p>Space : Hard Drop</p>
            <p>C : Hold</p>
            <p>ESC : Pause</p>
          </div>
        </div>
      </div>

      {/* Center - Game */}
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <h2 className="text-3xl font-game font-bold text-center">TETRIS</h2>
        </div>

        {/* Score */}
        <div className="mb-4 flex gap-4 text-center">
          <div className="bg-game-card rounded px-4 py-2">
            <div className="text-xs text-gray-400">SCORE</div>
            <div className="text-xl font-bold">{gameState.score.toLocaleString()}</div>
          </div>
          <div className="bg-game-card rounded px-4 py-2">
            <div className="text-xs text-gray-400">LEVEL</div>
            <div className="text-xl font-bold">{gameState.level}</div>
          </div>
          <div className="bg-game-card rounded px-4 py-2">
            <div className="text-xs text-gray-400">LINES</div>
            <div className="text-xl font-bold">{gameState.linesCleared}</div>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary-600 rounded-lg shadow-2xl"
          />

          {/* Overlay messages */}
          {!gameState.isPlaying && !gameState.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">Press SPACE to Start</p>
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
                <p className="text-2xl mb-2">Final Score: {gameState.score.toLocaleString()}</p>
                <p className="text-gray-400 mb-4">Level {gameState.level} • {gameState.linesCleared} Lines</p>
                <p className="text-sm text-gray-500">Press SPACE to Play Again</p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button onClick={() => navigate('/')} className="btn-secondary">
            🏠 Exit
          </button>
        </div>
      </div>

      {/* Right Side - Next */}
      <div className="flex flex-col gap-4">
        {renderPreview(gameState.nextPiece, 'NEXT')}
      </div>
    </div>
  )
}
