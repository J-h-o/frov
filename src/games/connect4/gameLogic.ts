/**
 * Connect 4 game logic
 * Pure functions for game state updates
 */

import type { Cell, Player, Position, Connect4State, Winner, WinningLine } from './types'
import { CONNECT4_CONFIG, AI_WEIGHTS } from './config'

export const createEmptyBoard = (): Cell[][] => {
  return Array.from({ length: CONNECT4_CONFIG.ROWS }, () =>
    Array.from({ length: CONNECT4_CONFIG.COLS }, () => ({
      player: null,
      isWinning: false,
    }))
  )
}

export const createInitialState = (mode: 'pvp' | 'ai' = 'ai'): Connect4State => {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'red',
    winner: null,
    isGameOver: false,
    lastMove: null,
    moves: 0,
    isPlaying: true,
    mode,
    aiThinking: false,
  }
}

export const getNextAvailableRow = (board: Cell[][], col: number): number => {
  for (let row = CONNECT4_CONFIG.ROWS - 1; row >= 0; row--) {
    if (board[row][col].player === null) {
      return row
    }
  }
  return -1 // Column is full
}

export const isValidMove = (board: Cell[][], col: number): boolean => {
  if (col < 0 || col >= CONNECT4_CONFIG.COLS) return false
  return getNextAvailableRow(board, col) !== -1
}

export const checkWinner = (board: Cell[][], lastMove: Position | null): WinningLine | null => {
  if (!lastMove) return null

  const { row, col } = lastMove
  const player = board[row][col].player
  if (!player) return null

  // Check all four directions
  const directions = [
    { dr: 0, dc: 1 }, // Horizontal
    { dr: 1, dc: 0 }, // Vertical
    { dr: 1, dc: 1 }, // Diagonal /
    { dr: 1, dc: -1 }, // Diagonal \
  ]

  for (const { dr, dc } of directions) {
    const line: Position[] = [{ row, col }]

    // Check in positive direction
    let r = row + dr
    let c = col + dc
    while (
      r >= 0 &&
      r < CONNECT4_CONFIG.ROWS &&
      c >= 0 &&
      c < CONNECT4_CONFIG.COLS &&
      board[r][c].player === player
    ) {
      line.push({ row: r, col: c })
      r += dr
      c += dc
    }

    // Check in negative direction
    r = row - dr
    c = col - dc
    while (
      r >= 0 &&
      r < CONNECT4_CONFIG.ROWS &&
      c >= 0 &&
      c < CONNECT4_CONFIG.COLS &&
      board[r][c].player === player
    ) {
      line.push({ row: r, col: c })
      r -= dr
      c -= dc
    }

    if (line.length >= CONNECT4_CONFIG.CONNECT) {
      return { positions: line, player }
    }
  }

  return null
}

export const isBoardFull = (board: Cell[][]): boolean => {
  return board[0].every(cell => cell.player !== null)
}

export const makeMove = (state: Connect4State, col: number): Connect4State => {
  if (!isValidMove(state.board, col) || state.isGameOver) {
    return state
  }

  const row = getNextAvailableRow(state.board, col)
  const newBoard = state.board.map(r => r.map(cell => ({ ...cell, isWinning: false })))

  newBoard[row][col] = {
    player: state.currentPlayer,
    isWinning: false,
  }

  const lastMove = { row, col }
  const winningLine = checkWinner(newBoard, lastMove)

  let winner: Winner = null
  let isGameOver = false

  if (winningLine) {
    // Mark winning cells
    winningLine.positions.forEach(pos => {
      newBoard[pos.row][pos.col].isWinning = true
    })
    winner = winningLine.player
    isGameOver = true
  } else if (isBoardFull(newBoard)) {
    winner = 'draw'
    isGameOver = true
  }

  return {
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === 'red' ? 'yellow' : 'red',
    winner,
    isGameOver,
    lastMove,
    moves: state.moves + 1,
  }
}

// AI Logic - Minimax with Alpha-Beta Pruning
const evaluateWindow = (window: (Player)[], player: Player): number => {
  const opponent: Player = player === 'red' ? 'yellow' : 'red'
  let score = 0

  const playerCount = window.filter(p => p === player).length
  const opponentCount = window.filter(p => p === opponent).length
  const emptyCount = window.filter(p => p === null).length

  if (playerCount === 4) {
    score += AI_WEIGHTS.WIN
  } else if (playerCount === 3 && emptyCount === 1) {
    score += AI_WEIGHTS.THREE
  } else if (playerCount === 2 && emptyCount === 2) {
    score += AI_WEIGHTS.TWO
  }

  if (opponentCount === 3 && emptyCount === 1) {
    score -= AI_WEIGHTS.THREE * 1.2 // Slightly prioritize blocking
  }

  return score
}

