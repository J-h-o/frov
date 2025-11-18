/**
 * Search bar component for filtering games
 */

import { useGameStore } from '@platform/store/gameStore'

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useGameStore()

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search games..."
        className="w-full px-4 py-3 pl-12 bg-game-card text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
      />
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
    </div>
  )
}
