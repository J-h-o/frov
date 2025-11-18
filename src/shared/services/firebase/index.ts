/**
 * Firebase Services Barrel Export
 *
 * Central export point for all Firebase services
 */

// Firebase initialization
export {
  initializeFirebase,
  isFirebaseInitialized,
  getAuthInstance,
  getFirestoreInstance,
} from './firebase';

export { firebaseConfig, isFirebaseConfigured } from './config';

// Authentication services
export {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInAnonymouslyAsGuest,
  signOut,
  updateUserProfile,
  onAuthStateChange,
  getCurrentUser,
  isSignedIn,
  isAnonymous,
} from './auth.service';

// Firestore services
export {
  // User profile
  saveUserProfile,
  getUserProfile,
  updateLastLogin,
  // User stats
  saveUserStats,
  getUserStats,
  updateGameStats,
  addSavedGame,
  removeSavedGame,
  getSavedGames,
  // Leaderboards
  submitScore,
  getGameLeaderboard,
  subscribeToGameLeaderboard,
  getGlobalLeaderboard,
  subscribeToGlobalLeaderboard,
  // Reviews
  submitReview,
  getGameReviews,
  deleteReview,
} from './firestore.service';

// Types
export type {
  FirestoreUser,
  FirestoreUserStats,
  LeaderboardEntry,
  GameLeaderboard,
  GlobalLeaderboardEntry,
  Review,
} from './firestore.service';
