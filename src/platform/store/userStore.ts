/**
 * User state management using Zustand + Firebase
 * Handles authentication and user data with Firebase backend
 * Falls back to localStorage when Firebase is not configured
 */

import { create } from 'zustand'
import type { User } from '@shared/types'
import { storage, STORAGE_KEYS } from '@shared/utils/storage'
import {
  isFirebaseInitialized,
  onAuthStateChange,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInAnonymouslyAsGuest,
  signOut as firebaseSignOut,
  saveUserProfile,
  getUserStats,
  updateGameStats,
  addSavedGame,
  removeSavedGame,
  getSavedGames,
  updateLastLogin,
} from '@shared/services/firebase'

interface UserState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  useFirebase: boolean

  // Auth methods
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, username: string) => Promise<void>
  loginAnonymously: () => Promise<void>
  loginWithUsername: (username: string) => void // Fallback for localStorage
  logout: () => Promise<void>

  // User data methods
  updateStats: (gameId: string, score: number) => Promise<void>
  saveGame: (gameId: string) => Promise<void>
  unsaveGame: (gameId: string) => Promise<void>

  // Internal methods
  initializeAuth: () => void
  setUser: (user: User | null) => void
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
  isLoading: false,
  error: null,
  useFirebase: isFirebaseInitialized(),

  initializeAuth: () => {
    const useFirebase = isFirebaseInitialized()
    set({ useFirebase })

    if (useFirebase) {
      // Subscribe to Firebase auth state changes
      onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in
          const stats = await getUserStats(firebaseUser.uid)
          const savedGames = await getSavedGames(firebaseUser.uid)

          const user: User = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email || 'Anonymous',
            avatar: firebaseUser.photoURL || '🎮',
            email: firebaseUser.email || undefined,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            stats,
            savedGames,
          }

          set({ user, isLoggedIn: !firebaseUser.isAnonymous, isLoading: false })

          // Update last login
          await updateLastLogin(firebaseUser.uid)
        } else {
          // User is signed out
          set({ user: getDefaultUser(), isLoggedIn: false, isLoading: false })
        }
      })
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null })
    try {
      if (!isFirebaseInitialized()) {
        throw new Error('Firebase not initialized')
      }

      const result = await signInWithGoogle()
      const firebaseUser = result.user

      // Save user profile to Firestore
      await saveUserProfile({
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email || 'User',
        avatar: firebaseUser.photoURL || '🎮',
        email: firebaseUser.email || undefined,
        createdAt: new Date().toISOString(),
        savedGames: [],
      })

      set({ isLoading: false })
    } catch (error) {
      console.error('Google sign-in error:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      if (!isFirebaseInitialized()) {
        throw new Error('Firebase not initialized')
      }

      await signInWithEmail(email, password)
      set({ isLoading: false })
    } catch (error) {
      console.error('Email sign-in error:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  signUpWithEmail: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null })
    try {
      if (!isFirebaseInitialized()) {
        throw new Error('Firebase not initialized')
      }

      const result = await signUpWithEmail(email, password, username)
      const firebaseUser = result.user

      // Save user profile to Firestore
      await saveUserProfile({
        id: firebaseUser.uid,
        username: username || email,
        avatar: '🎮',
        email: email,
        createdAt: new Date().toISOString(),
        savedGames: [],
      })

      set({ isLoading: false })
    } catch (error) {
      console.error('Email sign-up error:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  loginAnonymously: async () => {
    set({ isLoading: true, error: null })
    try {
      if (!isFirebaseInitialized()) {
        throw new Error('Firebase not initialized')
      }

      await signInAnonymouslyAsGuest()
      set({ isLoading: false })
    } catch (error) {
      console.error('Anonymous sign-in error:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  loginWithUsername: (username: string) => {
    // Fallback method for localStorage (when Firebase not configured)
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

  logout: async () => {
    const { useFirebase } = get()

    if (useFirebase) {
      try {
        await firebaseSignOut()
      } catch (error) {
        console.error('Sign-out error:', error)
      }
    } else {
      set({ user: getDefaultUser(), isLoggedIn: false })
    }
  },

  updateStats: async (gameId: string, score: number) => {
    const { user, useFirebase } = get()
    if (!user) return

    if (useFirebase && user.id !== 'guest') {
      // Update stats in Firestore
      try {
        await updateGameStats(user.id, gameId, score)

        // Reload stats from Firestore
        const stats = await getUserStats(user.id)
        set({ user: { ...user, stats } })
      } catch (error) {
        console.error('Error updating stats:', error)
      }
    } else {
      // Fallback to localStorage
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
    }
  },

  saveGame: async (gameId: string) => {
    const { user, useFirebase } = get()
    if (!user) return

    if (useFirebase && user.id !== 'guest') {
      // Save to Firestore
      try {
        await addSavedGame(user.id, gameId)

        // Reload saved games from Firestore
        const savedGames = await getSavedGames(user.id)
        set({ user: { ...user, savedGames } })
      } catch (error) {
        console.error('Error saving game:', error)
      }
    } else {
      // Fallback to localStorage
      if (!user.savedGames.includes(gameId)) {
        user.savedGames.push(gameId)
        storage.set(STORAGE_KEYS.USER, user)
        set({ user: { ...user } })
      }
    }
  },

  unsaveGame: async (gameId: string) => {
    const { user, useFirebase } = get()
    if (!user) return

    if (useFirebase && user.id !== 'guest') {
      // Remove from Firestore
      try {
        await removeSavedGame(user.id, gameId)

        // Reload saved games from Firestore
        const savedGames = await getSavedGames(user.id)
        set({ user: { ...user, savedGames } })
      } catch (error) {
        console.error('Error unsaving game:', error)
      }
    } else {
      // Fallback to localStorage
      user.savedGames = user.savedGames.filter(id => id !== gameId)
      storage.set(STORAGE_KEYS.USER, user)
      set({ user: { ...user } })
    }
  },

  setUser: (user: User | null) => {
    set({ user })
  },
}))
