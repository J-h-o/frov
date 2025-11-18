/**
 * Game page wrapper - Loads and displays individual games
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGameStore } from '@platform/store/gameStore'
import { useUserStore } from '@platform/store/userStore'

// Import games
import { PongGame } from '@games/pong/PongGame'

export const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { getGameById, updateGamePlays } = useGameStore()
  const { user } = useUserStore()

  const game = gameId ? getGameById(gameId) : null

  useEffect(() => {
    if (game) {
      updateGamePlays(game.id)
    }
  }, [game, updateGamePlays])

  if (!game) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Game not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Render the appropriate game component
  const renderGame = () => {
    switch (gameId) {
      case 'pong':
        return <PongGame />
      case 'connect4':
        return <div className="text-center py-20">Connect 4 - Coming Soon!</div>
      case 'battleships':
        return <div className="text-center py-20">Battleships - Coming Soon!</div>
      case 'solitaire':
        return <div className="text-center py-20">Solitaire - Coming Soon!</div>
      case 'spider-solitaire':
        return <div className="text-center py-20">Spider Solitaire - Coming Soon!</div>
      case 'hill-climb-racing':
        return <div className="text-center py-20">Hill Climb Racing - Coming Soon!</div>
      case 'tetris':
        return <div className="text-center py-20">Tetris - Coming Soon!</div>
      default:
        return <div className="text-center py-20">Game not implemented yet</div>
    }
  }

  return (
    <div className="min-h-screen bg-game-bg">
      {/* Game Header */}
      <div className="bg-game-card border-b border-gray-700 py-4">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-2xl hover:text-primary-500 transition-colors"
            >
              ⬅️
            </button>
            <h1 className="text-3xl font-game font-bold">{game.name}</h1>
          </div>
          <div className="text-gray-400">
            Playing as: <span className="text-white font-semibold">{user?.username}</span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container-custom py-8">{renderGame()}</div>
    </div>
  )
}
