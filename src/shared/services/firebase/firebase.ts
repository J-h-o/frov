/**
 * Firebase Initialization
 *
 * This file initializes Firebase services for the application.
 * Services initialized:
 * - Firebase App
 * - Firebase Authentication
 * - Firestore Database
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase services
 * Returns whether initialization was successful
 */
export const initializeFirebase = (): boolean => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase is not configured. Please set up environment variables.');
    return false;
  }

  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);

    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);

    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return false;
  }
};

/**
 * Get Firebase Auth instance
 */
export const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

/**
 * Get Firestore instance
 */
export const getFirestoreInstance = (): Firestore => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
};

/**
 * Check if Firebase is initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return !!(app && auth && db);
};
