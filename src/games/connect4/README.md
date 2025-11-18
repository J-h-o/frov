# Connect 4 - Game Documentation

## Overview

Classic two-player strategy game where players drop colored discs into a 6x7 grid. The first player to connect four discs horizontally, vertically, or diagonally wins!

## Current Implementation (Level 1 - POC)

### Features Implemented
- ✅ Player vs AI gameplay
- ✅ 6x7 game board (standard Connect 4)
- ✅ Win detection (horizontal, vertical, diagonal)
- ✅ Draw detection (full board)
- ✅ AI opponent using Minimax algorithm with Alpha-Beta pruning
- ✅ Visual winning line highlight
- ✅ Hover effects for column selection
- ✅ Move counter
- ✅ Score tracking and leaderboard integration
- ✅ Restart and exit functionality

### How to Play
1. Click on a column to drop your red disc
2. AI will automatically make its move with yellow
3. First to connect 4 discs in a row wins!
4. Click "New Game" to play again

### Technical Implementation

#### Architecture
```
connect4/
├── Connect4Game.tsx   # Main game component
├── gameLogic.ts       # Pure game logic functions
├── config.ts          # Game constants
├── types.ts           # TypeScript definitions
└── README.md          # This file
```

#### Key Components
1. **Game Board**: 6 rows × 7 columns grid
2. **Win Detection**: Checks all 4 directions after each move
3. **AI Logic**: Minimax with alpha-beta pruning (depth 4)
4. **State Management**: React state with pure update functions
5. **UI**: Tailwind CSS with smooth animations

#### AI Strategy
The AI uses Minimax algorithm with:
- **Alpha-Beta Pruning**: Optimizes search tree
- **Position Scoring**: Evaluates board strength
- **Strategic Priorities**:
  - Win immediately if possible
  - Block opponent's winning moves
  - Prefer center column
  - Build 3-in-a-row setups
  - Create multiple threats

## Expansion Possibilities

### Level 2: Difficulty Levels (Easy)
**Estimated Time**: 2-3 hours

Features to add:
- Easy: Random moves with 30% optimal play
- Medium: Current implementation (depth 4)
- Hard: Deeper search (depth 6)
- Expert: Opening book + depth 8

Implementation:
1. Add difficulty selector UI
2. Create difficulty configuration
3. Adjust AI depth based on difficulty
4. Add move randomization for easy mode
5. Implement opening book for expert mode

```typescript
const AI_DIFFICULTY = {
  easy: { depth: 2, randomness: 0.3 },
  medium: { depth: 4, randomness: 0 },
  hard: { depth: 6, randomness: 0 },
  expert: { depth: 8, randomness: 0, useOpeningBook: true }
}
```

### Level 3: Local Multiplayer (Easy)
**Estimated Time**: 1-2 hours

Features to add:
- Two-player local mode
- Player name customization
- Turn timer (optional)

Implementation:
1. Add mode selector (PvP / PvAI)
2. Remove AI logic when in PvP mode
3. Add player name inputs
4. Implement optional turn timer
5. Track wins per player

### Level 4: Undo/Redo (Easy)
**Estimated Time**: 2-3 hours

Features to add:
- Undo last move
- Redo undone move
- Move history display
- Limited undos in PvAI mode

Implementation:
1. Maintain move history stack
2. Add undo/redo buttons
3. Implement state restoration
4. Show move list with notation
5. Limit undos against AI

### Level 5: Game Analysis (Medium)
**Estimated Time**: 6-8 hours

Features to add:
- Best move suggestions
- Position evaluation display
- Move strength indicator
- Post-game analysis
- Mistake highlighting

Implementation:
1. Add "Hint" button that shows best move
2. Display position score
3. Color-code move quality
4. Show game review after completion
5. Highlight critical moments

### Level 6: Custom Board Sizes (Medium)
**Estimated Time**: 4-6 hours

Features to add:
- Different grid sizes (5x6, 7x8, 8x8)
- Custom win length (3, 4, 5)
- Saved board presets

Implementation:
1. Make grid size configurable
2. Adjust AI for different sizes
3. Create size selector UI
4. Implement custom presets
5. Balance AI difficulty per size

### Level 7: Online Multiplayer (Hard)
**Estimated Time**: 20-30 hours

Features to add:
- Real-time online gameplay
- Matchmaking system
- Rated games with ELO
- Game spectating
- Chat system

