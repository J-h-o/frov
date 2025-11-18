/**
 * Platform header with navigation
 * Clean, simple navigation following KISS principle
 */

import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '@platform/store/userStore'

export const Header = () => {
  const location = useLocation()
  const { user } = useUserStore()

  const isActive = (path: string) => location.pathname === path

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

          {/* User info */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{user?.avatar}</span>
            <span className="font-semibold">{user?.username}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
