## Tetris - Game Documentation

## Overview

Classic block-stacking puzzle game where players arrange falling tetrominoes to clear lines. Score points by completing lines and progress through increasing difficulty levels.

## Current Implementation (Level 1 - POC)

### Features Implemented
- ✅ Standard 10x20 grid
- ✅ All 7 classic tetrominoes (I, O, T, S, Z, J, L)
- ✅ Piece rotation with wall kicks
- ✅ Line clearing with scoring
- ✅ Level progression (speed increases)
- ✅ Next piece preview
- ✅ Hold piece functionality
- ✅ Ghost piece (shows landing position)
- ✅ Soft drop and hard drop
- ✅ 7-bag randomizer (fair piece distribution)
- ✅ Score tracking and leaderboard integration
- ✅ Pause/resume functionality

### Controls
- **← →**: Move piece left/right
- **↓**: Soft drop (faster fall)
- **↑ / X**: Rotate piece
- **Space**: Hard drop (instant placement)
- **C**: Hold piece
- **ESC**: Pause/Resume
- **Space** (when paused/game over): Start/Restart

### Scoring
- **Single Line**: 100 × Level
- **Double Lines**: 300 × Level
- **Triple Lines**: 500 × Level
- **Tetris (4 Lines)**: 800 × Level
- **Soft Drop**: 1 point per cell
- **Hard Drop**: 2 points per cell

### Technical Implementation

#### Architecture
```
tetris/
├── TetrisGame.tsx     # Main game component with canvas
├── gameLogic.ts       # Pure game logic functions
├── config.ts          # Game constants and shapes
├── types.ts           # TypeScript definitions
└── README.md          # This file
```

#### Key Components
1. **7-Bag Randomizer**: Ensures fair piece distribution
2. **Rotation System**: Wall kicks for better playability
3. **Ghost Piece**: Visual guide for landing position
4. **Hold System**: Strategic piece management
5. **Progressive Difficulty**: Speed increases every 10 lines

#### Game Mechanics
- **Spawn**: Pieces appear at top-center
- **Gravity**: Automatic downward movement
- **Lock Delay**: Piece locks when touching ground and timer expires
- **Line Clear**: Full rows disappear, rows above drop down
- **Level Up**: Every 10 lines cleared
- **Speed**: Gets faster each level (minimum 100ms per drop)

## Expansion Possibilities

### Level 2: Game Modes (Medium)
**Estimated Time**: 8-12 hours

**Marathon Mode**:
- Play until 150 lines cleared
- Fixed end goal

**Sprint Mode**:
- Clear 40 lines as fast as possible
- Timer-based competition

**Ultra Mode**:
- 2-minute time limit
- Maximize score

Implementation:
1. Add mode selector
2. Implement mode-specific rules
3. Track mode-specific stats
4. Separate leaderboards per mode

### Level 3: Modern Features (Medium)
**Estimated Time**: 10-14 hours

**T-Spin Detection**:
- Award bonus points for T-spins
- T-spin singles, doubles, triples

**Combo System**:
- Consecutive line clears multiply score
- Visual combo counter

**Back-to-Back**:
- Bonus for consecutive difficult clears

Implementation:
1. Add T-spin detection algorithm
2. Implement combo counter
3. Create back-to-back tracking
4. Visual feedback for special moves
5. Adjust scoring system

### Level 4: Guideline Tetris (Hard)
**Estimated Time**: 12-18 hours

**SRS Rotation** (Super Rotation System):
- Advanced kick tables
- Complex wall kicks
- I-piece 180° rotation

**Infinity Lock Delay**:
- Piece can be moved indefinitely before locking
- 15 move limit before lock

**DAS/ARR Controls**:
- Delayed Auto Shift
- Auto Repeat Rate
- Customizable timing

Implementation:
1. Implement full SRS kick tables
2. Add lock delay system
3. Implement DAS/ARR
4. Configuration UI
5. Test extensively

### Level 5: Multiplayer (Hard)
**Estimated Time**: 25-35 hours

**1v1 Battle Mode**:
- Garbage lines sent to opponent
- Attack multipliers
- Real-time competition

**Online Play**:
- WebSocket multiplayer
- Matchmaking
- Spectator mode

Implementation:
1. Create garbage system
2. Implement attack mechanics
3. Set up WebSocket server
4. Add matchmaking queue
5. Build lobby system
6. Spectator functionality

### Level 6: Visual Enhancements (Medium)
**Estimated Time**: 8-12 hours

Features:
- Piece drop animations
- Line clear animations
- Particle effects
- Sound effects and music
- Custom themes/skins
- Background animations

Implementation:
1. Canvas animation system
2. Sound manager
3. Particle system
4. Theme configuration
5. Audio assets
6. Visual polish

### Level 7: Advanced Stats (Medium)
**Estimated Time**: 6-10 hours

