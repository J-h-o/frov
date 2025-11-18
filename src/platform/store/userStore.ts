/**
 * User state management using Zustand
 * Lightweight and simple state management following KISS principle
 */

import { create } from 'zustand'
import type { User } from '@shared/types'
import { storage, STORAGE_KEYS } from '@shared/utils/storage'

interface UserState {
  user: User | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
  updateStats: (gameId: string, score: number) => void
  saveGame: (gameId: string) => void
  unsaveGame: (gameId: string) => void
}

// Initialize with default guest user
const getDefaultUser = (): User => {
  const stored = storage.get<User>(STORAGE_KEYS.USER)
  if (stored) return stored

  return {
    id: 'guest',
    username: 'Guest Player',
    avatar: '🎮',
    createdAt: new Date().toISOString(),
    stats: [],
    savedGames: [],
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  user: getDefaultUser(),
  isLoggedIn: false,

  login: (username: string) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatar: '🎮',
      createdAt: new Date().toISOString(),
      stats: [],
      savedGames: [],
    }
    storage.set(STORAGE_KEYS.USER, user)
    set({ user, isLoggedIn: true })
  },

  logout: () => {
    set({ user: getDefaultUser(), isLoggedIn: false })
  },

  updateStats: (gameId: string, score: number) => {
    const { user } = get()
    if (!user) return

    const existingStatIndex = user.stats.findIndex(s => s.gameId === gameId)

    if (existingStatIndex >= 0) {
      const existingStat = user.stats[existingStatIndex]
      user.stats[existingStatIndex] = {
        ...existingStat,
        totalPlays: existingStat.totalPlays + 1,
        highScore: Math.max(existingStat.highScore, score),
        lastPlayed: new Date().toISOString(),
      }
    } else {
      user.stats.push({
        gameId,
        totalPlays: 1,
        highScore: score,
        lastPlayed: new Date().toISOString(),
        achievements: [],
      })
    }

    storage.set(STORAGE_KEYS.USER, user)
    set({ user: { ...user } })
  },

  saveGame: (gameId: string) => {
    const { user } = get()
    if (!user) return

    if (!user.savedGames.includes(gameId)) {
      user.savedGames.push(gameId)
      storage.set(STORAGE_KEYS.USER, user)
      set({ user: { ...user } })
    }
  },

  unsaveGame: (gameId: string) => {
    const { user } = get()
    if (!user) return

    user.savedGames = user.savedGames.filter(id => id !== gameId)
    storage.set(STORAGE_KEYS.USER, user)
    set({ user: { ...user } })
  },
}))
