/**
 * Battleships game types
 */

export type CellState = 'empty' | 'ship' | 'hit' | 'miss'
export type Orientation = 'horizontal' | 'vertical'
export type GamePhase = 'placement' | 'battle' | 'gameover'

export interface Position {
  row: number
  col: number
}

export interface Ship {
  name: string
  length: number
  positions: Position[]
  hits: number
  sunk: boolean
}

export interface Cell {
  state: CellState
  shipId?: string
}

export interface BattleshipsState {
  playerBoard: Cell[][]
  aiBoard: Cell[][]
  playerShips: Ship[]
  aiShips: Ship[]
  phase: GamePhase
  currentTurn: 'player' | 'ai'
  selectedShip: number | null
  shipOrientation: Orientation
  winner: 'player' | 'ai' | null
  moves: number
  lastShot: Position | null
}
