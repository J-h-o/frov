/**
 * Main App component
 * Entry point for the application
 */

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { initializeFirebase } from '@shared/services/firebase'
import { useUserStore } from '@platform/store/userStore'

function App() {
  useEffect(() => {
    // Initialize Firebase on app startup
    const isFirebaseReady = initializeFirebase()

    if (isFirebaseReady) {
      console.log('Firebase initialized successfully')

      // Initialize auth state observer
      useUserStore.getState().initializeAuth()
    } else {
      console.log('Running in offline mode (Firebase not configured)')
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
