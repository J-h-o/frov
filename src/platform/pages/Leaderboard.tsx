/**
 * Leaderboard page - View top scores across all games
 */

import { useState } from 'react'
import { useGameStore } from '@platform/store/gameStore'
import { GAMES } from '@platform/services/gamesData'
import { formatScore } from '@shared/utils/game'

export const Leaderboard = () => {
  const { leaderboards } = useGameStore()
  const [selectedGame, setSelectedGame] = useState<string>(GAMES[0].id)

  const currentLeaderboard = leaderboards.get(selectedGame)

  return (
    <div className="min-h-screen bg-game-bg pb-12">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-game font-bold text-gradient mb-4">Leaderboard</h1>
          <p className="text-xl text-gray-400">Top players across all games</p>
        </div>

        {/* Game Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-400 mb-3">Select Game:</label>
          <select
            value={selectedGame}
            onChange={e => setSelectedGame(e.target.value)}
            className="w-full md:w-auto px-6 py-3 bg-game-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          >
            {GAMES.map(game => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Leaderboard Table */}
        {currentLeaderboard && currentLeaderboard.entries.length > 0 ? (
          <div className="bg-game-card rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-900">
                <tr>
                  <th className="px-6 py-4 text-left font-game">Rank</th>
                  <th className="px-6 py-4 text-left font-game">Player</th>
                  <th className="px-6 py-4 text-right font-game">Score</th>
                  <th className="px-6 py-4 text-right font-game">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentLeaderboard.entries.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`border-t border-gray-700 ${
                      index < 3 ? 'bg-primary-900/20' : 'hover:bg-game-hover'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        <span className="font-bold text-lg">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{entry.avatar}</span>
                        <span className="font-semibold">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xl font-bold text-primary-500">
                        {formatScore(entry.score)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {new Date(entry.playedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-game-card rounded-lg p-12 text-center">
            <p className="text-2xl text-gray-500 mb-2">No scores yet</p>
            <p className="text-gray-600">Be the first to play and set a high score!</p>
          </div>
        )}

        {/* Last Updated */}
        {currentLeaderboard && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Last updated: {new Date(currentLeaderboard.lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
