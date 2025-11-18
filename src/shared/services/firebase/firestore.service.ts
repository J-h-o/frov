/**
 * Firestore Database Service
 *
 * Handles all Firestore operations for:
 * - User profiles and stats
 * - Leaderboards (per-game and global)
 * - Game reviews
 *
 * Database Structure:
 * - users/{userId} - User profile data
 * - userStats/{userId} - User game statistics
 * - leaderboards/{gameId} - Per-game leaderboards (top 100)
 * - globalLeaderboard/allTime - Global leaderboard
 * - reviews/{reviewId} - Game reviews
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Unsubscribe,
} from 'firebase/firestore';
import { getFirestoreInstance, isFirebaseInitialized } from './firebase';
import type { User, GameStats } from '../../types';

// ============================================================================
// Types
// ============================================================================

export interface FirestoreUser {
  id: string;
  username: string;
  avatar: string;
  email?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface FirestoreUserStats {
  userId: string;
  stats: GameStats[];
  savedGames: string[];
  updatedAt: Timestamp;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  timestamp: Timestamp;
}

export interface GameLeaderboard {
  gameId: string;
  scores: LeaderboardEntry[];
  updatedAt: Timestamp;
}

export interface GlobalLeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  totalScore: number;
  gamesPlayed: number;
  timestamp: Timestamp;
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// ============================================================================
// User Profile Operations
// ============================================================================

/**
 * Create or update user profile
 */
export const saveUserProfile = async (user: Omit<User, 'stats'>): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const userRef = doc(db, 'users', user.id);

  const userData: FirestoreUser = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
  };

  await setDoc(userRef, userData, { merge: true });
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<FirestoreUser | null> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  return userDoc.exists() ? (userDoc.data() as FirestoreUser) : null;
};

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    lastLogin: serverTimestamp(),
  });
};

// ============================================================================
// User Stats Operations
// ============================================================================

/**
 * Save user statistics
 */
export const saveUserStats = async (userId: string, stats: GameStats[]): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);

  const statsData: Omit<FirestoreUserStats, 'savedGames'> = {
    userId,
    stats,
    updatedAt: Timestamp.now(),
  };

  await setDoc(statsRef, statsData, { merge: true });
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: string): Promise<GameStats[]> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);
  const statsDoc = await getDoc(statsRef);

  if (statsDoc.exists()) {
    const data = statsDoc.data() as FirestoreUserStats;
    return data.stats || [];
  }

  return [];
};

/**
 * Update stats for a specific game
 */
export const updateGameStats = async (
  userId: string,
  gameId: string,
  score: number
): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);

  // Get current stats
  const statsDoc = await getDoc(statsRef);
  let stats: GameStats[] = [];

  if (statsDoc.exists()) {
    stats = (statsDoc.data() as FirestoreUserStats).stats || [];
  }

  // Find or create game stats
  const gameStatIndex = stats.findIndex((s) => s.gameId === gameId);

  if (gameStatIndex >= 0) {
    // Update existing stats
    stats[gameStatIndex].totalPlays += 1;
    stats[gameStatIndex].highScore = Math.max(stats[gameStatIndex].highScore, score);
    stats[gameStatIndex].lastPlayed = new Date().toISOString();
  } else {
    // Create new stats
    stats.push({
      gameId,
      totalPlays: 1,
      highScore: score,
      lastPlayed: new Date().toISOString(),
      achievements: [],
    });
  }

  await setDoc(
    statsRef,
    {
      userId,
      stats,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

/**
 * Add game to saved games
 */
export const addSavedGame = async (userId: string, gameId: string): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);

  await setDoc(
    statsRef,
    {
      userId,
      savedGames: arrayUnion(gameId),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

/**
 * Remove game from saved games
 */
export const removeSavedGame = async (userId: string, gameId: string): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);

  await updateDoc(statsRef, {
    savedGames: arrayRemove(gameId),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get user's saved games
 */
export const getSavedGames = async (userId: string): Promise<string[]> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const statsRef = doc(db, 'userStats', userId);
  const statsDoc = await getDoc(statsRef);

  if (statsDoc.exists()) {
    const data = statsDoc.data() as FirestoreUserStats;
    return data.savedGames || [];
  }

  return [];
};

// ============================================================================
// Leaderboard Operations
// ============================================================================

/**
 * Submit score to game leaderboard
 */
export const submitScore = async (
  gameId: string,
  userId: string,
  username: string,
  avatar: string,
  score: number
): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const leaderboardRef = doc(db, 'leaderboards', gameId);

  // Get current leaderboard
  const leaderboardDoc = await getDoc(leaderboardRef);
  let scores: LeaderboardEntry[] = [];

  if (leaderboardDoc.exists()) {
    scores = (leaderboardDoc.data() as GameLeaderboard).scores || [];
  }

  // Find user's existing score
  const existingScoreIndex = scores.findIndex((entry) => entry.userId === userId);

  const newEntry: LeaderboardEntry = {
    userId,
    username,
    avatar,
    score,
    timestamp: Timestamp.now(),
  };

  if (existingScoreIndex >= 0) {
    // Update if new score is higher
    if (score > scores[existingScoreIndex].score) {
      scores[existingScoreIndex] = newEntry;
    }
  } else {
    // Add new entry
    scores.push(newEntry);
  }

  // Sort by score (descending) and keep top 100
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 100);

  // Save leaderboard
  await setDoc(leaderboardRef, {
    gameId,
    scores,
    updatedAt: Timestamp.now(),
  });

  // Also update global leaderboard
  await updateGlobalLeaderboard(userId, username, avatar);
};

/**
 * Get game leaderboard (top N scores)
 */
export const getGameLeaderboard = async (
  gameId: string,
  limitCount: number = 10
): Promise<LeaderboardEntry[]> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const leaderboardRef = doc(db, 'leaderboards', gameId);
  const leaderboardDoc = await getDoc(leaderboardRef);

  if (leaderboardDoc.exists()) {
    const data = leaderboardDoc.data() as GameLeaderboard;
    return (data.scores || []).slice(0, limitCount);
  }

  return [];
};

