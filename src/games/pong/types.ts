/**
 * Pong game types
 */

import type { Position, Velocity, Size } from '@shared/types'

export interface Paddle {
  position: Position
  size: Size
  velocity: Velocity
  speed: number
}

export interface Ball {
  position: Position
  size: Size
  velocity: Velocity
  speed: number
}

export interface PongState {
  playerPaddle: Paddle
  aiPaddle: Paddle
  ball: Ball
  playerScore: number
  aiScore: number
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  winner: 'player' | 'ai' | null
}
