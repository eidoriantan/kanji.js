import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from './router'
import { LEGACY, normalizePath } from './lib/pages'
import './index.css'

// Legacy and trailing-slash URLs are served a copy of the page they point to
// (see scripts/prerender.mjs). Switch to the real path before hydrating so the
// router renders the same page as the HTML.
const { pathname, search, hash } = window.location
const path = LEGACY[pathname] ?? normalizePath(pathname)
if (path !== pathname) history.replaceState(null, '', path + search + hash)

const router = createBrowserRouter(routes)
const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

// Built pages are prerendered; the dev server serves an empty root.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
