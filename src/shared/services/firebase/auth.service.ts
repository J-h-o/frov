/**
 * Firebase Authentication Service
 *
 * Provides methods for user authentication:
 * - Google Sign-In
 * - Email/Password Sign-In
 * - Anonymous Sign-In (for guest users)
 * - Sign-Out
 * - Auth state observer
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { getAuthInstance, isFirebaseInitialized } from './firebase';

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  const provider = new GoogleAuthProvider();

  // Optional: Add scopes if needed
  // provider.addScope('profile');
  // provider.addScope('email');

  return await signInWithPopup(auth, provider);
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Create new user with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update profile with display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  return userCredential;
};

/**
 * Sign in anonymously (for guest users)
 * This allows users to play without creating an account
 * Data can be migrated later if they create an account
 */
export const signInAnonymouslyAsGuest = async (): Promise<UserCredential> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  return await signInAnonymously(auth);
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  await firebaseSignOut(auth);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase not initialized');
  }

  const auth = getAuthInstance();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user signed in');
  }

  await updateProfile(user, updates);
};

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase not initialized, cannot observe auth state');
    return () => {};
  }

  const auth = getAuthInstance();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  if (!isFirebaseInitialized()) {
    return null;
  }

  const auth = getAuthInstance();
  return auth.currentUser;
};

/**
 * Check if user is signed in
 */
export const isSignedIn = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Check if current user is anonymous
 */
export const isAnonymous = (): boolean => {
  const user = getCurrentUser();
  return user?.isAnonymous ?? false;
};
