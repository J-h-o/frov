/**
 * Category filter component
 */

import { useGameStore } from '@platform/store/gameStore'

const CATEGORIES = [
  { id: 'all', label: 'All Games', emoji: '🎮' },
  { id: 'arcade', label: 'Arcade', emoji: '👾' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { id: 'strategy', label: 'Strategy', emoji: '♟️' },
  { id: 'racing', label: 'Racing', emoji: '🏎️' },
]

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory } = useGameStore()

  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-game-card text-gray-300 hover:bg-game-hover'
          }`}
        >
          <span className="mr-2">{category.emoji}</span>
          {category.label}
        </button>
      ))}
    </div>
  )
}
