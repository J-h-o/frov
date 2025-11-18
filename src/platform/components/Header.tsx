/**
 * Platform header with navigation
 * Clean, simple navigation following KISS principle
 * Includes Firebase authentication UI
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'

export const Header = () => {
  const location = useLocation()
  const { user, isLoggedIn, useFirebase, loginWithGoogle, logout } = useUserStore()
  const [showAuthMenu, setShowAuthMenu] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle()
      setShowAuthMenu(false)
    } catch (error) {
      console.error('Sign-in failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowAuthMenu(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-game-card border-b border-gray-700 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🎮</span>
            <span className="text-2xl font-game font-bold text-gradient">FROV</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`font-semibold transition-colors ${
                isActive('/') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Games
            </Link>
            <Link
              to="/leaderboard"
              className={`font-semibold transition-colors ${
                isActive('/leaderboard') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className={`font-semibold transition-colors ${
                isActive('/profile') ? 'text-primary-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* User info & Auth */}
          <div className="relative">
            <button
              onClick={() => setShowAuthMenu(!showAuthMenu)}
              className="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-2xl">{user?.avatar}</span>
              <span className="font-semibold">{user?.username}</span>
              {useFirebase && !isLoggedIn && (
                <span className="text-xs text-gray-400">(Guest)</span>
              )}
            </button>

            {/* Auth dropdown menu */}
            {showAuthMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-game-card border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4">
                  {useFirebase ? (
                    <>
                      {!isLoggedIn ? (
                        <>
                          <p className="text-sm text-gray-400 mb-3">
                            Sign in to sync your progress across devices
                          </p>
                          <button
                            onClick={handleGoogleSignIn}
                            className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                          >
                            <span>🔐</span>
                            <span>Sign in with Google</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Your guest progress will be preserved
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="mb-3">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="font-semibold">{user?.email || user?.username}</p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Sign Out
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">
                      <p className="mb-2">Running in offline mode</p>
                      <p className="text-xs">
                        Configure Firebase to enable cloud sync and global leaderboards
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showAuthMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowAuthMenu(false)}
        />
      )}
    </header>
  )
}
