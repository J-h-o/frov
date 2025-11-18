/**
 * Local storage utilities for managing game data
 * Following KISS principle - simple key-value storage with type safety
 */

const STORAGE_KEYS = {
  USER: 'frov_user',
  GAMES: 'frov_games',
  REVIEWS: 'frov_reviews',
  LEADERBOARDS: 'frov_leaderboards',
  ACTIVITIES: 'frov_activities',
} as const

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error)
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing storage', error)
    }
  },
}

export { STORAGE_KEYS }
