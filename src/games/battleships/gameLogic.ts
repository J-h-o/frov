/**
 * Battleships game logic
 */

import type { Cell, Ship, BattleshipsState, Position, Orientation } from './types'
import { BATTLESHIPS_CONFIG, SHIPS } from './config'

export const createEmptyBoard = (): Cell[][] => {
  return Array.from({ length: BATTLESHIPS_CONFIG.GRID_SIZE }, () =>
    Array.from({ length: BATTLESHIPS_CONFIG.GRID_SIZE }, () => ({ state: 'empty' }))
  )
}

export const createInitialState = (): BattleshipsState => {
  const aiShips = createShipList()
  const aiBoard = createEmptyBoard()
  placeShipsRandomly(aiBoard, aiShips)

  return {
    playerBoard: createEmptyBoard(),
    aiBoard,
    playerShips: createShipList(),
    aiShips,
    phase: 'placement',
    currentTurn: 'player',
    selectedShip: 0,
    shipOrientation: 'horizontal',
    winner: null,
    moves: 0,
    lastShot: null,
  }
}

const createShipList = (): Ship[] => {
  return SHIPS.map(ship => ({
    ...ship,
    positions: [],
    hits: 0,
    sunk: false,
  }))
}

export const canPlaceShip = (
  board: Cell[][],
  ship: Ship,
  row: number,
  col: number,
  orientation: Orientation
): boolean => {
  for (let i = 0; i < ship.length; i++) {
    const r = orientation === 'horizontal' ? row : row + i
    const c = orientation === 'horizontal' ? col + i : col

    if (r < 0 || r >= BATTLESHIPS_CONFIG.GRID_SIZE || c < 0 || c >= BATTLESHIPS_CONFIG.GRID_SIZE) {
      return false
    }

    if (board[r][c].state === 'ship') {
      return false
    }
  }

  return true
}

export const placeShip = (
  state: BattleshipsState,
  shipIndex: number,
  row: number,
  col: number
): BattleshipsState | null => {
  const ship = state.playerShips[shipIndex]
  if (!canPlaceShip(state.playerBoard, ship, row, col, state.shipOrientation)) {
    return null
  }

  const newBoard = state.playerBoard.map(r => r.map(c => ({ ...c })))
  const positions: Position[] = []

  for (let i = 0; i < ship.length; i++) {
    const r = state.shipOrientation === 'horizontal' ? row : row + i
    const c = state.shipOrientation === 'horizontal' ? col + i : col
    newBoard[r][c] = { state: 'ship', shipId: ship.name }
    positions.push({ row: r, col: c })
  }

  const newShips = [...state.playerShips]
  newShips[shipIndex] = { ...ship, positions }

  const allPlaced = newShips.every(s => s.positions.length > 0)

  return {
    ...state,
    playerBoard: newBoard,
    playerShips: newShips,
    selectedShip: allPlaced ? null : shipIndex + 1,
    phase: allPlaced ? 'battle' : 'placement',
  }
}

const placeShipsRandomly = (board: Cell[][], ships: Ship[]) => {
  ships.forEach(ship => {
    let placed = false
    while (!placed) {
      const orientation: Orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'
      const row = Math.floor(Math.random() * BATTLESHIPS_CONFIG.GRID_SIZE)
      const col = Math.floor(Math.random() * BATTLESHIPS_CONFIG.GRID_SIZE)

      if (canPlaceShip(board, ship, row, col, orientation)) {
        const positions: Position[] = []
        for (let i = 0; i < ship.length; i++) {
          const r = orientation === 'horizontal' ? row : row + i
          const c = orientation === 'horizontal' ? col + i : col
          board[r][c] = { state: 'ship', shipId: ship.name }
          positions.push({ row: r, col: c })
        }
        ship.positions = positions
        placed = true
      }
    }
  })
}

export const shoot = (
  state: BattleshipsState,
  row: number,
  col: number
): BattleshipsState | null => {
  if (state.phase !== 'battle' || state.currentTurn !== 'player') return null

  const cell = state.aiBoard[row][col]
  if (cell.state === 'hit' || cell.state === 'miss') return null

  const newBoard = state.aiBoard.map(r => r.map(c => ({ ...c })))
  const isHit = cell.state === 'ship'

  newBoard[row][col] = { ...cell, state: isHit ? 'hit' : 'miss' }

  let newShips = [...state.aiShips]
  if (isHit && cell.shipId) {
    newShips = newShips.map(ship => {
      if (ship.name === cell.shipId) {
        const newHits = ship.hits + 1
        return { ...ship, hits: newHits, sunk: newHits === ship.length }
      }
      return ship
    })
  }

  const allSunk = newShips.every(s => s.sunk)

  return {
    ...state,
    aiBoard: newBoard,
    aiShips: newShips,
    currentTurn: 'ai',
    moves: state.moves + 1,
    lastShot: { row, col },
    phase: allSunk ? 'gameover' : 'battle',
    winner: allSunk ? 'player' : null,
  }
}

export const aiShoot = (state: BattleshipsState): BattleshipsState => {
  // Simple random AI
  let row, col
  do {
    row = Math.floor(Math.random() * BATTLESHIPS_CONFIG.GRID_SIZE)
    col = Math.floor(Math.random() * BATTLESHIPS_CONFIG.GRID_SIZE)
  } while (
    state.playerBoard[row][col].state === 'hit' ||
    state.playerBoard[row][col].state === 'miss'
  )

  const cell = state.playerBoard[row][col]
  const newBoard = state.playerBoard.map(r => r.map(c => ({ ...c })))
  const isHit = cell.state === 'ship'

  newBoard[row][col] = { ...cell, state: isHit ? 'hit' : 'miss' }

  let newShips = [...state.playerShips]
  if (isHit && cell.shipId) {
    newShips = newShips.map(ship => {
      if (ship.name === cell.shipId) {
        const newHits = ship.hits + 1
        return { ...ship, hits: newHits, sunk: newHits === ship.length }
      }
      return ship
    })
  }

  const allSunk = newShips.every(s => s.sunk)

  return {
    ...state,
    playerBoard: newBoard,
    playerShips: newShips,
    currentTurn: 'player',
    phase: allSunk ? 'gameover' : 'battle',
    winner: allSunk ? 'ai' : null,
  }
}