Implementation:
1. Set up WebSocket server
2. Implement matchmaking queue
3. Add ELO rating system
4. Create lobby system
5. Add spectator mode
6. Implement chat with moderation

### Level 8: Tournament Mode (Medium)
**Estimated Time**: 8-10 hours

Features to add:
- Single elimination brackets
- Swiss system tournaments
- Best of 3/5/7 series
- Tournament leaderboards
- Automated scheduling

Implementation:
1. Create tournament structure
2. Implement bracket system
3. Add Swiss pairing algorithm
4. Build tournament UI
5. Track tournament stats

### Level 9: Game Variants (Medium)
**Estimated Time**: 6-10 hours per variant

**Pop Out**: Remove bottom pieces
**Power Up**: Special pieces with abilities
**Five-in-a-Row**: Larger board, need 5
**Connect 4x4**: 3D version (4×4×4 cube)

Implementation per variant:
1. Modify rules in gameLogic.ts
2. Update UI for new mechanics
3. Adjust AI for variant
4. Add variant selector
5. Create separate leaderboards

### Level 10: Visual Enhancements (Medium)
**Estimated Time**: 6-8 hours

Features to add:
- Piece drop animation
- Sound effects
- Background music
- Particle effects on win
- Theme customization
- Celebration animations

Implementation:
1. Add CSS/canvas animations for drops
2. Implement sound manager
3. Create particle system for wins
4. Add theme selector
5. Animate winning line

## Configuration

All game constants are in `config.ts`:

```typescript
export const CONNECT4_CONFIG = {
  ROWS: 6,              // Board rows
  COLS: 7,              // Board columns
  CONNECT: 4,           // Win condition
  CELL_SIZE: 80,        // Cell size in pixels
  PIECE_RADIUS: 30,     // Piece radius
  AI_DEPTH: 4,          // AI search depth
}
```

## AI Difficulty Tuning

Adjust AI strength by modifying:
- `AI_DEPTH`: Higher = smarter (but slower)
  - 2-3: Easy
  - 4-5: Medium
  - 6-7: Hard
  - 8+: Expert (may be slow)

- `AI_WEIGHTS`: Adjust scoring priorities
  ```typescript
  WIN: 1000000,    // Winning move value
  THREE: 100,      // Three in a row value
  TWO: 10,         // Two in a row value
  CENTER: 3,       // Center column bonus
  ```

## Performance Optimization

Current performance:
- AI move calculation: ~100-500ms (depth 4)
- Suitable for real-time gameplay
- No lag on user interactions

Optimizations for deeper search:
1. Implement transposition tables
2. Add move ordering heuristics
3. Use iterative deepening
4. Parallelize minimax search
5. Implement opening book

## Testing Recommendations

1. **Win Detection**: Test all win patterns
2. **AI Behavior**: Verify blocks and attacks
3. **Edge Cases**: Full board, first move, etc.
4. **Performance**: Test AI response time
5. **UI/UX**: Test all interactions

## Known Limitations

- AI doesn't use opening book (predictable start)
- No animation for piece drops
- No sound effects
- Single difficulty level
- No move history/undo

## Strategy Tips for Players

**Opening**: Start in center column
**Middle Game**: Build multiple threats
**Defense**: Always block opponent's three-in-a-row
**Advanced**: Create "fork" positions with two winning moves

## Code Examples

### Adding a New Difficulty

```typescript
// In config.ts
export const DIFFICULTIES = {
  easy: { depth: 2, label: 'Easy' },
  medium: { depth: 4, label: 'Medium' },
  hard: { depth: 6, label: 'Hard' },
}

// In Connect4Game.tsx
const [difficulty, setDifficulty] = useState('medium')
const aiDepth = DIFFICULTIES[difficulty].depth
```

### Adding Undo Feature

```typescript
const [moveHistory, setMoveHistory] = useState<Connect4State[]>([])

const handleUndo = () => {
  if (moveHistory.length > 0) {
    const previousState = moveHistory[moveHistory.length - 1]
    setGameState(previousState)
    setMoveHistory(moveHistory.slice(0, -1))
  }
}
```

## Contributing

When enhancing Connect 4:
1. Keep AI performance under 1 second
2. Maintain pure function approach in gameLogic.ts
3. Test win detection thoroughly
4. Ensure UI remains responsive
5. Document strategy changes

---

**Current Status**: ✅ Complete POC - Fully playable with AI
**AI Strength**: Medium (Minimax depth 4)
**Last Updated**: 2025-11-18
