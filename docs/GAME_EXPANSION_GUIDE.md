# Game Expansion Guide

This document provides detailed expansion strategies for each game in the Frov platform.

## Overview

Each game starts as a Proof of Concept (POC) with a single level. This guide outlines how to expand each game with additional levels, features, and complexity.

---

## 1. Pong ✅ (IMPLEMENTED)

**Current Status:** Complete POC - Single level with AI opponent

**See:** [src/games/pong/README.md](../src/games/pong/README.md) for detailed expansion plans

**Quick Summary:**
- Level 2: Power-ups (2-4 hours)
- Level 3: Local multiplayer (2-3 hours)
- Level 4: Online multiplayer (20-40 hours)
- Level 5: Tournament mode (6-10 hours)
- Level 6: Visual enhancements (4-8 hours)
- Level 7: Advanced physics (4-6 hours)
- Level 8: Multiple game modes (8-12 hours each)

---

## 2. Connect 4

### Level 1 (POC) - Estimated Time: 6-8 hours

**Features:**
- 6x7 grid (standard Connect 4 board)
- Two-player local gameplay
- Turn-based mechanics
- Win detection (horizontal, vertical, diagonal)
- Draw detection (full board)
- Piece drop animation
- Score tracking

**Implementation:**
```typescript
// State
interface Connect4State {
  board: (Player | null)[][]  // 6x7 grid
  currentPlayer: Player
  winner: Player | null
  isDraw: boolean
  moves: number
}

// Core logic
- dropPiece(column)
- checkWin()
- checkDraw()
- switchPlayer()
```

### Expansion Levels

**Level 2: AI Opponent (Easy)** - 4-6 hours
- Minimax algorithm with limited depth
- Difficulty levels (easy, medium, hard)
- AI thinking indicator

**Level 3: Enhanced AI (Medium)** - 6-10 hours
- Alpha-beta pruning optimization
- Position evaluation heuristics
- Opening book for common moves

**Level 4: Online Multiplayer (Hard)** - 20-30 hours
- WebSocket integration
- Matchmaking system
- Rematch functionality

**Level 5: Tournament Mode** - 8-12 hours
- Best of 3/5/7 matches
- Bracket system
- Match history

**Additional Features:**
- Undo move
- Hint system
- Custom board sizes (7x8, 8x8)
- Time limits per move
- Statistics and analytics

---

## 3. Battleships

### Level 1 (POC) - Estimated Time: 10-12 hours

**Features:**
- 10x10 grid
- 5 ships: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)
- Ship placement phase
- Turn-based shooting
- Hit/miss feedback
- Ship sunk detection
- AI opponent with random shooting

**Implementation:**
```typescript
interface BattleshipsState {
  playerBoard: Cell[][]
  aiBoard: Cell[][]
  playerShips: Ship[]
  aiShips: Ship[]
  phase: 'placement' | 'battle'
  currentTurn: Player
  shots: Shot[]
}

// Core logic
- placeShip(ship, position, orientation)
- shoot(x, y)
- checkHit()
- checkSunk()
- aiTurn()
```

### Expansion Levels

**Level 2: Smart AI (Easy)** - 6-8 hours
- Hunt/Target mode
- After hit, shoot adjacent cells
- Basic probability targeting

**Level 3: Advanced AI (Medium)** - 8-12 hours
- Probability density maps
- Ship size awareness
- Parity optimization

**Level 4: Online Multiplayer (Hard)** - 25-35 hours
- Real-time gameplay
- Chat system
- Custom rules

**Level 5: Game Variations** - 12-16 hours
- Salvo mode (multiple shots per turn)
- Mine mode (special cells)
- Aircraft mode (scanning ability)
- Different board sizes

**Additional Features:**
- Ship rotation during placement
- Drag-and-drop placement
- Auto-placement option
- Statistics (hit accuracy, games won)
- Custom ship names

---

## 4. Solitaire (Klondike)

### Level 1 (POC) - Estimated Time: 12-15 hours

**Features:**
- Standard Klondike rules
- Draw 3 cards
- Tableau (7 piles)
- Foundation (4 piles, Ace to King)
- Stock and waste piles
- Drag-and-drop cards
- Auto-move to foundation
- Win detection
- Move counter

