/**
 * Pong game configuration
 * Centralized game constants following KISS principle
 */

export const PONG_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PADDLE_WIDTH: 10,
  PADDLE_HEIGHT: 100,
  PADDLE_SPEED: 6,
  BALL_SIZE: 10,
  BALL_INITIAL_SPEED: 5,
  BALL_SPEED_INCREASE: 0.3,
  MAX_SCORE: 11,
  AI_DIFFICULTY: 0.7, // 0-1, higher is harder
  PADDLE_OFFSET: 20,
  FPS: 60,
} as const

export const COLORS = {
  BACKGROUND: '#0f172a',
  PADDLE: '#0ea5e9',
  BALL: '#ffffff',
  TEXT: '#ffffff',
  CENTER_LINE: '#334155',
} as const
