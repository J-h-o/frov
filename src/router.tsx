/**
 * React Router configuration
 * Separation of concerns - routing logic separate from components
 */

import { createBrowserRouter } from 'react-router-dom'
import { Home } from '@platform/pages/Home'
import { Profile } from '@platform/pages/Profile'
import { Leaderboard } from '@platform/pages/Leaderboard'
import { GamePage } from '@platform/pages/GamePage'
import { Layout } from './Layout'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'leaderboard',
          element: <Leaderboard />,
        },
        {
          path: 'game/:gameId',
          element: <GamePage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL, // Use Vite's BASE_URL for GitHub Pages compatibility
  }
)
