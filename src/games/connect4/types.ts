/**
 * Connect 4 game types
 */

export type Player = 'red' | 'yellow' | null
export type Winner = Player | 'draw'

export interface Cell {
  player: Player
  isWinning: boolean
}

export interface Position {
  row: number
  col: number
}

export interface Connect4State {
  board: Cell[][]
  currentPlayer: Player
  winner: Winner
  isGameOver: boolean
  lastMove: Position | null
  moves: number
  isPlaying: boolean
  mode: 'pvp' | 'ai'
  aiThinking: boolean
}

export interface WinningLine {
  positions: Position[]
  player: Player
}
