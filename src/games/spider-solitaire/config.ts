/**
 * Spider Solitaire configuration
 */

import type { Rank, Suit } from './types'

export const SPIDER_CONFIG = {
  TABLEAU_PILES: 10,
  SUITS_IN_PLAY: 1, // POC: 1 suit mode (easiest)
  DECKS: 2, // 104 cards total
  CARDS_PER_DEAL: 10, // Deal one card to each pile
  INITIAL_LAYOUT: [6, 6, 6, 6, 5, 5, 5, 5, 5, 5], // Cards per pile at start
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const RANK_VALUES: Record<Rank, number> = {
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
}

export const COLORS = {
  SPADES: '#2c3e50',
  HEARTS: '#e74c3c',
  DIAMONDS: '#e74c3c',
  CLUBS: '#2c3e50',
  CARD_BG: '#ffffff',
  CARD_BACK: '#3498db',
  TABLE_GREEN: '#2d5a3d',
  SELECTED: '#f39c12',
  COMPLETE_SEQUENCE: '#27ae60',
}

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

export const SCORING = {
  COMPLETE_SEQUENCE: 100,
  MOVE_PENALTY: -1,
}
