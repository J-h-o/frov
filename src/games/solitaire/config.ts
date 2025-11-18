/**
 * Solitaire configuration
 */

import type { Suit, Rank } from './types'

export const SOLITAIRE_CONFIG = {
  CARD_WIDTH: 70,
  CARD_HEIGHT: 100,
  CARD_SPACING: 25,
  PILE_SPACING: 15,
  DRAW_COUNT: 3, // Draw 3 cards at a time
} as const

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
} as const

export const SUIT_COLORS = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
} as const

export const RANK_VALUES = {
  A: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
} as const

export const COLORS = {
  CARD_BACK: '#0369a1',
  CARD_FRONT: '#ffffff',
  CARD_BORDER: '#334155',
  RED_SUIT: '#dc2626',
  BLACK_SUIT: '#000000',
  EMPTY_PILE: '#1e293b',
  SELECTED: '#fbbf24',
  TABLE_BG: '#047857',
} as const