/**
 * Subscribe to game leaderboard updates (real-time)
 */
export const subscribeToGameLeaderboard = (
  gameId: string,
  callback: (scores: LeaderboardEntry[]) => void
): Unsubscribe => {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase not initialized');
    return () => {};
  }

  const db = getFirestoreInstance();
  const leaderboardRef = doc(db, 'leaderboards', gameId);

  return onSnapshot(leaderboardRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as GameLeaderboard;
      callback(data.scores || []);
    } else {
      callback([]);
    }
  });
};

/**
 * Update global leaderboard
 */
const updateGlobalLeaderboard = async (
  userId: string,
  username: string,
  avatar: string
): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();

  // Get user's total score across all games
  const stats = await getUserStats(userId);
  const totalScore = stats.reduce((sum, stat) => sum + stat.highScore, 0);
  const gamesPlayed = stats.length;

  const globalRef = doc(db, 'globalLeaderboard', 'allTime');
  const globalDoc = await getDoc(globalRef);

  let entries: GlobalLeaderboardEntry[] = [];

  if (globalDoc.exists()) {
    entries = (globalDoc.data() as { entries: GlobalLeaderboardEntry[] }).entries || [];
  }

  // Find or create user entry
  const userEntryIndex = entries.findIndex((entry) => entry.userId === userId);

  const newEntry: GlobalLeaderboardEntry = {
    userId,
    username,
    avatar,
    totalScore,
    gamesPlayed,
    timestamp: Timestamp.now(),
  };

  if (userEntryIndex >= 0) {
    entries[userEntryIndex] = newEntry;
  } else {
    entries.push(newEntry);
  }

  // Sort by total score and keep top 100
  entries.sort((a, b) => b.totalScore - a.totalScore);
  entries = entries.slice(0, 100);

  await setDoc(globalRef, {
    entries,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Get global leaderboard
 */
export const getGlobalLeaderboard = async (
  limitCount: number = 10
): Promise<GlobalLeaderboardEntry[]> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const globalRef = doc(db, 'globalLeaderboard', 'allTime');
  const globalDoc = await getDoc(globalRef);

  if (globalDoc.exists()) {
    const data = globalDoc.data() as { entries: GlobalLeaderboardEntry[] };
    return (data.entries || []).slice(0, limitCount);
  }

  return [];
};

/**
 * Subscribe to global leaderboard updates (real-time)
 */
export const subscribeToGlobalLeaderboard = (
  callback: (entries: GlobalLeaderboardEntry[]) => void
): Unsubscribe => {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase not initialized');
    return () => {};
  }

  const db = getFirestoreInstance();
  const globalRef = doc(db, 'globalLeaderboard', 'allTime');

  return onSnapshot(globalRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as { entries: GlobalLeaderboardEntry[] };
      callback(data.entries || []);
    } else {
      callback([]);
    }
  });
};

// ============================================================================
// Review Operations
// ============================================================================

/**
 * Submit a game review
 */
export const submitReview = async (
  gameId: string,
  userId: string,
  username: string,
  avatar: string,
  rating: number,
  comment: string
): Promise<string> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const reviewsRef = collection(db, 'reviews');

  // Check if user already reviewed this game
  const q = query(reviewsRef, where('gameId', '==', gameId), where('userId', '==', userId));
  const existingReviews = await getDocs(q);

  let reviewId: string;

  if (!existingReviews.empty) {
    // Update existing review
    reviewId = existingReviews.docs[0].id;
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  } else {
    // Create new review
    const newReviewRef = doc(reviewsRef);
    reviewId = newReviewRef.id;

    await setDoc(newReviewRef, {
      id: reviewId,
      gameId,
      userId,
      username,
      avatar,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  }

  return reviewId;
};

/**
 * Get reviews for a game
 */
export const getGameReviews = async (gameId: string): Promise<Review[]> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const reviewsRef = collection(db, 'reviews');

  const q = query(reviewsRef, where('gameId', '==', gameId), orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as Review);
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  if (!isFirebaseInitialized()) throw new Error('Firebase not initialized');

  const db = getFirestoreInstance();
  const reviewRef = doc(db, 'reviews', reviewId);

  await deleteDoc(reviewRef);
};