Features:
- Pieces per second (PPS)
- Attack per minute (APM)
- Line clear distribution
- T-spin statistics
- Game replay system
- Personal bests tracking

Implementation:
1. Add stat tracking
2. Calculate metrics
3. Store game replays
4. Build stats UI
5. Graph visualizations
6. Personal records

### Level 8: Challenge Modes (Medium)
**Estimated Time**: 8-12 hours each

**Invisible Mode**:
- Pieces disappear after placement

**Zen Mode**:
- No game over, relaxed play

**Master Mode**:
- Instant drop, no lock delay

**Cascade Mode**:
- Cleared lines drop down immediately

Implementation per mode:
1. Define mode rules
2. Implement mechanics
3. Test balance
4. Add mode-specific UI

### Level 9: AI Opponent (Hard)
**Estimated Time**: 20-30 hours

Features:
- AI player using search algorithms
- Multiple difficulty levels
- Vs AI mode
- AI strategies (survival, attack, balance)

Implementation:
1. Implement board evaluation
2. Create search algorithm
3. Add strategic planning
4. Difficulty levels
5. Vs AI game mode

### Level 10: Custom Games (Medium)
**Estimated Time**: 10-15 hours

Features:
- Custom board sizes
- Custom piece sets
- Custom gravity
- Rule modifications
- Save custom presets

Implementation:
1. Make config dynamic
2. Add custom piece editor
3. Rule configuration UI
4. Preset system
5. Share presets

## Configuration

All constants in `config.ts`:

```typescript
export const TETRIS_CONFIG = {
  GRID_WIDTH: 10,              // Grid columns
  GRID_HEIGHT: 20,             // Grid rows
  INITIAL_DROP_INTERVAL: 1000, // Starting speed (ms)
  MIN_DROP_INTERVAL: 100,      // Max speed (ms)
  LEVEL_SPEED_MULTIPLIER: 0.9, // Speed increase per level
  LINES_PER_LEVEL: 10,         // Lines to level up
}

export const SCORING = {
  SINGLE: 100,   // 1 line
  DOUBLE: 300,   // 2 lines
  TRIPLE: 500,   // 3 lines
  TETRIS: 800,   // 4 lines
  SOFT_DROP: 1,  // Per cell
  HARD_DROP: 2,  // Per cell
}
```

## Performance Optimization

Current performance:
- 60 FPS smooth gameplay
- Instant input response
- No lag on line clears

Future optimizations:
1. RequestAnimationFrame for rendering only when needed
2. Batch grid updates
3. Optimize collision detection
4. Canvas double buffering
5. Web Workers for AI

## Testing Recommendations

1. **Piece Rotation**: Test all wall kick scenarios
2. **Line Clearing**: Test 1, 2, 3, 4 line clears
3. **Edge Cases**: Full board, rapid input
4. **Level Progression**: Verify speed increases
5. **Hold System**: Test hold swapping
6. **Game Over**: Test top-out conditions

## Known Limitations

- No T-spin detection
- Basic rotation system (no SRS)
- No line clear animations
- No sound effects
- Single game mode
- No replays

## Strategy Tips

**Early Game**:
- Build flat stack
- Save I-pieces for Tetrises
- Use hold strategically

**Mid Game**:
- Maintain well/channel for I-pieces
- Clear lines steadily
- Don't stack too high

**Late Game (High Speed)**:
- Play conservatively
- Use hard drop more
- Focus on survival

## Tetromino Guide

**I-Piece** (Cyan):
- Best for Tetrises (4-line clears)
- Keep a column open for it

**O-Piece** (Yellow):
- Doesn't rotate
- Fill holes and corners

**T-Piece** (Purple):
- Most versatile
- Can fit many spaces

**S/Z-Pieces** (Green/Red):
- Create overhangs
- Plan ahead for placement

**J/L-Pieces** (Blue/Orange):
- Good for edges
- Versatile for filling

## Code Examples

### Adding New Game Mode

```typescript
interface GameMode {
  name: string
  linesGoal?: number
  timeLimit?: number
  rules: GameRules
}

const GAME_MODES: GameMode[] = [
  {
    name: 'Marathon',
    linesGoal: 150,
    rules: { /* ... */ }
  },
  {
    name: 'Sprint',
    linesGoal: 40,
    rules: { /* ... */ }
  }
]
```

### Adding Sound Effects

```typescript
const playSound = (sound: string) => {
  const audio = new Audio(`/sounds/${sound}.mp3`)
  audio.play()
}

// In line clear:
if (linesCleared === 4) playSound('tetris')
else if (linesCleared > 0) playSound('clear')
```

## Contributing

When enhancing Tetris:
1. Maintain 60 FPS performance
2. Keep controls responsive
3. Test rotation extensively
4. Document scoring changes
5. Preserve classic feel

---

**Current Status**: ✅ Complete POC - Classic Tetris
**Features**: Full gameplay with modern additions
**Last Updated**: 2025-11-18
