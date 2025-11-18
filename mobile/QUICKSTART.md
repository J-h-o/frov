# Frov Mobile - Quick Start Guide

Get up and running with Frov Mobile in 5 minutes!

## ⚡ Fast Setup (For Testing)

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Open on Your Device
- **iOS**: Scan QR code with Camera app, or press `i` for simulator
- **Android**: Scan QR code with Expo Go app, or press `a` for emulator

That's it! The app will work in **offline mode** without Firebase configuration.

## 🔥 Full Setup (With Firebase)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing Frov project
3. Add an iOS app and/or Android app
4. Download configuration files

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abc123
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123-abc.apps.googleusercontent.com
```

### Step 3: Add Google Services Files

**Android:**
```bash
# Download from Firebase Console → Project Settings → Android app
# Save as mobile/google-services.json
```

**iOS:**
```bash
# Download from Firebase Console → Project Settings → iOS app
# Save as mobile/GoogleService-Info.plist
```

### Step 4: Enable Firebase Services

In Firebase Console:
- **Authentication** → Enable Google, Email/Password, and Anonymous
- **Firestore** → Create database in production mode
- **Security Rules** → Use rules from `../firestore.rules`

### Step 5: Run the App

```bash
npm start
```

## 🎮 What You Get

### Without Firebase (Offline Mode)
- ✅ All games playable
- ✅ Local high scores
- ✅ Guest user profile
- ❌ Cloud sync
- ❌ Leaderboards
- ❌ Multi-device sync

### With Firebase (Full Features)
- ✅ All games playable
- ✅ Cloud-synced high scores
- ✅ Google Sign-In
- ✅ Global leaderboards
- ✅ Multi-device sync
- ✅ Game reviews & ratings

## 🎯 Quick Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run lint` | Check code quality |
| `npm run type-check` | Run TypeScript checks |

## 📱 Testing on Physical Device

### iOS (No Developer Account Needed)
1. Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. Run `npm start` in terminal
3. Scan QR code with Camera app
4. Opens in Expo Go automatically

### Android
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
2. Run `npm start` in terminal
3. Scan QR code with Expo Go app
4. App opens automatically

## 🐛 Common Issues

### "Unable to resolve module"
```bash
rm -rf node_modules
npm install
expo start -c
```

### "Canvas not rendering"
```bash
expo install react-native-canvas
expo start -c
```

### "Firebase error"
- Check `.env` file exists and has correct values
- Verify Firebase project is active
- Check internet connection

### "Google Sign-In not working"
- Add SHA-1 certificate to Firebase (Android)
- Configure URL scheme in Xcode (iOS)
- Use correct Web Client ID in `.env`

## 🎨 Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Bundle ID
Edit `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.app"
    },
    "android": {
      "package": "com.yourcompany.app"
    }
  }
}
```

### Change Colors
Edit screen files in `src/screens/` and update color codes:
- Primary: `#7c3aed` (purple)
- Background: `#0f0f23` (dark blue)
- Secondary: `#1a1a2e` (navy)

## 🚀 Next Steps

1. **Explore the Code**: Check `src/` directory structure
2. **Add More Games**: See `src/games/` for examples
3. **Customize UI**: Modify screen components
4. **Deploy**: Build production apps with `eas build`
5. **Read Full Docs**: Check `README.md` for detailed info

## 📚 Useful Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnavigation.org)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org)

## 💡 Pro Tips

1. **Use Expo Go** for fastest development iteration
2. **Enable hot reload** - changes appear instantly
3. **Use TypeScript** - catch errors before runtime
4. **Test on real devices** - simulators don't show all issues
5. **Check logs** - press `j` in Expo dev tools to open debugger

---

Happy coding! 🎮
