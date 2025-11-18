/**
 * Profile page - User stats and saved games
 */

import { Link } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import { formatScore } from '@shared/utils/game'

export const Profile = () => {
  const { user } = useUserStore()
  const { games } = useGameStore()

  if (!user) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No user logged in</h2>
          <p className="text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  const savedGames = games.filter(game => user.savedGames.includes(game.id))
  const totalPlays = user.stats.reduce((sum, stat) => sum + stat.totalPlays, 0)
  const totalHighScore = user.stats.reduce((sum, stat) => sum + stat.highScore, 0)

  return (
    <div className="min-h-screen bg-game-bg pb-12">
      <div className="container-custom py-8">
        {/* Profile Header */}
        <div className="bg-game-card rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="text-8xl">{user.avatar}</div>
            <div>
              <h1 className="text-4xl font-game font-bold mb-2">{user.username}</h1>
              <p className="text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div>
                  <p className="text-2xl font-bold text-primary-500">{totalPlays}</p>
                  <p className="text-sm text-gray-400">Total Plays</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-500">{user.stats.length}</p>
                  <p className="text-sm text-gray-400">Games Played</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-500">{formatScore(totalHighScore)}</p>
                  <p className="text-sm text-gray-400">Combined Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mb-8">
          <h2 className="text-3xl font-game font-bold mb-6">Game Statistics</h2>
          {user.stats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.stats.map(stat => {
                const game = games.find(g => g.id === stat.gameId)
                if (!game) return null

                return (
                  <div key={stat.gameId} className="bg-game-card rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">{game.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plays:</span>
                        <span className="font-semibold">{stat.totalPlays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">High Score:</span>
                        <span className="font-semibold text-primary-500">{formatScore(stat.highScore)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Played:</span>
                        <span className="font-semibold">
                          {new Date(stat.lastPlayed).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No games played yet</p>
          )}
        </div>

        {/* Saved Games */}
        <div>
          <h2 className="text-3xl font-game font-bold mb-6">Saved Games ⭐</h2>
          {savedGames.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedGames.map(game => (
                <Link
                  key={game.id}
                  to={`/game/${game.id}`}
                  className="bg-game-card rounded-lg p-4 hover:bg-game-hover transition-colors"
                >
                  <div className="text-4xl text-center mb-2">🎮</div>
                  <h3 className="text-center font-bold">{game.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No saved games yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
