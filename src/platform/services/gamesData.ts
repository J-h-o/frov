/**
 * Game metadata and configuration
 * Central source of truth for all games in the platform
 */

import type { Game } from '@shared/types'

export const GAMES: Game[] = [
  {
    id: 'pong',
    name: 'Pong',
    description: 'Classic two-paddle ball game. Beat your opponent by scoring 11 points first!',
    thumbnail: '/games/pong.png',
    category: 'arcade',
    difficulty: 'easy',
    totalPlays: 0,
    averageRating: 0,
    featured: true,
    releaseDate: '2025-11-18',
  },
  {
    id: 'connect4',
    name: 'Connect 4',
    description: 'Strategic two-player game. Connect four discs in a row to win!',
    thumbnail: '/games/connect4.png',
    category: 'strategy',
    difficulty: 'easy',
    totalPlays: 0,
    averageRating: 0,
    featured: false,
    releaseDate: '2025-11-18',
  },
  {
    id: 'battleships',
    name: 'Battleships',
    description: 'Naval combat strategy game. Find and sink all enemy ships!',
    thumbnail: '/games/battleships.png',
    category: 'strategy',
    difficulty: 'medium',
    totalPlays: 0,
    averageRating: 0,
    featured: false,
    releaseDate: '2025-11-18',
  },
  {
    id: 'solitaire',
    name: 'Solitaire',
    description: 'Classic Klondike solitaire. Stack cards in alternating colors!',
    thumbnail: '/games/solitaire.png',
    category: 'puzzle',
    difficulty: 'easy',
    totalPlays: 0,
    averageRating: 0,
    featured: false,
    releaseDate: '2025-11-18',
  },
  {
    id: 'spider-solitaire',
    name: 'Spider Solitaire',
    description: 'Advanced solitaire variant. Clear all cards by building sequences!',
    thumbnail: '/games/spider-solitaire.png',
    category: 'puzzle',
    difficulty: 'hard',
    totalPlays: 0,
    averageRating: 0,
    featured: false,
    releaseDate: '2025-11-18',
  },
  {
    id: 'hill-climb-racing',
    name: 'Hill Climb Racing',
    description: 'Physics-based driving game. Conquer hills without flipping!',
    thumbnail: '/games/hill-climb-racing.png',
    category: 'racing',
    difficulty: 'medium',
    totalPlays: 0,
    averageRating: 0,
    featured: true,
    releaseDate: '2025-11-18',
  },
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Classic block-stacking puzzle. Clear lines to score points!',
    thumbnail: '/games/tetris.png',
    category: 'puzzle',
    difficulty: 'medium',
    totalPlays: 0,
    averageRating: 0,
    featured: true,
    releaseDate: '2025-11-18',
  },
]

export const getGameById = (id: string): Game | undefined => {
  return GAMES.find(game => game.id === id)
}

export const getFeaturedGames = (): Game[] => {
  return GAMES.filter(game => game.featured)
}

export const getGamesByCategory = (category: string): Game[] => {
  return GAMES.filter(game => game.category === category)
}
