/**
 * Tetris game configuration
 */

import type { TetrominoType } from './types'

export const TETRIS_CONFIG = {
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
  CELL_SIZE: 30,
  PREVIEW_SIZE: 25,
  INITIAL_DROP_INTERVAL: 1000, // ms
  MIN_DROP_INTERVAL: 100, // ms (max speed)
  LEVEL_SPEED_MULTIPLIER: 0.9, // Speed increase per level
  LINES_PER_LEVEL: 10,
  FPS: 60,
} as const

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
}

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
}

export const COLORS = {
  GRID_BG: '#000000',
  GRID_BORDER: '#333333',
  CELL_EMPTY: '#1a1a1a',
  CELL_BORDER: '#2a2a2a',
  GHOST: 'rgba(255, 255, 255, 0.1)',
  UI_BG: '#1e293b',
  TEXT: '#ffffff',
}

export const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
}

// 7-bag randomizer for fair piece distribution
export const TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
