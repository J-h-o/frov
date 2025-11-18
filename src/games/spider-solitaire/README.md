# Spider Solitaire - Documentation

## Overview
Classic Spider Solitaire card game. Build sequences in descending order and complete full suits from King to Ace to remove them from the board.

## Current Implementation (Level 1 - POC)
- ✅ 10 tableau piles
- ✅ 1 suit mode (easiest difficulty - all spades)
- ✅ 2 decks (104 cards)
- ✅ Click-to-select, click-to-move interface
- ✅ Same-suit sequence movement
- ✅ Automatic complete sequence removal (K-A)
- ✅ Stock dealing (10 cards at once)
- ✅ Scoring system (500 base, -1 per move, +100 per sequence)
- ✅ Hint system
- ✅ Win detection (8 complete sequences)

## How to Play
**Goal:** Remove all 8 complete sequences (K to A of same suit)

**Gameplay:**
1. Click a card to select it
2. Click another pile to move the selected card
3. Cards must be placed in descending order (any suit on higher rank)
4. Only same-suit sequences can be moved together
5. Complete K-A sequences are removed automatically
6. Click "Deal" to add one card to each pile
7. Win by completing all 8 sequences!

**Rules:**
- You can place any card on a card one rank higher
- Only sequences of the same suit move together as a unit
- All piles must have at least one card before dealing
- Game ends when no more moves possible or all sequences complete

## Expansion Levels

**Level 2**: Two Suit Mode
- Add hearts as second suit
- Increases difficulty (sequences must match suit)
- Estimated time: 4-6 hours
- Changes needed:
  - Update SUITS_IN_PLAY to 2 in config
  - Add hearts to deck creation
  - Update UI to show both suits with colors

**Level 3**: Four Suit Mode (Expert)
- All four suits (hardest difficulty)
- Estimated time: 2-3 hours
- Changes needed:
  - Update SUITS_IN_PLAY to 4 in config
  - Add all suits to deck creation
  - Much harder to complete sequences

**Level 4**: Undo/Redo System
- Multiple undo levels
- Redo functionality
- Move history tracking
- Estimated time: 6-8 hours
- Changes needed:
  - Implement undo stack (already in state)
  - Add redo stack
  - Create undo/redo buttons
  - Track complete game history

**Level 5**: Advanced Features
- Auto-play when obvious moves exist
- Statistics tracking (games won, best score, etc.)
- Timer and speed-run mode
- Custom difficulty settings
- Save/load game state
- Estimated time: 12-15 hours

**Level 6**: Themes and Customization
- Multiple card deck designs
- Custom table colors
- Animation effects
- Sound effects
- Accessibility features
- Estimated time: 8-10 hours

**Total Time Estimate**: 32-42 hours for all expansion levels

## Implementation Notes
- Pure functional game logic in gameLogic.ts
- Complete sequence detection runs after every move
- Hint system prioritizes creating sequences
- Score decreases with moves to encourage efficiency
- UI uses absolute positioning for card overlap effect

---
**Status**: ✅ POC Complete | **Last Updated**: 2025-11-18
