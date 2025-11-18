/**
 * Game state management
 * Manages game data, reviews, and leaderboards
 */

import { create } from 'zustand'
import type { Game, Review, Leaderboard } from '@shared/types'
import { GAMES } from '@platform/services/gamesData'
import { storage, STORAGE_KEYS } from '@shared/utils/storage'

interface GameState {
  games: Game[]
  reviews: Review[]
  leaderboards: Map<string, Leaderboard>
  searchQuery: string
  selectedCategory: string | null
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  getGameById: (id: string) => Game | undefined
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  getReviewsForGame: (gameId: string) => Review[]
  updateGamePlays: (gameId: string) => void
  getLeaderboard: (gameId: string) => Leaderboard | undefined
  addScore: (gameId: string, userId: string, username: string, avatar: string, score: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  games: GAMES,
  reviews: storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [],
  leaderboards: new Map(),
  searchQuery: '',
  selectedCategory: null,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),

  getGameById: (id: string) => {
    return get().games.find(game => game.id === id)
  },

  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      helpful: 0,
      createdAt: new Date().toISOString(),
    }

    const reviews = [...get().reviews, newReview]
    storage.set(STORAGE_KEYS.REVIEWS, reviews)
    set({ reviews })

    // Update game average rating
    const gameReviews = reviews.filter(r => r.gameId === review.gameId)
    const avgRating = gameReviews.reduce((sum, r) => sum + r.rating, 0) / gameReviews.length

    const games = get().games.map(g =>
      g.id === review.gameId ? { ...g, averageRating: avgRating } : g
    )
    set({ games })
  },

  getReviewsForGame: (gameId: string) => {
    return get().reviews.filter(r => r.gameId === gameId)
  },

  updateGamePlays: (gameId: string) => {
    const games = get().games.map(g =>
      g.id === gameId ? { ...g, totalPlays: g.totalPlays + 1 } : g
    )
    set({ games })
  },

  getLeaderboard: (gameId: string) => {
    return get().leaderboards.get(gameId)
  },

  addScore: (gameId: string, userId: string, username: string, avatar: string, score: number) => {
    const leaderboards = new Map(get().leaderboards)
    const existing = leaderboards.get(gameId)

    if (existing) {
      const entries = [...existing.entries]
      const userEntryIndex = entries.findIndex(e => e.userId === userId)

      if (userEntryIndex >= 0) {
        if (score > entries[userEntryIndex].score) {
          entries[userEntryIndex] = {
            ...entries[userEntryIndex],
            score,
            playedAt: new Date().toISOString(),
          }
        }
      } else {
        entries.push({
          rank: 0,
          userId,
          username,
          avatar,
          score,
          playedAt: new Date().toISOString(),
        })
      }

      // Sort by score and update ranks
      entries.sort((a, b) => b.score - a.score)
      entries.forEach((entry, index) => {
        entry.rank = index + 1
      })

      leaderboards.set(gameId, {
        ...existing,
        entries: entries.slice(0, 100), // Keep top 100
        lastUpdated: new Date().toISOString(),
      })
    } else {
      leaderboards.set(gameId, {
        gameId,
        period: 'all-time',
        entries: [
          {
            rank: 1,
            userId,
            username,
            avatar,
            score,
            playedAt: new Date().toISOString(),
          },
        ],
        lastUpdated: new Date().toISOString(),
      })
    }

    set({ leaderboards })
    storage.set(STORAGE_KEYS.LEADERBOARDS, Array.from(leaderboards.entries()))
  },
}))
