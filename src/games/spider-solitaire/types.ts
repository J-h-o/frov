/**
 * Spider Solitaire game types
 */

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
  id: string
}

export interface SpiderSolitaireState {
  tableau: Card[][] // 10 piles
  stock: Card[] // Remaining cards to deal
  completed: Card[][] // Completed sequences (K to A)
  selectedCards: { pileIndex: number; cardIndex: number } | null
  isGameOver: boolean
  isWon: boolean
  moves: number
  score: number
  undoStack: SpiderSolitaireState[]
}
