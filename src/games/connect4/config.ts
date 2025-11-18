/**
 * Connect 4 game configuration
 */

export const CONNECT4_CONFIG = {
  ROWS: 6,
  COLS: 7,
  CONNECT: 4, // Number of pieces in a row to win
  CELL_SIZE: 80,
  CELL_PADDING: 10,
  PIECE_RADIUS: 30,
  ANIMATION_DURATION: 300, // ms for piece drop animation
  AI_THINK_TIME: 500, // ms delay to make AI feel natural
  AI_DEPTH: 4, // Minimax depth (higher = smarter but slower)
} as const

export const COLORS = {
  BOARD: '#1e40af',
  CELL_EMPTY: '#dbeafe',
  RED_PIECE: '#dc2626',
  YELLOW_PIECE: '#fbbf24',
  WINNING_GLOW: '#10b981',
  HOVER: 'rgba(255, 255, 255, 0.1)',
} as const

// Score weights for AI
export const AI_WEIGHTS = {
  WIN: 1000000,
  THREE: 100,
  TWO: 10,
  CENTER: 3, // Prefer center column
}
