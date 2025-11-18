/**
 * Solitaire game logic
 */

import type { Card, SolitaireState, Color } from './types'
import { SUITS, RANKS, SUIT_COLORS, RANK_VALUES, SOLITAIRE_CONFIG } from './config'

export const createDeck = (): Card[] => {
  const deck: Card[] = []
  let id = 0

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        color: SUIT_COLORS[suit] as Color,
        faceUp: false,
        id: `${suit}-${rank}-${id++}`,
      })
    }
  }

  return shuffle(deck)
}

export const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const createInitialState = (): SolitaireState => {
  const deck = createDeck()
  const tableau: Card[][] = []

  // Deal tableau (7 piles, increasing cards)
  let deckIndex = 0
  for (let pile = 0; pile < 7; pile++) {
    tableau[pile] = []
    for (let card = 0; card <= pile; card++) {
      const dealtCard = deck[deckIndex++]
      tableau[pile].push({
        ...dealtCard,
        faceUp: card === pile, // Only top card is face up
      })
    }
  }

  // Remaining cards go to stock
  const stock = deck.slice(deckIndex)

  return {
    tableau,
    foundation: [[], [], [], []], // 4 empty foundation piles
    stock,
    waste: [],
    moves: 0,
    score: 0,
    isWon: false,
    selectedCard: null,
  }
}

export const canPlaceOnTableau = (card: Card, targetCard: Card | null): boolean => {
  if (!targetCard) {
    // Can only place King on empty tableau
    return card.rank === 'K'
  }

  // Must be opposite color
  if (card.color === targetCard.color) return false

  // Must be one rank lower
  const cardValue = RANK_VALUES[card.rank]
  const targetValue = RANK_VALUES[targetCard.rank]
  return cardValue === targetValue - 1
}

export const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
  if (foundation.length === 0) {
    // Can only start with Ace
    return card.rank === 'A'
  }

  const topCard = foundation[foundation.length - 1]

  // Must be same suit
  if (card.suit !== topCard.suit) return false

  // Must be one rank higher
  const cardValue = RANK_VALUES[card.rank]
  const topValue = RANK_VALUES[topCard.rank]
  return cardValue === topValue + 1
}

export const drawFromStock = (state: SolitaireState): SolitaireState => {
  if (state.stock.length === 0) {
    // Reset: move waste back to stock
    return {
      ...state,
      stock: [...state.waste].reverse().map(card => ({ ...card, faceUp: false })),
      waste: [],
    }
  }

  // Draw cards from stock
  const drawCount = Math.min(SOLITAIRE_CONFIG.DRAW_COUNT, state.stock.length)
  const drawn = state.stock.slice(0, drawCount).map(card => ({ ...card, faceUp: true }))
  const newStock = state.stock.slice(drawCount)
  const newWaste = [...drawn, ...state.waste]

  return {
    ...state,
    stock: newStock,
    waste: newWaste,
    moves: state.moves + 1,
  }
}

export const moveCards = (
  state: SolitaireState,
  from: { pile: string; index: number },
  to: { pile: string; index: number }
): SolitaireState | null => {
  const newState = { ...state, moves: state.moves + 1 }

  // Handle waste to tableau/foundation
  if (from.pile === 'waste') {
    if (newState.waste.length === 0) return null
    const card = newState.waste[0]

    if (to.pile.startsWith('tableau')) {
      const pileIndex = parseInt(to.pile.replace('tableau-', ''))
      const tableau = newState.tableau[pileIndex]
      const targetCard = tableau.length > 0 ? tableau[tableau.length - 1] : null

      if (!canPlaceOnTableau(card, targetCard)) return null

      newState.waste = newState.waste.slice(1)
      newState.tableau[pileIndex] = [...tableau, { ...card, faceUp: true }]
      return newState
    }

    if (to.pile.startsWith('foundation')) {
      const pileIndex = parseInt(to.pile.replace('foundation-', ''))
      const foundation = newState.foundation[pileIndex]

      if (!canPlaceOnFoundation(card, foundation)) return null

      newState.waste = newState.waste.slice(1)
      newState.foundation[pileIndex] = [...foundation, card]
      return checkWin(newState)
    }
  }

  // Handle tableau to tableau/foundation
  if (from.pile.startsWith('tableau')) {
    const fromPileIndex = parseInt(from.pile.replace('tableau-', ''))
    const fromTableau = newState.tableau[fromPileIndex]

    if (from.index >= fromTableau.length || !fromTableau[from.index].faceUp) return null

    const cards = fromTableau.slice(from.index)
    const movingCard = cards[0]

    if (to.pile.startsWith('tableau')) {
      const toPileIndex = parseInt(to.pile.replace('tableau-', ''))
      const toTableau = newState.tableau[toPileIndex]
      const targetCard = toTableau.length > 0 ? toTableau[toTableau.length - 1] : null

      if (!canPlaceOnTableau(movingCard, targetCard)) return null

      newState.tableau[fromPileIndex] = fromTableau.slice(0, from.index)
      newState.tableau[toPileIndex] = [...toTableau, ...cards]

      // Flip top card of source pile if needed
      if (newState.tableau[fromPileIndex].length > 0) {
        const lastCard = newState.tableau[fromPileIndex][newState.tableau[fromPileIndex].length - 1]
        if (!lastCard.faceUp) {
          newState.tableau[fromPileIndex] = newState.tableau[fromPileIndex].map((c, i) =>
            i === newState.tableau[fromPileIndex].length - 1 ? { ...c, faceUp: true } : c
          )
        }
      }

      return newState
    }

    if (to.pile.startsWith('foundation') && cards.length === 1) {
      const toPileIndex = parseInt(to.pile.replace('foundation-', ''))
      const foundation = newState.foundation[toPileIndex]

      if (!canPlaceOnFoundation(movingCard, foundation)) return null

      newState.tableau[fromPileIndex] = fromTableau.slice(0, from.index)
      newState.foundation[toPileIndex] = [...foundation, movingCard]

      // Flip top card if needed
      if (newState.tableau[fromPileIndex].length > 0) {
        const lastCard = newState.tableau[fromPileIndex][newState.tableau[fromPileIndex].length - 1]
        if (!lastCard.faceUp) {
          newState.tableau[fromPileIndex] = newState.tableau[fromPileIndex].map((c, i) =>
            i === newState.tableau[fromPileIndex].length - 1 ? { ...c, faceUp: true } : c
          )
        }
      }

      return checkWin(newState)
    }
  }

  return null
}

export const checkWin = (state: SolitaireState): SolitaireState => {
  const allFoundationsFull = state.foundation.every(pile => pile.length === 13)
  return {
    ...state,
    isWon: allFoundationsFull,
  }
}

export const getHint = (state: SolitaireState): { from: string; to: string } | null => {
  // Check if waste card can go to foundation
  if (state.waste.length > 0) {
    const card = state.waste[0]
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, state.foundation[i])) {
        return { from: 'waste', to: `foundation-${i}` }
      }
    }
  }

  // Check if tableau cards can go to foundation
  for (let i = 0; i < 7; i++) {
    const pile = state.tableau[i]
    if (pile.length > 0) {
      const card = pile[pile.length - 1]
      if (card.faceUp) {
        for (let j = 0; j < 4; j++) {
          if (canPlaceOnFoundation(card, state.foundation[j])) {
            return { from: `tableau-${i}`, to: `foundation-${j}` }
          }
        }
      }
    }
  }

  return null
}
