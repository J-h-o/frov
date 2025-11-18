# Firebase Setup Guide for FROV

This guide will help you set up Firebase for authentication and cloud storage in your FROV game platform.

## Prerequisites

- A Google account
- Node.js and npm installed
- FROV project cloned and dependencies installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "FROV Game Platform")
4. (Optional) Enable Google Analytics if you want usage tracking
5. Click **"Create project"**
6. Wait for the project to be created, then click **"Continue"**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **web icon** (`</>`) to add a web app
2. Enter a nickname for your app (e.g., "FROV Web App")
3. **Check** the box for "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **keep this window open**

## Step 3: Configure Environment Variables

1. In your FROV project root, copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and fill in your Firebase configuration values from the Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
   ```

3. **Important:** Never commit the `.env` file to version control (it's already in `.gitignore`)

## Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **"Get started"**
3. Under **Sign-in method** tab, enable these providers:

### Enable Google Sign-In
- Click on **"Google"**
- Toggle **"Enable"**
- Select a support email from the dropdown
- Click **"Save"**

### Enable Email/Password (Optional)
- Click on **"Email/Password"**
- Toggle **"Enable"** for the first option (Email/Password)
- Click **"Save"**

### Enable Anonymous Sign-In
- Click on **"Anonymous"**
- Toggle **"Enable"**
- Click **"Save"**

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **"Create database"**
3. Select a location for your database (choose one close to your users)
4. Start in **"production mode"** (we'll add custom rules next)
5. Click **"Enable"**

## Step 6: Deploy Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with the contents of `firestore.rules` from your project
3. You can copy the rules from the file:
   ```bash
   cat firestore.rules
   ```
4. Paste the rules into the Firebase Console editor
5. Click **"Publish"**

**Important:** These rules ensure:
- Users can only edit their own data
- All users can read leaderboards and reviews
- Proper validation for all writes
- Protection against spam and abuse

## Step 7: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add these domains:
   - `localhost` (already added by default)
   - Your GitHub Pages domain: `j-h-o.github.io`
   - Any custom domains you plan to use

## Step 8: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173` (or your configured port)

3. Check the browser console for:
   ```
   Firebase initialized successfully
   ```

4. Click on your profile dropdown in the header
5. You should see **"Sign in with Google"** button
6. Try signing in with your Google account

## Step 9: Verify Data Storage

After signing in and playing a game:

1. Go to Firebase Console > **Firestore Database**
2. You should see these collections:
   - `users` - User profiles
   - `userStats` - User game statistics
   - `leaderboards` - Per-game leaderboards
   - `globalLeaderboard` - Global scores

## Free Tier Limits

Firebase Spark (free) plan includes:

### Firestore
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage
- ✅ 10 GB/month network egress

### Authentication
- ✅ Unlimited users
- ✅ 10,000 phone auth/month (if you enable it)

### Hosting (if you use it)
- ✅ 10 GB storage
- ✅ 360 MB/day bandwidth

**These limits are more than enough for a game platform with thousands of daily active users!**

## Staying Within Free Limits

The app is optimized to minimize Firebase usage:

1. **Caching:** Leaderboards are cached locally
2. **Batch Operations:** Multiple updates are combined
3. **Real-time Updates:** Only subscribe when viewing leaderboards
4. **Efficient Queries:** Limit queries to top 100 scores
5. **Local Storage Fallback:** Works offline without Firebase

## Troubleshooting

### "Firebase not initialized"
- Check that all environment variables are set in `.env`
- Restart your dev server after changing `.env`
- Make sure `.env` is in the project root

### "Permission denied" errors
- Verify you deployed the security rules from `firestore.rules`
- Check the Firebase Console for rule errors
- Make sure the user is authenticated for protected operations

### Google Sign-In popup blocked
- Allow popups for `localhost` in your browser
- Add your domain to Authorized domains in Firebase Console
- Try using a different browser

### Data not syncing
- Check browser console for errors
- Verify Firestore rules are published
- Make sure you're signed in (not anonymous)

## Deployment to GitHub Pages

When deploying to GitHub Pages:

1. Add your GitHub Pages domain to Firebase Authorized Domains:
   - `j-h-o.github.io`

2. Make sure your environment variables are set in your deployment environment

3. For GitHub Actions deployment, add Firebase config as secrets:
   - Go to GitHub repo > Settings > Secrets
   - Add each VITE_FIREBASE_* variable as a secret
   - Update `.github/workflows/deploy.yml` to use these secrets

## Optional: Firebase CLI Setup

For advanced usage (deploying rules, cloud functions, etc.):

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore (to manage rules locally)
# - Hosting (optional, for Firebase Hosting)

# Deploy rules
firebase deploy --only firestore:rules
```

## Database Structure

### Collections

```
users/{userId}
  ├─ id: string
  ├─ username: string
  ├─ avatar: string
  ├─ email: string (optional)
  ├─ createdAt: timestamp
  └─ lastLogin: timestamp

userStats/{userId}
  ├─ userId: string
  ├─ stats: array
  │   ├─ gameId: string
  │   ├─ totalPlays: number
  │   ├─ highScore: number
  │   ├─ lastPlayed: string
  │   └─ achievements: array
  ├─ savedGames: array
  └─ updatedAt: timestamp

leaderboards/{gameId}
  ├─ gameId: string
  ├─ scores: array (top 100)
  │   ├─ userId: string
  │   ├─ username: string
  │   ├─ avatar: string
  │   ├─ score: number
  │   └─ timestamp: timestamp
  └─ updatedAt: timestamp

globalLeaderboard/allTime
  ├─ entries: array (top 100)
  │   ├─ userId: string
  │   ├─ username: string
  │   ├─ avatar: string
  │   ├─ totalScore: number
  │   ├─ gamesPlayed: number
  │   └─ timestamp: timestamp
  └─ updatedAt: timestamp

reviews/{reviewId}
  ├─ id: string
  ├─ gameId: string
  ├─ userId: string
  ├─ username: string
  ├─ avatar: string
  ├─ rating: number (1-5)
  ├─ comment: string
  └─ createdAt: timestamp
```

## Next Steps

- 🎮 Play games and watch your scores sync to the cloud
- 🏆 Check the global leaderboard
- 👥 Share your game link with friends and compete
- 📊 Monitor usage in Firebase Console > Analytics
- 🔧 Customize security rules for your specific needs

## Support

If you encounter issues:
1. Check the Firebase Console for errors
2. Review the browser console for detailed error messages
3. Ensure all environment variables are correctly set
4. Verify security rules are deployed

---

**Congratulations! Your FROV platform now has cloud authentication and global leaderboards powered by Firebase!** 🎉
