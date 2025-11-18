/**
 * Solitaire (Klondike) Game Component
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'
import { useGameStore } from '@platform/store/gameStore'
import type { Card, SolitaireState } from './types'
import { SUIT_SYMBOLS, COLORS } from './config'
import { createInitialState, drawFromStock, moveCards, getHint } from './gameLogic'

export const SolitaireGame = () => {
  const navigate = useNavigate()
  const { user, updateStats } = useUserStore()
  const { addScore } = useGameStore()
  const [gameState, setGameState] = useState<SolitaireState>(createInitialState())
  const [selectedCards, setSelectedCards] = useState<{ pile: string; index: number } | null>(null)

  const handleCardClick = (pile: string, index: number) => {
    if (pile === 'stock') {
      setGameState(drawFromStock(gameState))
      setSelectedCards(null)
      return
    }

    if (!selectedCards) {
      setSelectedCards({ pile, index })
    } else {
      const newState = moveCards(gameState, selectedCards, { pile, index })
      if (newState) {
        setGameState(newState)
        if (newState.isWon && user) {
          const score = Math.max(0, 1000 - newState.moves * 2)
          updateStats('solitaire', score)
          addScore('solitaire', user.id, user.username, user.avatar, score)
        }
      }
      setSelectedCards(null)
    }
  }

  const handleHint = () => {
    const hint = getHint(gameState)
    if (hint) {
      setSelectedCards({ pile: hint.from, index: -1 })
    }
  }

  const renderCard = (card: Card | null, pile: string, index: number, isClickable: boolean = true) => {
    if (!card) {
      return (
        <div
          onClick={() => isClickable && handleCardClick(pile, index)}
          className="w-[70px] h-[100px] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          style={{ backgroundColor: COLORS.EMPTY_PILE }}
        >
          {pile.startsWith('foundation') && (
            <span className="text-4xl text-gray-600">
              {pile === 'foundation-0' && '♥'}
              {pile === 'foundation-1' && '♦'}
              {pile === 'foundation-2' && '♣'}
              {pile === 'foundation-3' && '♠'}
            </span>
          )}
        </div>
      )
    }

    const isSelected = selectedCards?.pile === pile && selectedCards?.index === index
    const suitColor = card.color === 'red' ? COLORS.RED_SUIT : COLORS.BLACK_SUIT

    return (
      <div
        onClick={() => isClickable && card.faceUp && handleCardClick(pile, index)}
        className={`w-[70px] h-[100px] rounded-lg flex flex-col items-center justify-between p-1 ${
          card.faceUp ? 'cursor-pointer hover:scale-105' : ''
        } transition-all ${isSelected ? 'ring-4 ring-yellow-500' : ''}`}
        style={{
          backgroundColor: card.faceUp ? COLORS.CARD_FRONT : COLORS.CARD_BACK,
          borderColor: COLORS.CARD_BORDER,
          borderWidth: '2px',
        }}
      >
        {card.faceUp ? (
          <>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold" style={{ color: suitColor }}>
                {card.rank}
              </span>
              <span className="text-lg" style={{ color: suitColor }}>
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </div>
            <span className="text-3xl" style={{ color: suitColor }}>
              {SUIT_SYMBOLS[card.suit]}
            </span>
            <div className="flex items-center gap-1 rotate-180">
              <span className="text-sm font-bold" style={{ color: suitColor }}>
                {card.rank}
              </span>
              <span className="text-lg" style={{ color: suitColor }}>
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-2xl">🂠</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: COLORS.TABLE_BG }}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-game font-bold text-white">SOLITAIRE (KLONDIKE)</h2>
            <p className="text-white/80">Moves: {gameState.moves}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleHint} className="btn-secondary">
              💡 Hint
            </button>
            <button onClick={() => setGameState(createInitialState())} className="btn-primary">
              🔄 New Game
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              🏠 Exit
            </button>
          </div>
        </div>

        {/* Win Message */}
        {gameState.isWon && (
          <div className="mb-4 bg-green-600 text-white p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">🎉 You Win! Moves: {gameState.moves}</p>
          </div>
        )}

        {/* Top Row: Stock, Waste, Foundations */}
        <div className="mb-8 flex gap-4">
          {/* Stock */}
          <div onClick={() => handleCardClick('stock', 0)}>
            {gameState.stock.length > 0 ? (
              renderCard({ ...gameState.stock[0], faceUp: false }, 'stock', 0)
            ) : (
              <div className="w-[70px] h-[100px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer">
                <span className="text-white text-2xl">↻</span>
              </div>
            )}
          </div>

          {/* Waste */}
          <div>
            {gameState.waste.length > 0 ? (
              renderCard(gameState.waste[0], 'waste', 0)
            ) : (
              renderCard(null, 'waste', 0, false)
            )}
          </div>

          {/* Spacer */}
          <div className="w-[70px]"></div>

          {/* Foundations */}
          {gameState.foundation.map((pile, i) => (
            <div key={i}>
              {pile.length > 0 ? (
                renderCard(pile[pile.length - 1], `foundation-${i}`, pile.length - 1)
              ) : (
                renderCard(null, `foundation-${i}`, 0)
              )}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-4">
          {gameState.tableau.map((pile, pileIndex) => (
            <div key={pileIndex} className="flex flex-col gap-0 min-h-[400px]">
              {pile.length === 0 ? (
                renderCard(null, `tableau-${pileIndex}`, 0)
              ) : (
                pile.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className="relative"
                    style={{ marginTop: cardIndex === 0 ? 0 : '-75px' }}
                  >
                    {renderCard(card, `tableau-${pileIndex}`, cardIndex)}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-white text-center text-sm">
          <p>Click cards to select, click destination to move. Stock to draw 3 cards.</p>
          <p className="mt-2">Build foundation piles from Ace to King by suit.</p>
          <p>Build tableau piles in descending order with alternating colors.</p>
        </div>
      </div>
    </div>
  )
}
