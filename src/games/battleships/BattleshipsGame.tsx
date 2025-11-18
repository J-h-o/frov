/**
 * Battleships Game Component
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import type { BattleshipsState } from './types'
import { BATTLESHIPS_CONFIG, COLORS } from './config'
import { createInitialState, placeShip, shoot, aiShoot } from './gameLogic'

export const BattleshipsGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<BattleshipsState>(createInitialState())
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null)

  // AI turn with delay
  useEffect(() => {
    if (gameState.phase === 'battle' && gameState.currentTurn === 'ai' && !gameState.winner) {
      const timeout = setTimeout(() => {
        const newState = aiShoot(gameState)
        setGameState(newState)

        if (newState.winner && user) {
          const score = newState.winner === 'player' ? 1000 - newState.moves * 10 : 0
          updateStats('battleships', score)
          addScore('battleships', user.id, user.username, user.avatar, score)
        }
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [gameState, user, updateStats, addScore])

  const handleCellClick = (row: number, col: number) => {
    if (gameState.phase === 'placement' && gameState.selectedShip !== null) {
      const newState = placeShip(gameState, gameState.selectedShip, row, col)
      if (newState) setGameState(newState)
    } else if (gameState.phase === 'battle' && gameState.currentTurn === 'player') {
      const newState = shoot(gameState, row, col)
      if (newState) {
        setGameState(newState)
        if (newState.winner && user) {
          const score = newState.winner === 'player' ? 1000 - newState.moves * 10 : 0
          updateStats('battleships', score)
          addScore('battleships', user.id, user.username, user.avatar, score)
        }
      }
    }
  }

  const renderCell = (row: number, col: number, isPlayerBoard: boolean) => {
    const board = isPlayerBoard ? gameState.playerBoard : gameState.aiBoard
    const cell = board[row][col]
    const isHover = hoverCell?.row === row && hoverCell?.col === col

    let bgColor: string = COLORS.WATER
    let content = ''

    if (cell.state === 'ship' && isPlayerBoard) {
      bgColor = COLORS.SHIP
    } else if (cell.state === 'hit') {
      bgColor = COLORS.HIT
      content = '💥'
    } else if (cell.state === 'miss') {
      bgColor = COLORS.MISS
      content = '●'
    }

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => !isPlayerBoard && handleCellClick(row, col)}
        onMouseEnter={() => !isPlayerBoard && setHoverCell({ row, col })}
        onMouseLeave={() => setHoverCell(null)}
        className={`flex items-center justify-center border transition-all ${
          !isPlayerBoard && cell.state === 'empty' ? 'cursor-pointer hover:opacity-80' : ''
        }`}
        style={{
          width: BATTLESHIPS_CONFIG.CELL_SIZE,
          height: BATTLESHIPS_CONFIG.CELL_SIZE,
          backgroundColor: isHover && !isPlayerBoard ? COLORS.HOVER : bgColor,
          borderColor: COLORS.GRID,
        }}
      >
        <span className="text-xl">{content}</span>
      </div>
    )
  }

  const renderBoard = (isPlayerBoard: boolean, title: string) => {
    const board = isPlayerBoard ? gameState.playerBoard : gameState.aiBoard

    return (
      <div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <div className="inline-block bg-gray-800 p-2 rounded-lg">
          {/* Column headers */}
          <div className="flex mb-1">
            <div className="w-[40px]"></div>
            {Array.from({ length: BATTLESHIPS_CONFIG.GRID_SIZE }, (_, i) => (
              <div
                key={i}
                className="w-[40px] text-center text-white text-sm font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Grid */}
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              <div className="w-[40px] flex items-center justify-center text-white text-sm font-bold">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {row.map((_, colIndex) => renderCell(rowIndex, colIndex, isPlayerBoard))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-game-bg py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-game font-bold">BATTLESHIPS</h2>
            <p className="text-gray-400">
              {gameState.phase === 'placement' && 'Place your ships'}
              {gameState.phase === 'battle' && `${gameState.currentTurn === 'player' ? 'Your' : "AI's"} turn`}
              {gameState.phase === 'gameover' && (gameState.winner === 'player' ? 'You Win!' : 'AI Wins!')}
            </p>
          </div>
          <div className="flex gap-4">
            {gameState.phase === 'placement' && (
              <button
                onClick={() =>
                  setGameState(prev => ({
                    ...prev,
                    shipOrientation: prev.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal',
                  }))
                }
                className="btn-secondary"
              >
                🔄 Rotate ({gameState.shipOrientation})
              </button>
            )}
            <button onClick={() => setGameState(createInitialState())} className="btn-primary">
              🔄 New Game
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              🏠 Exit
            </button>
          </div>
        </div>

        {/* Ship Placement Status */}
        {gameState.phase === 'placement' && (
          <div className="mb-6 bg-game-card p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Place Your Ships:</h3>
            <div className="flex gap-4 flex-wrap">
              {gameState.playerShips.map((ship, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded ${
                    ship.positions.length > 0
                      ? 'bg-green-700'
                      : i === gameState.selectedShip
                      ? 'bg-yellow-600'
                      : 'bg-gray-700'
                  }`}
                >
                  {ship.name} ({ship.length})
                  {ship.positions.length > 0 && ' ✓'}
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Click on the grid to place the highlighted ship
            </p>
          </div>
        )}

        {/* Ship Status */}
        {gameState.phase === 'battle' && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-game-card p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Your Fleet:</h3>
              {gameState.playerShips.map((ship, i) => (
                <div key={i} className={`${ship.sunk ? 'text-red-500' : 'text-green-500'}`}>
                  {ship.name}: {ship.sunk ? '⚓ Sunk' : `${ship.length - ship.hits}/${ship.length}`}
                </div>
              ))}
            </div>
            <div className="bg-game-card p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Enemy Fleet:</h3>
              {gameState.aiShips.map((ship, i) => (
                <div key={i} className={`${ship.sunk ? 'text-red-500' : 'text-gray-400'}`}>
                  {ship.name}: {ship.sunk ? '⚓ Sunk' : '?'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boards */}
        <div className="flex gap-8 justify-center flex-wrap">
          {gameState.phase === 'placement' && renderBoard(true, 'Your Board - Click to Place Ships')}
          {gameState.phase !== 'placement' && (
            <>
              {renderBoard(true, 'Your Board')}
              {renderBoard(false, 'Enemy Board - Click to Attack')}
            </>
          )}
        </div>

        {/* Win Message */}
        {gameState.winner && (
          <div className="mt-6 bg-green-600 text-white p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">
              {gameState.winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}
            </p>
            <p>Moves: {gameState.moves}</p>
          </div>
        )}
      </div>
    </div>
  )
}
