# Frov Mobile - React Native Game Platform

A mobile gaming platform featuring classic arcade and puzzle games with cloud synchronization, leaderboards, and multiplayer capabilities.

## 📱 Features

- **8 Classic Games**: Pong, Tetris, Connect 4, Hill Climb Racing, Battleships, Solitaire, Spider Solitaire, and Fireboy & Watergirl (multiplayer)
- **Firebase Authentication**: Google Sign-In, Email/Password, and Guest mode
- **Cloud Leaderboards**: Global and game-specific rankings with real-time updates
- **User Profiles**: Track your stats, high scores, and game history
- **Cross-Platform**: iOS and Android support via React Native
- **Offline Mode**: Play without internet with local storage fallback

## 🎮 Available Games

### Currently Playable on Mobile
- **Pong** 🏓 - Classic arcade game with AI opponent
- **Tetris** 🧱 - Puzzle game with level progression
- **Connect 4** 🔴 - Strategy game with AI

### Coming Soon
- Hill Climb Racing 🏎️
- Battleships 🚢
- Solitaire ♠️
- Spider Solitaire ♦️
- Fireboy & Watergirl (Multiplayer) 🔥💧

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 14+ and iOS 13+ simulator or device
- Android: Android Studio with Android SDK 33+ and emulator or device
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Firebase**

   Copy the environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase configuration:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
   ```

3. **Add Google Services files (for native builds)**

   For Android:
   - Download `google-services.json` from Firebase Console
   - Place it in the `mobile/` directory

   For iOS:
   - Download `GoogleService-Info.plist` from Firebase Console
   - Place it in the `mobile/` directory

### Running the App

#### Development with Expo Go

Start the development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

#### iOS (Simulator/Device)

```bash
npm run ios
```

#### Android (Emulator/Device)

```bash
npm run android
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── config/           # Firebase and app configuration
│   ├── navigation/       # React Navigation setup
│   ├── screens/          # Main app screens
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── LeaderboardScreen.tsx
│   │   └── GameScreen.tsx
│   └── games/            # Mobile-optimized games
│       ├── PongGame.tsx
│       ├── TetrisGame.tsx
│       └── Connect4Game.tsx
├── assets/               # Images, fonts, icons
├── App.tsx              # Root component
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **State Management**: Zustand (shared with web app)
- **Backend**: Firebase (Auth + Firestore)
- **Canvas Rendering**: react-native-canvas
- **Multiplayer**: WebRTC (PeerJS)

## 🎨 Shared Code

The mobile app reuses significant code from the web platform:

- **Services** (`../src/platform/services/`) - Firebase and API calls
- **Store** (`../src/platform/store/`) - Zustand state management
- **Types** (`../src/shared/types/`) - TypeScript definitions
- **Game Logic** - Core game logic is platform-agnostic

This architecture ensures feature parity between web and mobile while minimizing code duplication.

## 🔥 Firebase Setup

### Enable Authentication

1. Go to Firebase Console → Authentication
2. Enable these sign-in methods:
   - Google (configure OAuth)
   - Email/Password
   - Anonymous

### Configure Firestore

1. Create a Firestore database in production mode
2. Update security rules (use `../firestore.rules` as reference)
3. Create these collections:
   - `users` - User profiles
   - `userStats` - Game statistics
   - `leaderboards` - Game scores
   - `reviews` - Game reviews

### Google Sign-In Setup

**Android:**
1. Get SHA-1 certificate fingerprint:
   ```bash
   cd android && ./gradlew signingReport
   ```
2. Add SHA-1 to Firebase Console → Project Settings → Android app
3. Download updated `google-services.json`

**iOS:**
1. Add iOS app in Firebase Console
2. Configure URL scheme in Xcode
3. Download `GoogleService-Info.plist`

## 📦 Building for Production

### iOS (requires Mac)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

### Android

1. Build APK:
   ```bash
   eas build --platform android --profile preview
   ```

2. Build AAB (for Play Store):
   ```bash
   eas build --platform android --profile production
   ```

## 🧪 Testing

### Run Type Checks
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

## 🐛 Troubleshooting

### Canvas not rendering
- Ensure `react-native-canvas` is properly installed
- Clear Metro bundler cache: `expo start -c`

### Firebase not connecting
- Verify `.env` file has correct values
- Check that `google-services.json` / `GoogleService-Info.plist` are present
- Ensure Firebase project has correct bundle IDs

### Google Sign-In not working
- Verify SHA-1 fingerprint is added to Firebase (Android)
- Check URL scheme configuration (iOS)
- Ensure Web Client ID is correct in `.env`

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `expo start -c`
- Update Expo: `expo upgrade`

## 🔐 Security Notes

- Never commit `.env`, `google-services.json`, or `GoogleService-Info.plist`
- Use Firebase Security Rules to protect data
- Validate all user inputs on the server side
- Keep dependencies updated

## 📱 Minimum Requirements

- iOS 13.0 or higher
- Android 5.0 (API 21) or higher
- ~100MB storage space
- Internet connection (for cloud features)

## 🤝 Contributing

The mobile app is part of the Frov project. To contribute:

1. Follow the main project's contribution guidelines
2. Ensure mobile-specific features work on both iOS and Android
3. Test on real devices, not just simulators
4. Maintain code sharing with the web platform

## 📄 License

Same license as the main Frov project.

## 🔗 Related

- **Web App**: `../src/` - Main web platform
- **Firebase Setup**: `../FIREBASE_SETUP.md`
- **Game Guide**: `../docs/GAME_EXPANSION_GUIDE.md`

## 🆘 Support

For issues specific to the mobile app, check:
1. This README's troubleshooting section
2. Expo documentation: https://docs.expo.dev
3. React Navigation docs: https://reactnavigation.org
4. Firebase docs: https://firebase.google.com/docs

---

Built with ❤️ using React Native and Expo
