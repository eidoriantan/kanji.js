import type { RouteObject } from 'react-router'
import Layout from './components/Layout'
import DocsLayout from './components/DocsLayout'
import Home from './pages/Home'
import Installation from './pages/docs/Installation'
import Usage from './pages/docs/Usage'
import Api from './pages/docs/Api'
import Data from './pages/docs/Data'
import Guides from './pages/docs/Guides'
import Playground from './pages/Playground'
import Downloads from './pages/Downloads'
import NotFound from './pages/NotFound'
import RouteError from './pages/RouteError'

// Shared by the browser entry (main.tsx) and the prerender entry (entry-server.tsx).
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'docs',
        element: <DocsLayout />,
        children: [
          { index: true, element: <Installation /> },
          { path: 'usage', element: <Usage /> },
          { path: 'api', element: <Api /> },
          { path: 'data', element: <Data /> },
          { path: 'guides', element: <Guides /> }
        ]
      },
      { path: 'playground', element: <Playground /> },
      { path: 'downloads', element: <Downloads /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]
