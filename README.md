# 🎮 Frov - Modern Game Platform

A modern, web-based game platform built with the latest technologies, featuring classic games with a clean, intuitive interface.

## 🎯 Live Demo

**🌐 [Play Now on GitHub Pages](https://j-h-o.github.io/frov/)**

Experience the platform live! Currently featuring a fully playable Pong game with more games coming soon.

**📱 Mobile App Available!** Check out the [mobile/](mobile/) directory for the React Native mobile app supporting iOS and Android.

## ✨ Features

### Platform Features
- 🏠 **Game Library** - Browse and discover all available games
- 👤 **User Profiles** - Track your stats, high scores, and achievements
- 🏆 **Leaderboards** - Compete with others on global leaderboards
- ⭐ **Save Games** - Bookmark your favorite games for quick access
- 🔍 **Search & Filter** - Find games by name or category
- 📊 **Statistics** - Detailed game statistics and play history

### Games (7 Total)
- ✅ **Pong** - Classic arcade paddle game **(PLAYABLE)**
- ✅ **Connect 4** - Strategic two-player game with AI **(PLAYABLE)**
- ✅ **Tetris** - Classic block-stacking puzzle **(PLAYABLE)**
- 🚧 **Battleships** - Naval combat strategy (Coming Soon)
- 🚧 **Solitaire** - Classic Klondike (Coming Soon)
- 🚧 **Spider Solitaire** - Advanced solitaire variant (Coming Soon)
- 🚧 **Hill Climb Racing** - Physics-based driving (Coming Soon)

## 🚀 Tech Stack

Built with cutting-edge 2025 technologies:

### Web Platform
- **React 19** - Latest React with improved performance
- **TypeScript 5.x** - Full type safety
- **Vite 6** - Lightning-fast build tool (5x faster builds, 100x faster HMR)
- **Tailwind CSS v4** - Utility-first CSS with CSS-first configuration
- **Zustand** - Lightweight state management
- **React Router v7** - Client-side routing
- **HTML5 Canvas** - Native game rendering
- **Firebase** - Authentication and cloud database

### Mobile App (React Native)
- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation 7** - Mobile navigation
- **Zustand** - Shared state management with web
- **Firebase** - Authentication and Firestore sync
- **react-native-canvas** - Game rendering on mobile

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/J-h-o/frov.git
cd frov

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🎯 Project Structure

```
frov/
├── src/                   # Web platform source
│   ├── platform/          # Platform features
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management (shared with mobile)
│   │   └── services/      # Business logic (shared with mobile)
│   │
│   ├── games/             # Game implementations
│   │   ├── pong/          # ✅ Complete
│   │   ├── connect4/      # ✅ Complete
│   │   ├── tetris/        # ✅ Complete
│   │   ├── battleships/   # ✅ Complete
│   │   ├── solitaire/     # ✅ Complete
│   │   ├── spider-solitaire/  # ✅ Complete
│   │   ├── hill-climb-racing/ # ✅ Complete
│   │   └── fireboy-watergirl/ # ✅ Multiplayer
│   │
│   ├── shared/            # Shared utilities
│   │   ├── components/    # Common components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   ├── types/         # TypeScript types
│   │   ├── services/      # Firebase integration (shared)
│   │   └── game-engine/   # Base game engine
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── mobile/                # 📱 React Native mobile app
│   ├── src/
│   │   ├── screens/       # Mobile screens
│   │   ├── navigation/    # React Navigation
│   │   ├── games/         # Mobile-optimized games
│   │   └── config/        # Firebase config
│   ├── App.tsx
│   ├── package.json
│   ├── README.md          # Mobile setup guide
│   └── QUICKSTART.md      # Quick start guide
│
├── docs/                  # Documentation
├── public/                # Static assets
└── INSTRUCTIONS.md        # Development guidelines
```

## 🎮 Playing Games

### Pong (Available Now!)

Classic two-player paddle game where you compete against an AI opponent.

**Controls:**
- `W` or `↑` - Move paddle up
- `S` or `↓` - Move paddle down
- `SPACE` - Start/Pause
- `ESC` - Exit to menu

**How to Play:**
1. Navigate to the home page
2. Click on the Pong game card
3. Press SPACE to start
4. First to 11 points wins!

See [src/games/pong/README.md](src/games/pong/README.md) for detailed information about Pong and expansion possibilities.

## 🏗️ Architecture Principles

This project follows industry best practices:

### Clean Code
- Self-documenting code with clear naming
- Comprehensive TypeScript types
- Consistent code style with ESLint and Prettier

### DRY (Don't Repeat Yourself)
- Shared game engine components
- Reusable UI components
- Centralized configuration

### KISS (Keep It Simple, Stupid)
- Simple, straightforward architecture
- No over-engineering
- Clear separation of concerns

### Separation of Concerns
- **Platform Layer**: Navigation, profiles, leaderboards
- **Game Layer**: Individual game implementations
- **Shared Layer**: Common utilities and components
- **Data Layer**: Storage management

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed architecture documentation.

## 🎨 Adding New Games

Each game follows a standardized structure:

```typescript
games/your-game/
├── Game.tsx          // Main game component
├── GameCanvas.tsx    // Canvas rendering
├── config.ts         // Game configuration
├── gameLogic.ts      // Pure game logic
├── types.ts          // Type definitions
└── README.md         // Documentation
```

Steps to add a new game:

1. Create game folder in `src/games/`
2. Implement game logic using shared utilities
3. Add game metadata to `src/platform/services/gamesData.ts`
4. Register game in `src/platform/pages/GamePage.tsx`
5. Create expansion documentation in README.md

## 🔧 Configuration

### Game Configuration
All game constants should be centralized in `config.ts` files for easy tuning.

### Tailwind CSS
Custom theme variables are defined in `src/index.css` using Tailwind v4's `@theme` directive.

### TypeScript
Strict mode enabled with path aliases:
- `@/*` - src/
- `@platform/*` - src/platform/
- `@games/*` - src/games/
- `@shared/*` - src/shared/

## 📊 Features Roadmap

### Phase 1: Core Platform ✅
- [x] Project setup with modern stack
- [x] Platform UI (Home, Profile, Leaderboard)
- [x] Game infrastructure
- [x] First game (Pong) implementation

### Phase 2: More Games 🚧
- [ ] Connect 4
- [ ] Battleships
- [ ] Solitaire
- [ ] Spider Solitaire
- [ ] Hill Climb Racing
- [ ] Tetris

### Phase 3: Enhanced Features 📋
- [ ] Reviews and ratings system
- [ ] Activity feed
- [ ] Achievement badges
- [ ] Social features
- [ ] Sound effects and music

### Phase 4: Advanced Features ✅
- [x] PWA support for offline play
- [x] Multiplayer (WebRTC)
- [x] Mobile app (React Native) - **Available Now!**
- [x] Firebase backend integration
- [ ] Tournament mode
- [ ] Advanced analytics

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the architecture principles (Clean Code, DRY, KISS, SoC)
2. Maintain type safety with TypeScript
3. Add tests for new features
4. Update documentation
5. Follow existing code style

## 📄 License

MIT License - feel free to use this project for learning or as a foundation for your own game platform.

## 🙏 Acknowledgments

- Built with React 19 and Vite 6
- Styled with Tailwind CSS v4
- Inspired by classic games and modern web technologies

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check [INSTRUCTIONS.md](INSTRUCTIONS.md) for development guidelines
- Review game-specific READMEs for expansion ideas

---

**Status:** 🚀 Active Development | **Version:** 1.0.0-alpha | **Last Updated:** 2025-11-18

Made with ❤️ using the latest web technologies
