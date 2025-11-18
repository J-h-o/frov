/**
 * Connect 4 Game Component
 * Classic two-player strategy game with AI opponent
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import { CONNECT4_CONFIG, COLORS } from './config'
import type { Connect4State } from './types'
import { createInitialState, makeMove, isValidMove, getBestMove } from './gameLogic'

export const Connect4Game = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<Connect4State>(createInitialState('ai'))
  const [hoverCol, setHoverCol] = useState<number | null>(null)

  // Calculate canvas size
  const canvasWidth = CONNECT4_CONFIG.COLS * CONNECT4_CONFIG.CELL_SIZE
  const canvasHeight = CONNECT4_CONFIG.ROWS * CONNECT4_CONFIG.CELL_SIZE

  // Handle column click
  const handleColumnClick = useCallback(
    (col: number) => {
      if (
        gameState.isGameOver ||
        !isValidMove(gameState.board, col) ||
        gameState.aiThinking ||
        (gameState.mode === 'ai' && gameState.currentPlayer === 'yellow')
      ) {
        return
      }

      const newState = makeMove(gameState, col)
      setGameState(newState)

      // Update stats if game over
      if (newState.isGameOver && user) {
        const score = newState.winner === 'red' ? 100 : newState.winner === 'draw' ? 50 : 0
        updateStats('connect4', score)
        addScore('connect4', user.id, user.username, user.avatar, score)
      }
    },
    [gameState, user, updateStats, addScore]
  )

  // AI move
  useEffect(() => {
    if (
      gameState.mode === 'ai' &&
      gameState.currentPlayer === 'yellow' &&
      !gameState.isGameOver &&
      !gameState.aiThinking
    ) {
      setGameState(prev => ({ ...prev, aiThinking: true }))

      setTimeout(() => {
        const bestCol = getBestMove(gameState.board, 'yellow')
        if (bestCol !== -1) {
          const newState = makeMove(gameState, bestCol)
          setGameState({ ...newState, aiThinking: false })

          // Update stats if game over
          if (newState.isGameOver && user) {
            const score = newState.winner === 'red' ? 100 : newState.winner === 'draw' ? 50 : 0
            updateStats('connect4', score)
            addScore('connect4', user.id, user.username, user.avatar, score)
          }
        } else {
          setGameState(prev => ({ ...prev, aiThinking: false }))
        }
      }, CONNECT4_CONFIG.AI_THINK_TIME)
    }
  }, [gameState, user, updateStats, addScore])

  const handleRestart = () => {
    setGameState(createInitialState(gameState.mode))
  }

  const handleExit = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-game font-bold mb-2">CONNECT 4</h2>
        <p className="text-gray-400">
          {gameState.mode === 'ai' ? 'Player vs AI' : 'Player vs Player'}
        </p>
      </div>

      {/* Game Status */}
      <div className="mb-4 h-12 flex items-center">
        {gameState.isGameOver ? (
          <div className="text-2xl font-bold">
            {gameState.winner === 'draw' ? (
              <span className="text-yellow-500">🤝 Draw!</span>
            ) : gameState.winner === 'red' ? (
              <span className="text-red-500">🎉 Red Wins!</span>
            ) : (
              <span className="text-yellow-500">🎉 Yellow Wins!</span>
            )}
          </div>
        ) : gameState.aiThinking ? (
          <div className="text-xl text-yellow-500">🤔 AI is thinking...</div>
        ) : (
          <div className="text-xl">
            Current Player:{' '}
            <span
              className={`font-bold ${
                gameState.currentPlayer === 'red' ? 'text-red-500' : 'text-yellow-500'
              }`}
            >
              {gameState.currentPlayer === 'red' ? '🔴 Red' : '🟡 Yellow'}
            </span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div
        className="relative rounded-lg shadow-2xl"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: COLORS.BOARD,
        }}
      >
        {/* Board Grid */}
        <div className="grid grid-cols-7 gap-0 w-full h-full p-2">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative flex items-center justify-center cursor-pointer transition-all"
                onClick={() => handleColumnClick(colIndex)}
                onMouseEnter={() => setHoverCol(colIndex)}
                onMouseLeave={() => setHoverCol(null)}
                style={{
                  width: CONNECT4_CONFIG.CELL_SIZE - CONNECT4_CONFIG.CELL_PADDING,
                  height: CONNECT4_CONFIG.CELL_SIZE - CONNECT4_CONFIG.CELL_PADDING,
                  backgroundColor:
                    hoverCol === colIndex && !gameState.isGameOver
                      ? COLORS.HOVER
                      : 'transparent',
                }}
              >
                {/* Cell Background */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: CONNECT4_CONFIG.PIECE_RADIUS * 2,
                    height: CONNECT4_CONFIG.PIECE_RADIUS * 2,
                    backgroundColor: COLORS.CELL_EMPTY,
                  }}
                />

                {/* Game Piece */}
                {cell.player && (
                  <div
                    className={`absolute rounded-full transition-all duration-300 ${
                      cell.isWinning ? 'animate-pulse' : ''
                    }`}
                    style={{
                      width: CONNECT4_CONFIG.PIECE_RADIUS * 2 - 4,
                      height: CONNECT4_CONFIG.PIECE_RADIUS * 2 - 4,
                      backgroundColor:
                        cell.player === 'red' ? COLORS.RED_PIECE : COLORS.YELLOW_PIECE,
                      boxShadow: cell.isWinning
                        ? `0 0 20px ${COLORS.WINNING_GLOW}`
                        : undefined,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4">
        <button onClick={handleRestart} className="btn-primary">
          🔄 New Game
        </button>
        <button onClick={handleExit} className="btn-secondary">
          🏠 Exit
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-400 max-w-md">
        <p>Click on a column to drop your piece. Get 4 in a row to win!</p>
        <p className="mt-2">
          Moves: {gameState.moves} | {gameState.currentPlayer === 'red' ? 'Your' : "AI's"} Turn
        </p>
      </div>
    </div>
  )
}
