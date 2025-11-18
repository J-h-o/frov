// User types
export interface User {
  id: string
  username: string
  avatar: string
  createdAt: string
  stats: GameStats[]
  savedGames: string[]
}

export interface GameStats {
  gameId: string
  totalPlays: number
  highScore: number
  lastPlayed: string
  achievements: string[]
}

// Game types
export interface Game {
  id: string
  name: string
  description: string
  thumbnail: string
  category: GameCategory
  difficulty: GameDifficulty
  totalPlays: number
  averageRating: number
  featured: boolean
  releaseDate: string
}

export type GameCategory = 'arcade' | 'puzzle' | 'strategy' | 'sports' | 'racing'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

// Review types
export interface Review {
  id: string
  userId: string
  username: string
  gameId: string
  rating: number
  comment: string
  helpful: number
  createdAt: string
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  score: number
  playedAt: string
}

export interface Leaderboard {
  gameId: string
  period: LeaderboardPeriod
  entries: LeaderboardEntry[]
  lastUpdated: string
}

export type LeaderboardPeriod = 'all-time' | 'monthly' | 'weekly'

// Activity types
export interface Activity {
  id: string
  userId: string
  type: ActivityType
  gameId?: string
  gameName?: string
  description: string
  timestamp: string
}

export type ActivityType = 'game-played' | 'high-score' | 'achievement' | 'review-posted' | 'game-saved'

// Game engine types
export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  score: number
  level: number
}

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

// Canvas types
export interface CanvasContext {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
}
