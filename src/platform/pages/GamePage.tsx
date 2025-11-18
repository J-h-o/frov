/**
 * Game page wrapper - Loads and displays individual games
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGameStore } from '@platform/store/gameStore'
import { useUserStore } from '@platform/store/userStore'

// Import games
import { PongGame } from '@games/pong/PongGame'
import { Connect4Game } from '@games/connect4/Connect4Game'
import { TetrisGame } from '@games/tetris/TetrisGame'
import { FireboyWatergirlGame } from '@games/fireboy-watergirl/FireboyWatergirlGame'
import { SolitaireGame } from '@games/solitaire/SolitaireGame'
import { BattleshipsGame } from '@games/battleships/BattleshipsGame'
import { SpiderSolitaireGame } from '@games/spider-solitaire/SpiderSolitaireGame'
import { HillClimbGame } from '@games/hill-climb-racing/HillClimbGame'

export const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { getGameById, updateGamePlays } = useGameStore()
  const { user } = useUserStore()

  const game = gameId ? getGameById(gameId) : null

  useEffect(() => {
    if (gameId) {
      updateGamePlays(gameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]) // Only run when gameId changes, not when game object updates

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
        return <Connect4Game />
      case 'battleships':
        return <BattleshipsGame />
      case 'solitaire':
        return <SolitaireGame />
      case 'spider-solitaire':
        return <SpiderSolitaireGame />
      case 'hill-climb-racing':
        return <HillClimbGame />
      case 'tetris':
        return <TetrisGame />
      case 'fireboy-watergirl':
        return <FireboyWatergirlGame />
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