const scorePosition = (board: Cell[][], player: Player): number => {
  let score = 0

  // Center column preference
  const centerCol = Math.floor(CONNECT4_CONFIG.COLS / 2)
  const centerCount = board.filter(row => row[centerCol].player === player).length
  score += centerCount * AI_WEIGHTS.CENTER

  // Horizontal
  for (let row = 0; row < CONNECT4_CONFIG.ROWS; row++) {
    for (let col = 0; col <= CONNECT4_CONFIG.COLS - 4; col++) {
      const window = board[row].slice(col, col + 4).map(cell => cell.player)
      score += evaluateWindow(window, player)
    }
  }

  // Vertical
  for (let col = 0; col < CONNECT4_CONFIG.COLS; col++) {
    for (let row = 0; row <= CONNECT4_CONFIG.ROWS - 4; row++) {
      const window = Array.from({ length: 4 }, (_, i) => board[row + i][col].player)
      score += evaluateWindow(window, player)
    }
  }

  // Diagonal /
  for (let row = 0; row <= CONNECT4_CONFIG.ROWS - 4; row++) {
    for (let col = 0; col <= CONNECT4_CONFIG.COLS - 4; col++) {
      const window = Array.from({ length: 4 }, (_, i) => board[row + i][col + i].player)
      score += evaluateWindow(window, player)
    }
  }

  // Diagonal \
  for (let row = 3; row < CONNECT4_CONFIG.ROWS; row++) {
    for (let col = 0; col <= CONNECT4_CONFIG.COLS - 4; col++) {
      const window = Array.from({ length: 4 }, (_, i) => board[row - i][col + i].player)
      score += evaluateWindow(window, player)
    }
  }

  return score
}

const minimax = (
  board: Cell[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player
): number => {
  const validCols = Array.from({ length: CONNECT4_CONFIG.COLS }, (_, i) => i).filter(col =>
    isValidMove(board, col)
  )

  // Terminal conditions
  const lastMoveForCheck = validCols.length > 0 ? { row: 0, col: validCols[0] } : null
  const hasWinner = lastMoveForCheck && checkWinner(board, lastMoveForCheck)

  if (depth === 0 || validCols.length === 0 || hasWinner) {
    if (hasWinner) {
      return hasWinner.player === player ? AI_WEIGHTS.WIN : -AI_WEIGHTS.WIN
    }
    return scorePosition(board, player)
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity
    for (const col of validCols) {
      const row = getNextAvailableRow(board, col)
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = { player, isWinning: false }

      const eval_ = minimax(newBoard, depth - 1, alpha, beta, false, player)
      maxEval = Math.max(maxEval, eval_)
      alpha = Math.max(alpha, eval_)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    const opponent: Player = player === 'red' ? 'yellow' : 'red'
    for (const col of validCols) {
      const row = getNextAvailableRow(board, col)
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = { player: opponent, isWinning: false }

      const eval_ = minimax(newBoard, depth - 1, alpha, beta, true, player)
      minEval = Math.min(minEval, eval_)
      beta = Math.min(beta, eval_)
      if (beta <= alpha) break
    }
    return minEval
  }
}

export const getBestMove = (board: Cell[][], player: Player): number => {
  const validCols = Array.from({ length: CONNECT4_CONFIG.COLS }, (_, i) => i).filter(col =>
    isValidMove(board, col)
  )

  if (validCols.length === 0) return -1

  let bestScore = -Infinity
  let bestCol = validCols[Math.floor(Math.random() * validCols.length)]

  for (const col of validCols) {
    const row = getNextAvailableRow(board, col)
    const newBoard = board.map(r => r.map(cell => ({ ...cell })))
    newBoard[row][col] = { player, isWinning: false }

    const score = minimax(newBoard, CONNECT4_CONFIG.AI_DEPTH - 1, -Infinity, Infinity, false, player)

    if (score > bestScore) {
      bestScore = score
      bestCol = col
    }
  }

  return bestCol
}
