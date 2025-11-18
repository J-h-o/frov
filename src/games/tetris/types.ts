/**
 * Tetris game types
 */

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type CellValue = TetrominoType | null

export interface Position {
  x: number
  y: number
}

export interface Tetromino {
  type: TetrominoType
  shape: number[][]
  position: Position
  color: string
}

export interface TetrisState {
  grid: CellValue[][]
  currentPiece: Tetromino | null
  nextPiece: Tetromino | null
  holdPiece: Tetromino | null
  canHold: boolean
  score: number
  level: number
  linesCleared: number
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  dropInterval: number
  lastDropTime: number
}

export interface GameStats {
  score: number
  level: number
  linesCleared: number
  tetrominoes: Record<TetrominoType, number>
}
