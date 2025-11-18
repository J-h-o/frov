/**
 * Game state management with Firebase integration
 * Manages game data, reviews, and leaderboards
 * Falls back to localStorage when Firebase is not configured
 */

import { create } from 'zustand'
import type { Game, Review, Leaderboard } from '@shared/types'
import { GAMES } from '@platform/services/gamesData'
import { storage, STORAGE_KEYS } from '@shared/utils/storage'
import {
  isFirebaseInitialized,
  submitScore,
  getGameLeaderboard,
  subscribeToGameLeaderboard,
  submitReview,
  getGameReviews,
  type LeaderboardEntry,
} from '@shared/services/firebase'

interface GameState {
  games: Game[]
  reviews: Review[]
  leaderboards: Map<string, Leaderboard>
  searchQuery: string
  selectedCategory: string | null
  useFirebase: boolean

  // Search & Filter
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void

  // Game methods
  getGameById: (id: string) => Game | undefined
  updateGamePlays: (gameId: string) => void

  // Review methods
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>
  getReviewsForGame: (gameId: string) => Review[]
  loadReviews: (gameId: string) => Promise<void>

  // Leaderboard methods
  getLeaderboard: (gameId: string) => Leaderboard | undefined
  addScore: (gameId: string, userId: string, username: string, avatar: string, score: number) => Promise<void>
  loadLeaderboard: (gameId: string) => Promise<void>
  subscribeToLeaderboard: (gameId: string) => () => void
}

// Helper to convert Firebase leaderboard entry to app format
const convertLeaderboardEntry = (entry: LeaderboardEntry, index: number) => ({
  rank: index + 1,
  userId: entry.userId,
  username: entry.username,
  avatar: entry.avatar,
  score: entry.score,
  playedAt: entry.timestamp.toDate().toISOString(),
})

export const useGameStore = create<GameState>((set, get) => ({
  games: GAMES,
  reviews: storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [],
  leaderboards: new Map(),
  searchQuery: '',
  selectedCategory: null,
  useFirebase: isFirebaseInitialized(),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),

  getGameById: (id: string) => {
    return get().games.find(game => game.id === id)
  },

  updateGamePlays: (gameId: string) => {
    const games = get().games.map(g =>
      g.id === gameId ? { ...g, totalPlays: g.totalPlays + 1 } : g
    )
    set({ games })
  },

  // ============================================================================
  // Review Methods
  // ============================================================================

  addReview: async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const { useFirebase } = get()

    if (useFirebase) {
      // Submit to Firestore
      try {
        await submitReview(
          review.gameId,
          review.userId,
          review.username,
          review.avatar,
          review.rating,
          review.comment
        )

        // Reload reviews for this game
        await get().loadReviews(review.gameId)
      } catch (error) {
        console.error('Error submitting review:', error)
      }
    } else {
      // Fallback to localStorage
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
    }
  },

  loadReviews: async (gameId: string) => {
    const { useFirebase } = get()

    if (useFirebase) {
      try {
        const firebaseReviews = await getGameReviews(gameId)

        // Convert Firebase reviews to app format
        const reviews = firebaseReviews.map(r => ({
          id: r.id,
          gameId: r.gameId,
          userId: r.userId,
          username: r.username,
          avatar: r.avatar,
          rating: r.rating,
          comment: r.comment,
          helpful: 0, // Not tracked in Firebase yet
          createdAt: r.createdAt.toDate().toISOString(),
        }))

        // Merge with existing reviews (keep both Firebase and localStorage reviews)
        const existingReviews = get().reviews.filter(r => r.gameId !== gameId)
        const allReviews = [...existingReviews, ...reviews]

        set({ reviews: allReviews })

        // Update game average rating
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        const games = get().games.map(g =>
          g.id === gameId ? { ...g, averageRating: avgRating } : g
        )
        set({ games })
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
    }
  },

  getReviewsForGame: (gameId: string) => {
    return get().reviews.filter(r => r.gameId === gameId)
  },

  // ============================================================================
  // Leaderboard Methods
  // ============================================================================

  getLeaderboard: (gameId: string) => {
    return get().leaderboards.get(gameId)
  },

  addScore: async (gameId: string, userId: string, username: string, avatar: string, score: number) => {
    const { useFirebase } = get()

    if (useFirebase) {
      // Submit to Firestore
      try {
        await submitScore(gameId, userId, username, avatar, score)

        // Reload leaderboard for this game
        await get().loadLeaderboard(gameId)
      } catch (error) {
        console.error('Error submitting score:', error)
      }
    } else {
      // Fallback to localStorage
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
    }
  },

  loadLeaderboard: async (gameId: string) => {
    const { useFirebase } = get()

    if (useFirebase) {
      try {
        const entries = await getGameLeaderboard(gameId, 100)

        const leaderboard: Leaderboard = {
          gameId,
          period: 'all-time',
          entries: entries.map((entry, index) => convertLeaderboardEntry(entry, index)),
          lastUpdated: new Date().toISOString(),
        }

        const leaderboards = new Map(get().leaderboards)
        leaderboards.set(gameId, leaderboard)
        set({ leaderboards })
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      }
    }
  },

  subscribeToLeaderboard: (gameId: string) => {
    const { useFirebase } = get()

    if (!useFirebase) {
      return () => {} // No-op for localStorage mode
    }

    // Subscribe to real-time updates from Firestore
    return subscribeToGameLeaderboard(gameId, (entries) => {
      const leaderboard: Leaderboard = {
        gameId,
        period: 'all-time',
        entries: entries.map((entry, index) => convertLeaderboardEntry(entry, index)),
        lastUpdated: new Date().toISOString(),
      }

      const leaderboards = new Map(get().leaderboards)
      leaderboards.set(gameId, leaderboard)
      set({ leaderboards })
    })
  },
}))
