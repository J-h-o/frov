# Frov - Game Platform Project Instructions

## Project Overview

Frov is a modern web-based game platform that hosts multiple classic games. The platform is designed to be scalable, maintainable, and built with the latest web technologies.

## Core Principles

### 1. **Best and Latest Technologies (2025)**
- **React 19** - Latest React version with improved performance and features
- **Vite 6** - Lightning-fast build tool with HMR (5x faster builds)
- **TypeScript 5.x** - Type safety and better developer experience
- **Tailwind CSS v4** - Modern utility-first CSS with 100x faster incremental builds
- **HTML5 Canvas** - Native game rendering for 2D games
- **Zustand** - Lightweight state management (better than Redux for this use case)

### 2. **Clean Code**
- Self-documenting code with clear naming conventions
- Consistent code style enforced by ESLint and Prettier
- Comprehensive comments for complex game logic
- Type safety with TypeScript strict mode

### 3. **DRY (Don't Repeat Yourself)**
- Shared game engine components (render loop, collision detection, scoring)
- Reusable UI components for platform features
- Centralized game configuration and metadata
- Common hooks for game state management

### 4. **KISS (Keep It Simple, Stupid)**
- Simple, straightforward architecture
- Avoid over-engineering solutions
- Clear separation between platform and game logic
- Minimal dependencies

### 5. **Separation of Concerns**
- Platform layer: Navigation, user profiles, reviews, leaderboards
- Game layer: Individual games in separate folders
- Shared layer: Common utilities, types, and components
- Data layer: Separate storage for user data, game data, and platform data

## Architecture

```
frov/
├── src/
│   ├── platform/           # Platform features
│   │   ├── components/     # UI components (GameCard, Navigation, etc.)
│   │   ├── pages/          # Platform pages (Home, Profile, Leaderboard)
│   │   ├── store/          # State management (Zustand stores)
│   │   └── services/       # API services and data management
│   │
│   ├── games/              # All games
│   │   ├── pong/           # Each game in its own folder
│   │   ├── connect4/
│   │   ├── battleships/
│   │   ├── solitaire/
│   │   ├── spider-solitaire/
│   │   ├── hill-climb-racing/
│   │   └── tetris/
│   │
│   ├── shared/             # Shared utilities
│   │   ├── components/     # Common components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   ├── types/          # TypeScript types/interfaces
│   │   └── game-engine/    # Base game engine components
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── router.tsx          # React Router configuration
│
├── public/                 # Static assets
├── docs/                   # Documentation
│   └── game-expansion/     # Game expansion guides
└── package.json
```

## Game Structure

Each game follows this standardized structure:

```
games/game-name/
├── Game.tsx                # Main game component
├── GameCanvas.tsx          # Canvas rendering component
├── game.config.ts          # Game metadata and configuration
├── levels/                 # Level definitions
│   └── level-1.ts          # POC level
├── entities/               # Game entities (player, enemies, etc.)
├── hooks/                  # Game-specific hooks
├── utils/                  # Game-specific utilities
├── types.ts                # Game-specific types
└── README.md               # Game documentation and expansion guide
```

## Platform Features

### 1. **Home Page**
- Grid of game cards with thumbnails
- Quick stats (plays, ratings)
- Featured games section
- Search and filter capabilities

### 2. **Game Pages**
- Full-screen game canvas
- Game controls and instructions
- Pause menu
- Score display
- Return to platform button

### 3. **User Profiles**
- Username and avatar
- Game statistics (total plays, highest scores)
- Achievement badges
- Activity feed
- Saved/starred games

### 4. **Reviews & Ratings**
- Star rating system (1-5 stars)
- Written reviews
- Helpful votes on reviews
- Average rating display

### 5. **Leaderboards**
- Global leaderboards per game
- Filter by time period (all-time, monthly, weekly)
- User's rank display
- Top 100 players

## Game Development Guidelines

### Canvas Game Loop Pattern

All games use this standard pattern:

```typescript
const gameLoop = (deltaTime: number) => {
  // 1. Update game state
  updateEntities(deltaTime);
  checkCollisions();
  updateScore();

  // 2. Render
  clearCanvas();
  renderEntities();
  renderUI();

  // 3. Check win/lose conditions
  if (gameOver) handleGameOver();
};

// Use requestAnimationFrame
const animate = (timestamp: number) => {
  const deltaTime = timestamp - lastTime;
  gameLoop(deltaTime);
  requestAnimationFrame(animate);
};
```

### Performance Optimization

- **Sprite Sheets**: Use single image with multiple sprites
- **Object Pooling**: Reuse objects instead of creating/destroying
- **Culling**: Don't render off-screen objects
- **RAF**: Always use requestAnimationFrame for smooth 60fps
- **Mobile First**: Design for touch controls, responsive canvas

### Mobile Considerations

- Touch-friendly controls (large buttons)
- Responsive canvas sizing
- Portrait and landscape support
- Performance optimization for lower-end devices

## Technology Documentation References

### React 19 + Vite
- [Vite Official Docs](https://vitejs.dev/)
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tailwind CSS v4
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- CSS-first configuration
- Built-in Lightning CSS

### Game Development
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [HTML5 Game Development Best Practices](https://www.html5gamedevs.com/)

## Data Storage

### Local Storage (Phase 1 - POC)
```typescript
// User data
{
  userId: string;
  username: string;
  avatar: string;
  stats: GameStats[];
  savedGames: string[];
  reviews: Review[];
}

// Game data
{
  gameId: string;
  highScores: Score[];
  totalPlays: number;
  averageRating: number;
}
```

### Future: Database Integration
- PostgreSQL for relational data (users, reviews)
- Redis for leaderboards and caching
- S3 for game assets and user avatars

## Game List & Status

### Phase 1: POC Games (Single Level Each)

1. **Pong** ✓ (First game)
   - Classic two-paddle ball game
   - Single level: Standard pong

2. **Connect 4**
   - Two-player turn-based strategy
   - Single level: 6x7 grid

3. **Battleships**
   - Grid-based naval combat
   - Single level: 10x10 grid, 5 ships

4. **Solitaire**
   - Classic Klondike solitaire
   - Single level: Draw 3 cards

5. **Spider Solitaire**
   - Advanced solitaire variant
   - Single level: 1 suit (easy mode)

6. **Hill Climb Racing**
   - Physics-based driving
   - Single level: Hill climb track

7. **Tetris**
   - Classic block-stacking
   - Single level: Standard speed

## Development Workflow

1. **Branch Strategy**: Work on feature branches starting with `claude/`
2. **Commit Messages**: Clear, descriptive commits following conventional commits
3. **Testing**: Test all features before committing
4. **Documentation**: Update docs with each major change
5. **Code Review**: Self-review code for adherence to principles

## Future Expansion

- PWA support for offline play
- Multiplayer support (WebSockets)
- Mobile app (React Native)
- More games
- Social features (friends, chat)
- Tournaments and competitions
- Game statistics and analytics
- Achievements and badges

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Project Goals

- **Performance**: 60fps games, fast load times
- **Accessibility**: Keyboard navigation, screen reader support
- **Responsive**: Works on all devices
- **Scalable**: Easy to add new games
- **Maintainable**: Clean, documented code
- **User Experience**: Intuitive, engaging, fun

---

*This document serves as the source of truth for the Frov project architecture and development practices. All contributors should reference this document when building features or adding games.*
