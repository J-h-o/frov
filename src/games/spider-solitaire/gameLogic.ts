/**
 * Spider Solitaire game logic
 * Pure functions for game state management
 */

import type { Card, SpiderSolitaireState, Suit } from './types'
import { SPIDER_CONFIG, RANKS, RANK_VALUES, SCORING } from './config'

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Create a deck of cards for Spider Solitaire
 * POC: Uses only spades (1 suit mode)
 */
export const createDeck = (): Card[] => {
  const deck: Card[] = []
  const suits: Suit[] = ['spades'] // POC: 1 suit only

  // Create 2 decks
  for (let deckNum = 0; deckNum < SPIDER_CONFIG.DECKS; deckNum++) {
    for (const suit of suits) {
      for (const rank of RANKS) {
        deck.push({
          suit,
          rank,
          faceUp: false,
          id: `${suit}-${rank}-${deckNum}`,
        })
      }
    }
  }

  return shuffle(deck)
}

/**
 * Deal initial layout
 */
const dealInitialLayout = (deck: Card[]): { tableau: Card[][]; stock: Card[] } => {
  const tableau: Card[][] = Array.from({ length: SPIDER_CONFIG.TABLEAU_PILES }, () => [])
  let cardIndex = 0

  // Deal cards according to initial layout
  for (let i = 0; i < SPIDER_CONFIG.TABLEAU_PILES; i++) {
    const cardsInPile = SPIDER_CONFIG.INITIAL_LAYOUT[i]
    for (let j = 0; j < cardsInPile; j++) {
      const card = { ...deck[cardIndex] }
      // Only top card is face up
      card.faceUp = j === cardsInPile - 1
      tableau[i].push(card)
      cardIndex++
    }
  }

  // Remaining cards go to stock
  const stock = deck.slice(cardIndex)

  return { tableau, stock }
}

/**
 * Create initial game state
 */
export const createInitialState = (): SpiderSolitaireState => {
  const deck = createDeck()
  const { tableau, stock } = dealInitialLayout(deck)

  return {
    tableau,
    stock,
    completed: [],
    selectedCards: null,
    isGameOver: false,
    isWon: false,
    moves: 0,
    score: 500, // Start with 500 points
    undoStack: [],
  }
}

/**
 * Check if a card can be placed on another
 * In Spider Solitaire, you can place any card on a card one rank higher
 */
export const canPlaceCard = (card: Card, targetCard: Card): boolean => {
  return RANK_VALUES[targetCard.rank] === RANK_VALUES[card.rank] + 1
}

/**
 * Get the sequence of cards that can be moved together
 * Cards must be in descending order and same suit
 */
export const getMovableSequence = (pile: Card[], cardIndex: number): Card[] => {
  if (cardIndex >= pile.length) return []

  const sequence: Card[] = [pile[cardIndex]]
  const startSuit = pile[cardIndex].suit

  // Build sequence downward
  for (let i = cardIndex + 1; i < pile.length; i++) {
    const currentCard = pile[i]
    const prevCard = pile[i - 1]

    // Must be descending and same suit
    if (
      currentCard.suit === startSuit &&
      RANK_VALUES[currentCard.rank] === RANK_VALUES[prevCard.rank] - 1
    ) {
      sequence.push(currentCard)
    } else {
      break
    }
  }

  return sequence
}

/**
 * Check if a pile has a complete sequence (K to A)
 */
export const findCompleteSequence = (pile: Card[]): number | null => {
  if (pile.length < 13) return null

  for (let i = 0; i <= pile.length - 13; i++) {
    const startCard = pile[i]
    if (startCard.rank !== 'K' || !startCard.faceUp) continue

    const suit = startCard.suit
    let isComplete = true

    for (let j = 0; j < 13; j++) {
      const card = pile[i + j]
      const expectedRank = RANKS[12 - j] // K, Q, J, ..., A
      if (card.rank !== expectedRank || card.suit !== suit || !card.faceUp) {
        isComplete = false
        break
      }
    }

    if (isComplete) return i
  }

  return null
}

/**
 * Remove complete sequence from pile
 */
