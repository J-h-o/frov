/**
 * Spider Solitaire Game Component
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import type { SpiderSolitaireState, Card } from './types'
import { COLORS, SUIT_SYMBOLS, SPIDER_CONFIG } from './config'
import { createInitialState, moveCards, dealFromStock, getHint, getMovableSequence } from './gameLogic'

export const SpiderSolitaireGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<SpiderSolitaireState>(createInitialState())
  const [hintHighlight, setHintHighlight] = useState<{ from: number; cardIndex: number; to: number } | null>(null)

  const handleCardClick = (pileIndex: number, cardIndex: number) => {
    const pile = gameState.tableau[pileIndex]
    const card = pile[cardIndex]

    if (!card.faceUp) return

    // If no cards selected, select this card
    if (!gameState.selectedCards) {
      setGameState(prev => ({
        ...prev,
        selectedCards: { pileIndex, cardIndex },
      }))
      return
    }

    // If clicking the same pile, deselect or select different card
    if (gameState.selectedCards.pileIndex === pileIndex) {
      if (gameState.selectedCards.cardIndex === cardIndex) {
        setGameState(prev => ({ ...prev, selectedCards: null }))
      } else {
        setGameState(prev => ({
          ...prev,
          selectedCards: { pileIndex, cardIndex },
        }))
      }
      return
    }

    // Try to move selected cards to this pile
    const newState = moveCards(
      gameState,
      gameState.selectedCards.pileIndex,
      gameState.selectedCards.cardIndex,
      pileIndex
    )

    if (newState) {
      setGameState(newState)
      if (newState.isWon && user) {
        updateStats('spider-solitaire', newState.score)
        addScore('spider-solitaire', user.id, user.username, user.avatar, newState.score)
      }
    }
  }

  const handleEmptyPileClick = (pileIndex: number) => {
    if (!gameState.selectedCards) return

    const newState = moveCards(
      gameState,
      gameState.selectedCards.pileIndex,
      gameState.selectedCards.cardIndex,
      pileIndex
    )

    if (newState) {
      setGameState(newState)
    }
  }

  const handleDeal = () => {
    const newState = dealFromStock(gameState)
    if (newState) {
      setGameState(newState)
    }
  }

  const handleHint = () => {
    const hint = getHint(gameState)
    if (hint) {
      setHintHighlight(hint)
      setTimeout(() => setHintHighlight(null), 2000)
    }
  }

  const renderCard = (card: Card, pileIndex: number, cardIndex: number, isInSequence: boolean) => {
    const isSelected =
      gameState.selectedCards?.pileIndex === pileIndex && gameState.selectedCards?.cardIndex === cardIndex
    const isHinted =
      hintHighlight?.from === pileIndex && hintHighlight?.cardIndex === cardIndex

    return (
      <div
        key={card.id}
        onClick={() => handleCardClick(pileIndex, cardIndex)}
        className={`absolute cursor-pointer transition-all hover:brightness-110 ${
          isSelected ? 'ring-4 ring-yellow-400 z-10' : ''
        } ${isHinted ? 'ring-4 ring-green-400 animate-pulse z-10' : ''}`}
        style={{
          width: '80px',
          height: '110px',
          top: `${cardIndex * 25}px`,
          backgroundColor: card.faceUp ? COLORS.CARD_BG : COLORS.CARD_BACK,
          border: `2px solid ${isInSequence ? COLORS.COMPLETE_SEQUENCE : '#333'}`,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {card.faceUp ? (
          <div className="p-2 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span
                className="font-bold text-lg"
                style={{ color: COLORS[card.suit.toUpperCase() as keyof typeof COLORS] }}
              >
                {card.rank}
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </div>
            <div className="text-center">
              <span
                className="text-4xl"
                style={{ color: COLORS[card.suit.toUpperCase() as keyof typeof COLORS] }}
              >
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </div>
            <div className="flex justify-end">
              <span
                className="font-bold text-lg rotate-180"
                style={{ color: COLORS[card.suit.toUpperCase() as keyof typeof COLORS] }}
              >
                {card.rank}
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-2xl">🂠</div>
          </div>
        )}
      </div>
    )
  }

  const renderPile = (pile: Card[], pileIndex: number) => {
    if (pile.length === 0) {
      return (
        <div
          onClick={() => handleEmptyPileClick(pileIndex)}
          className="relative cursor-pointer hover:bg-opacity-20"
          style={{
            width: '80px',
            minHeight: '110px',
            border: '2px dashed rgba(255,255,255,0.3)',
            borderRadius: '8px',
          }}
        />
      )
    }

    return (
      <div className="relative" style={{ width: '80px', minHeight: '110px' }}>
        {pile.map((card, cardIndex) => {
          const sequence = getMovableSequence(pile, cardIndex)
          const isInSequence = sequence.length > 1
          return renderCard(card, pileIndex, cardIndex, isInSequence)
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: COLORS.TABLE_GREEN }}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-game font-bold text-white">SPIDER SOLITAIRE</h2>
            <p className="text-gray-300">One Suit Mode (Easy)</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-game-card px-4 py-2 rounded">
              <div className="text-xs text-gray-400">SCORE</div>
              <div className="text-xl font-bold text-white">{gameState.score}</div>
            </div>
            <div className="bg-game-card px-4 py-2 rounded">
              <div className="text-xs text-gray-400">MOVES</div>
              <div className="text-xl font-bold text-white">{gameState.moves}</div>
            </div>
            <div className="bg-game-card px-4 py-2 rounded">
              <div className="text-xs text-gray-400">COMPLETED</div>
              <div className="text-xl font-bold text-white">{gameState.completed.length} / 8</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-4">
          <button onClick={() => setGameState(createInitialState())} className="btn-primary">
            🔄 New Game
          </button>
          <button
            onClick={handleDeal}
            disabled={gameState.stock.length < SPIDER_CONFIG.CARDS_PER_DEAL}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🃏 Deal ({Math.floor(gameState.stock.length / SPIDER_CONFIG.CARDS_PER_DEAL)} left)
          </button>
          <button onClick={handleHint} className="btn-secondary">
            💡 Hint
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            🏠 Exit
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 bg-game-card p-4 rounded-lg text-white">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Click a card to select it, then click another pile to move</li>
            <li>• Build descending sequences (any suit can go on higher rank)</li>
            <li>• Complete sequences of same suit (K to A) are removed automatically</li>
            <li>• Click "Deal" to add one card to each pile (all piles must have cards)</li>
            <li>• Win by removing all 8 complete sequences!</li>
          </ul>
        </div>

        {/* Tableau */}
        <div className="flex gap-2 justify-center mb-8">
          {gameState.tableau.map((pile, index) => (
            <div key={index}>{renderPile(pile, index)}</div>
          ))}
        </div>

        {/* Completed Sequences */}
        {gameState.completed.length > 0 && (
          <div className="bg-game-card p-4 rounded-lg">
            <h3 className="text-white font-bold mb-2">Completed Sequences:</h3>
            <div className="flex gap-2">
              {gameState.completed.map((_, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: COLORS.COMPLETE_SEQUENCE }}
                >
                  <span className="text-white font-bold">K-A #{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Win Message */}
        {gameState.isWon && (
          <div className="mt-6 bg-green-600 text-white p-6 rounded-lg text-center">
            <p className="text-3xl font-bold mb-2">🎉 Victory!</p>
            <p className="text-xl">Final Score: {gameState.score}</p>
            <p className="text-lg">Moves: {gameState.moves}</p>
          </div>
        )}
      </div>
    </div>
  )
}
