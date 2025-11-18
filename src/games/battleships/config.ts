/**
 * Battleships configuration
 */

export const BATTLESHIPS_CONFIG = {
  GRID_SIZE: 10,
  CELL_SIZE: 40,
} as const

export const SHIPS = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
] as const

export const COLORS = {
  WATER: '#0c4a6e',
  SHIP: '#64748b',
  HIT: '#dc2626',
  MISS: '#cbd5e1',
  SUNK: '#7f1d1d',
  GRID: '#334155',
  HOVER: 'rgba(255, 255, 255, 0.2)',
  SELECTED: '#fbbf24',
} as const
