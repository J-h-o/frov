/**
 * Game card component
 * Displays game information with play button and actions
 */

import { Link } from 'react-router-dom'
import type { Game } from '@shared/types'
import { useUserStore } from '@platform/store/userStore'

interface GameCardProps {
  game: Game
}

export const GameCard = ({ game }: GameCardProps) => {
  const { user, saveGame, unsaveGame } = useUserStore()
  const isSaved = user?.savedGames.includes(game.id) || false

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSaved) {
      unsaveGame(game.id)
    } else {
      saveGame(game.id)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'hard':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Link to={`/game/${game.id}`} className="game-card">
      {/* Thumbnail placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <span className="text-6xl">🎮</span>
      </div>

      {/* Game info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-game font-bold">{game.name}</h3>
          <button
            onClick={handleSaveToggle}
            className="text-2xl hover:scale-110 transition-transform"
            aria-label={isSaved ? 'Unsave game' : 'Save game'}
          >
            {isSaved ? '⭐' : '☆'}
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">
              {game.totalPlays > 0 ? `${game.totalPlays.toLocaleString()} plays` : 'New!'}
            </span>
            <span className={getDifficultyColor(game.difficulty)}>
              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
            </span>
          </div>

          {game.averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-300">{game.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {game.featured && (
          <div className="mt-3 inline-block bg-primary-600 text-xs font-semibold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
    </Link>
  )
}