**Implementation:**
```typescript
interface SolitaireState {
  tableau: Card[][]  // 7 piles
  foundation: Card[][]  // 4 piles
  stock: Card[]
  waste: Card[]
  moves: number
  score: number
}

// Core logic
- dealCards()
- moveCard(from, to)
- validateMove()
- checkWin()
- drawFromStock()
```

### Expansion Levels

**Level 2: Game Variations (Easy)** - 6-8 hours
- Draw 1 card mode
- Vegas scoring
- Timed mode

**Level 3: Hints & Undo (Easy)** - 4-6 hours
- Move hint system
- Unlimited undo
- Best move suggestion

**Level 4: Statistics & Achievements (Medium)** - 6-10 hours
- Win rate tracking
- Fastest solve time
- Minimum moves challenge
- Daily challenges

**Level 5: Multiple Solitaire Types (Hard)** - 20-30 hours
- FreeCell
- Pyramid
- TriPeaks
- Golf

**Additional Features:**
- Card back designs
- Table felt colors
- Sound effects
- Auto-complete when won
- Deal number for reproducibility

---

## 5. Spider Solitaire

### Level 1 (POC) - Estimated Time: 15-18 hours

**Features:**
- 1 suit (easy mode - all spades)
- 10 tableau piles
- 2 decks of cards (104 cards)
- Stock pile (50 cards)
- Complete suit removal (K to A)
- Move sequences
- Deal new row from stock
- Undo functionality

**Implementation:**
```typescript
interface SpiderState {
  tableau: Card[][]  // 10 piles
  stock: Card[]
  completed: Card[][]  // Completed suits
  moves: number
  score: number
}

// Core logic
- moveCards(from, to, count)
- dealNewRow()
- checkCompleteSuit()
- validateSequence()
```

### Expansion Levels

**Level 2: Two Suits (Medium)** - 6-8 hours
- Spades and Hearts
- Increased difficulty
- Modified scoring

**Level 3: Four Suits (Hard)** - 4-6 hours
- All suits (hardest difficulty)
- Professional mode

**Level 4: Hints & Strategy (Medium)** - 8-12 hours
- Move suggestions
- Best move highlighting
- Strategy tips

**Level 5: Challenges (Medium)** - 10-14 hours
- Daily challenges
- Timed mode
- Limited undo
- Achievements

**Additional Features:**
- Statistics tracking
- Win percentage by difficulty
- Average moves to win
- Custom difficulty settings
- Animation speed control

---

## 6. Hill Climb Racing

### Level 1 (POC) - Estimated Time: 16-20 hours

**Features:**
- Physics-based vehicle
- Hill terrain generation
- Accelerate/brake controls
- Fuel system
- Distance tracking
- Flip detection (game over)
- Simple vehicle (basic car)
- One terrain type (hills)

**Implementation:**
```typescript
interface HillClimbState {
  vehicle: {
    position: Position
    velocity: Velocity
    rotation: number
    fuel: number
  }
  terrain: TerrainPoint[]
  distance: number
  coins: number
  isFlipped: boolean
}

// Core logic
- updatePhysics(deltaTime)
- generateTerrain()
- checkCollision()
- checkFlip()
- collectCoin()
```

### Expansion Levels

**Level 2: More Terrains (Easy)** - 8-12 hours
- Desert
- Arctic
- Moon
- Different physics per terrain

**Level 3: Multiple Vehicles (Medium)** - 12-16 hours
- Bike
- Truck
- Tank
- Different handling characteristics

**Level 4: Upgrades (Medium)** - 10-14 hours
- Engine upgrade
- Suspension upgrade
- Tire upgrade
- Fuel tank upgrade
- Shop system with coins

**Level 5: Obstacles & Power-ups (Medium)** - 12-16 hours
- Ramps
- Barrels
- Bridges
- Speed boost power-up
- Air control power-up

**Level 6: Multiplayer Ghost (Hard)** - 15-20 hours
- Record best runs
- Race against ghost
- Online leaderboard with replays

**Additional Features:**
- Customization (colors, decals)
- Daily missions
- Achievement system
- Different weather conditions
- Particle effects (dust, snow)

---

## 7. Tetris

### Level 1 (POC) - Estimated Time: 12-15 hours

