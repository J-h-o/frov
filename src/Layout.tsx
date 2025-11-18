/**
 * Main layout component
 * Wraps all pages with common header
 */

import { Outlet } from 'react-router-dom'
import { Header } from '@platform/components/Header'

export const Layout = () => {
  return (
    <div className="min-h-screen bg-game-bg">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
