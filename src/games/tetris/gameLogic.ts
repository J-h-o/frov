/**
 * Tetris game logic
 * Pure functions for game state updates
 */

import type { TetrisState, Tetromino, CellValue, Position, TetrominoType } from './types'
import { TETRIS_CONFIG, TETROMINO_SHAPES, TETROMINO_COLORS, TETROMINO_TYPES, SCORING } from './config'

let piecesBag: TetrominoType[] = []

// 7-bag randomizer for fair piece distribution
const getRandomPiece = (): TetrominoType => {
  if (piecesBag.length === 0) {
    piecesBag = [...TETROMINO_TYPES].sort(() => Math.random() - 0.5)
  }
  return piecesBag.pop()!
}

export const createTetromino = (type?: TetrominoType): Tetromino => {
  const tetrominoType = type || getRandomPiece()
  return {
    type: tetrominoType,
    shape: TETROMINO_SHAPES[tetrominoType],
    position: {
      x: Math.floor(TETRIS_CONFIG.GRID_WIDTH / 2) - 1,
      y: 0,
    },
    color: TETROMINO_COLORS[tetrominoType],
  }
}

export const createEmptyGrid = (): CellValue[][] => {
  return Array.from({ length: TETRIS_CONFIG.GRID_HEIGHT }, () =>
    Array.from({ length: TETRIS_CONFIG.GRID_WIDTH }, () => null)
  )
}

export const createInitialState = (): TetrisState => {
  return {
    grid: createEmptyGrid(),
    currentPiece: createTetromino(),
    nextPiece: createTetromino(),
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 1,
    linesCleared: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    dropInterval: TETRIS_CONFIG.INITIAL_DROP_INTERVAL,
    lastDropTime: 0,
  }
}

export const checkCollision = (
  grid: CellValue[][],
  piece: Tetromino,
  offsetX: number = 0,
  offsetY: number = 0
): boolean => {
  const { shape, position } = piece
  const newX = position.x + offsetX
  const newY = position.y + offsetY

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const gridX = newX + col
        const gridY = newY + row

        // Check boundaries
        if (
          gridX < 0 ||
          gridX >= TETRIS_CONFIG.GRID_WIDTH ||
          gridY >= TETRIS_CONFIG.GRID_HEIGHT
        ) {
          return true
        }

        // Check collision with existing pieces (only if gridY >= 0)
        if (gridY >= 0 && grid[gridY][gridX]) {
          return true
        }
      }
    }
  }

  return false
}

export const rotatePiece = (piece: Tetromino): Tetromino => {
  // Don't rotate O piece
  if (piece.type === 'O') return piece

  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  )

  return {
    ...piece,
    shape: newShape,
  }
}

export const movePiece = (
  state: TetrisState,
  direction: 'left' | 'right' | 'down'
): TetrisState => {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state

  const offsets = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
  }

  const { x, y } = offsets[direction]

  if (!checkCollision(state.grid, state.currentPiece, x, y)) {
    return {
      ...state,
      currentPiece: {
        ...state.currentPiece,
        position: {
          x: state.currentPiece.position.x + x,
          y: state.currentPiece.position.y + y,
        },
      },
      score: direction === 'down' ? state.score + SCORING.SOFT_DROP : state.score,
    }
  }

  // If moving down and collision, lock the piece
  if (direction === 'down') {
    return lockPiece(state)
  }

  return state
}

export const rotate = (state: TetrisState): TetrisState => {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state

  const rotated = rotatePiece(state.currentPiece)

  // Try basic rotation
  if (!checkCollision(state.grid, rotated)) {
    return {
      ...state,
      currentPiece: rotated,
    }
  }

  // Wall kick: try shifting left/right
  const kicks = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -2, y: 0 },
  ]

  for (const kick of kicks) {
    const kickedPiece = {
      ...rotated,
      position: {
        x: rotated.position.x + kick.x,
        y: rotated.position.y + kick.y,
      },
    }

    if (!checkCollision(state.grid, kickedPiece)) {
      return {
        ...state,
        currentPiece: kickedPiece,
      }
    }
  }

  return state
}