const removeCompleteSequences = (state: SpiderSolitaireState): SpiderSolitaireState => {
  let newState = { ...state }
  let foundSequence = true

  while (foundSequence) {
    foundSequence = false

    for (let pileIndex = 0; pileIndex < newState.tableau.length; pileIndex++) {
      const pile = newState.tableau[pileIndex]
      const sequenceStart = findCompleteSequence(pile)

      if (sequenceStart !== null) {
        foundSequence = true
        const completedSequence = pile.slice(sequenceStart, sequenceStart + 13)
        const newPile = [...pile.slice(0, sequenceStart), ...pile.slice(sequenceStart + 13)]

        // Flip top card if exists
        if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
          newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true }
        }

        newState = {
          ...newState,
          tableau: newState.tableau.map((p, i) => (i === pileIndex ? newPile : p)),
          completed: [...newState.completed, completedSequence],
          score: newState.score + SCORING.COMPLETE_SEQUENCE,
        }
        break
      }
    }
  }

  return newState
}

/**
 * Move cards from one pile to another
 */
export const moveCards = (
  state: SpiderSolitaireState,
  fromPile: number,
  cardIndex: number,
  toPile: number
): SpiderSolitaireState | null => {
  if (fromPile === toPile) return null

  const sourcePile = state.tableau[fromPile]
  const targetPile = state.tableau[toPile]

  if (!sourcePile[cardIndex]?.faceUp) return null

  const sequence = getMovableSequence(sourcePile, cardIndex)
  if (sequence.length === 0) return null

  const topCard = sequence[0]

  // Check if we can place on target
  if (targetPile.length > 0) {
    const targetCard = targetPile[targetPile.length - 1]
    if (!canPlaceCard(topCard, targetCard)) return null
  }

  // Move the sequence
  const newSourcePile = sourcePile.slice(0, cardIndex)
  const newTargetPile = [...targetPile, ...sequence]

  // Flip top card of source pile if exists
  if (newSourcePile.length > 0 && !newSourcePile[newSourcePile.length - 1].faceUp) {
    newSourcePile[newSourcePile.length - 1] = { ...newSourcePile[newSourcePile.length - 1], faceUp: true }
  }

  let newState: SpiderSolitaireState = {
    ...state,
    tableau: state.tableau.map((pile, i) => {
      if (i === fromPile) return newSourcePile
      if (i === toPile) return newTargetPile
      return pile
    }),
    selectedCards: null,
    moves: state.moves + 1,
    score: state.score + SCORING.MOVE_PENALTY,
  }

  // Check for complete sequences
  newState = removeCompleteSequences(newState)

  // Check win condition
  if (newState.completed.length === 8) {
    newState = { ...newState, isWon: true, isGameOver: true }
  }

  return newState
}

/**
 * Deal new row of cards from stock
 */
export const dealFromStock = (state: SpiderSolitaireState): SpiderSolitaireState | null => {
  if (state.stock.length < SPIDER_CONFIG.CARDS_PER_DEAL) return null

  // All piles must have at least one card
  if (state.tableau.some(pile => pile.length === 0)) return null

  const newTableau = state.tableau.map((pile, i) => {
    const newCard = { ...state.stock[i], faceUp: true }
    return [...pile, newCard]
  })

  const newStock = state.stock.slice(SPIDER_CONFIG.CARDS_PER_DEAL)

  let newState: SpiderSolitaireState = {
    ...state,
    tableau: newTableau,
    stock: newStock,
    selectedCards: null,
  }

  // Check for complete sequences
  newState = removeCompleteSequences(newState)

  return newState
}

/**
 * Get hint for next move
 */
export const getHint = (state: SpiderSolitaireState): { from: number; cardIndex: number; to: number } | null => {
  // Try to find a move that creates a sequence
  for (let fromPile = 0; fromPile < state.tableau.length; fromPile++) {
    const pile = state.tableau[fromPile]
    for (let cardIndex = 0; cardIndex < pile.length; cardIndex++) {
      const card = pile[cardIndex]
      if (!card.faceUp) continue

      for (let toPile = 0; toPile < state.tableau.length; toPile++) {
        if (fromPile === toPile) continue

        const targetPile = state.tableau[toPile]
        if (targetPile.length === 0) continue

        const targetCard = targetPile[targetPile.length - 1]
        if (canPlaceCard(card, targetCard)) {
          return { from: fromPile, cardIndex, to: toPile }
        }
      }
    }
  }

  // Try moving to empty pile
  const emptyPile = state.tableau.findIndex(pile => pile.length === 0)
  if (emptyPile !== -1) {
    for (let fromPile = 0; fromPile < state.tableau.length; fromPile++) {
      const pile = state.tableau[fromPile]
      if (pile.length > 1) {
        const sequence = getMovableSequence(pile, 0)
        if (sequence.length > 0) {
          return { from: fromPile, cardIndex: 0, to: emptyPile }
        }
      }
    }
  }

  return null
}