**Features:**
- Standard Tetris grid (10x20)
- 7 tetromino shapes (I, O, T, S, Z, J, L)
- Piece rotation (4 rotations)
- Left/right movement
- Soft drop and hard drop
- Line clearing
- Score system
- Level progression (speed increase)
- Next piece preview
- Game over detection

**Implementation:**
```typescript
interface TetrisState {
  grid: Cell[][]  // 10x20
  currentPiece: Tetromino
  nextPiece: Tetromino
  position: Position
  score: number
  level: number
  linesCleared: number
}

// Core logic
- movePiece(direction)
- rotatePiece()
- dropPiece()
- checkCollision()
- clearLines()
- checkGameOver()
```

### Expansion Levels

**Level 2: Enhanced Features (Easy)** - 6-8 hours
- Hold piece functionality
- Ghost piece (shows landing position)
- T-spin detection
- Combo system

**Level 3: Game Modes (Medium)** - 10-14 hours each
- Marathon (150 lines)
- Sprint (40 lines as fast as possible)
- Ultra (2 minutes, max score)
- Endless mode

**Level 4: Modern Tetris Features (Medium)** - 12-16 hours
- SRS rotation system (standard)
- Wall kicks
- Floor kicks
- 7-bag randomizer
- Lock delay

**Level 5: Multiplayer (Hard)** - 25-35 hours
- 1v1 battles
- Garbage lines system
- Attack combos
- Online matchmaking

**Level 6: Challenge Modes (Medium)** - 12-18 hours
- Invisible mode
- Zen mode (no game over)
- Master mode (instant drop)
- Custom challenges

**Additional Features:**
- Multiple control schemes
- Customizable DAS/ARR
- Skin/theme system
- Statistics tracking
- Personal best records
- Touch controls for mobile

---

## General Implementation Guidelines

### For All Games:

1. **Start Simple**
   - Implement core mechanics first
   - Test thoroughly before adding features
   - Use the shared game engine components

2. **Code Structure**
   ```typescript
   game-name/
   ├── GameName.tsx           # Main component
   ├── config.ts              # Constants
   ├── types.ts               # Type definitions
   ├── gameLogic.ts           # Pure functions
   ├── utils.ts               # Helper functions
   ├── levels/                # Level definitions
   │   └── level-1.ts
   └── README.md              # Documentation
   ```

3. **Use Shared Utilities**
   - `useCanvas` for canvas management
   - `useGameLoop` for game loop
   - Collision detection functions
   - Storage utilities

4. **Follow Principles**
   - **Clean Code**: Self-documenting, well-commented
   - **DRY**: Reuse shared components
   - **KISS**: Keep it simple
   - **SoC**: Separate concerns (logic, rendering, state)

5. **Performance**
   - Target 60fps
   - Use object pooling
   - Minimize state updates
   - Optimize rendering

6. **Mobile Considerations**
   - Touch controls
   - Responsive canvas
   - Performance on low-end devices

---

## Priority Order for Implementation

**Recommended implementation order based on complexity:**

1. ✅ **Pong** - Complete (8-10 hours)
2. **Connect 4** - Easiest (6-8 hours)
3. **Solitaire** - Medium complexity (12-15 hours)
4. **Tetris** - Medium-high (12-15 hours)
5. **Battleships** - Higher complexity (10-12 hours)
6. **Spider Solitaire** - Complex card logic (15-18 hours)
7. **Hill Climb Racing** - Most complex (physics) (16-20 hours)

**Total estimated time for all POC levels:** ~80-100 hours

---

## Testing Recommendations

For each game:
1. **Unit Tests**: Test pure game logic functions
2. **Integration Tests**: Test game state transitions
3. **Performance Tests**: Verify 60fps performance
4. **User Testing**: Playtest for balance and fun
5. **Cross-browser**: Test on Chrome, Firefox, Safari
6. **Mobile**: Test on actual devices

---

## Resources

- **Game Development Patterns**: [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- **Canvas Performance**: [MDN Canvas Optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- **Physics**: [2D Physics Tutorial](https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics)
- **Algorithms**: [Game AI Pro](http://www.gameaipro.com/)

---

**Last Updated:** 2025-11-18
**Version:** 1.0