export const hardDrop = (state: TetrisState): TetrisState => {
  if (!state.currentPiece || state.isGameOver || state.isPaused) return state

  let dropDistance = 0
  let newState = { ...state }

  while (!checkCollision(newState.grid, newState.currentPiece!, 0, 1)) {
    newState = movePiece(newState, 'down')
    dropDistance++
  }

  return {
    ...lockPiece(newState),
    score: newState.score + dropDistance * SCORING.HARD_DROP,
  }
}

export const getGhostPosition = (state: TetrisState): Position | null => {
  if (!state.currentPiece) return null

  let ghostY = state.currentPiece.position.y
  const ghostPiece = { ...state.currentPiece }

  while (!checkCollision(state.grid, { ...ghostPiece, position: { ...ghostPiece.position, y: ghostY + 1 } }, 0, 0)) {
    ghostY++
  }

  return { x: state.currentPiece.position.x, y: ghostY }
}

export const clearLines = (grid: CellValue[][]): { newGrid: CellValue[][], linesCleared: number } => {
  const fullRows: number[] = []

  // Find full rows
  grid.forEach((row, index) => {
    if (row.every(cell => cell !== null)) {
      fullRows.push(index)
    }
  })

  if (fullRows.length === 0) {
    return { newGrid: grid, linesCleared: 0 }
  }

  // Remove full rows and add empty rows at top
  const newGrid = grid.filter((_, index) => !fullRows.includes(index))
  const emptyRows = Array.from({ length: fullRows.length }, () =>
    Array.from({ length: TETRIS_CONFIG.GRID_WIDTH }, () => null)
  )

  return {
    newGrid: [...emptyRows, ...newGrid],
    linesCleared: fullRows.length,
  }
}

export const lockPiece = (state: TetrisState): TetrisState => {
  if (!state.currentPiece) return state

  const newGrid = state.grid.map(row => [...row])
  const { shape, position, type } = state.currentPiece

  // Add piece to grid
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const gridY = position.y + rowIndex
        const gridX = position.x + colIndex
        if (gridY >= 0 && gridY < TETRIS_CONFIG.GRID_HEIGHT) {
          newGrid[gridY][gridX] = type
        }
      }
    })
  })

  // Clear completed lines
  const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid)

  // Calculate score
  const lineScore = [0, SCORING.SINGLE, SCORING.DOUBLE, SCORING.TRIPLE, SCORING.TETRIS][linesCleared] || 0
  const newScore = state.score + lineScore * state.level
  const newLinesCleared = state.linesCleared + linesCleared

  // Level up
  const newLevel = Math.floor(newLinesCleared / TETRIS_CONFIG.LINES_PER_LEVEL) + 1
  const newDropInterval = Math.max(
    TETRIS_CONFIG.MIN_DROP_INTERVAL,
    TETRIS_CONFIG.INITIAL_DROP_INTERVAL * Math.pow(TETRIS_CONFIG.LEVEL_SPEED_MULTIPLIER, newLevel - 1)
  )

  // Spawn next piece
  const newCurrentPiece = state.nextPiece
  const newNextPiece = createTetromino()

  // Check game over
  const isGameOver = newCurrentPiece ? checkCollision(clearedGrid, newCurrentPiece) : true

  return {
    ...state,
    grid: clearedGrid,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    canHold: true,
    score: newScore,
    level: newLevel,
    linesCleared: newLinesCleared,
    dropInterval: newDropInterval,
    isGameOver,
    isPlaying: !isGameOver,
  }
}

export const holdPiece = (state: TetrisState): TetrisState => {
  if (!state.currentPiece || !state.canHold || state.isGameOver || state.isPaused) {
    return state
  }

  const newHoldPiece = createTetromino(state.currentPiece.type)
  const newCurrentPiece = state.holdPiece
    ? { ...state.holdPiece, position: { x: Math.floor(TETRIS_CONFIG.GRID_WIDTH / 2) - 1, y: 0 } }
    : state.nextPiece

  const newNextPiece = state.holdPiece ? state.nextPiece : createTetromino()

  return {
    ...state,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    holdPiece: newHoldPiece,
    canHold: false,
  }
}
