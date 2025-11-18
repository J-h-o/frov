/**
 * Home page - Main game listing
 */

import { useMemo } from 'react'
import { GameCard } from '@platform/components/GameCard'
import { SearchBar } from '@platform/components/SearchBar'
import { CategoryFilter } from '@platform/components/CategoryFilter'
import { useGameStore } from '@platform/store/gameStore'
import { getFeaturedGames } from '@platform/services/gamesData'

export const Home = () => {
  const { games, searchQuery, selectedCategory } = useGameStore()

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    let filtered = games

    if (searchQuery) {
      filtered = filtered.filter(
        game =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(game => game.category === selectedCategory)
    }

    return filtered
  }, [games, searchQuery, selectedCategory])

  const featuredGames = getFeaturedGames()

  return (
    <div className="min-h-screen bg-game-bg pb-12">
      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-game font-bold text-gradient mb-4">
            Welcome to Frov Game Platform
          </h1>
          <p className="text-xl text-gray-400">Play classic games, compete, and have fun!</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <SearchBar />
          <CategoryFilter />
        </div>

        {/* Featured Games */}
        {!searchQuery && !selectedCategory && featuredGames.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-game font-bold mb-6">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* All Games */}
        <div>
          <h2 className="text-3xl font-game font-bold mb-6">
            {searchQuery || selectedCategory ? 'Search Results' : 'All Games'}
          </h2>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-500">No games found</p>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
