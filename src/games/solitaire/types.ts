/**
 * Solitaire (Klondike) types
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type Color = 'red' | 'black'

export interface Card {
  suit: Suit
  rank: Rank
  color: Color
  faceUp: boolean
  id: string
}

export interface SolitaireState {
  tableau: Card[][] // 7 piles
  foundation: Card[][] // 4 piles (Ace to King)
  stock: Card[] // Draw pile
  waste: Card[] // Drawn cards
  moves: number
  score: number
  isWon: boolean
  selectedCard: { pile: string; index: number } | null
}

export type PileType = 'tableau' | 'foundation' | 'stock' | 'waste'
