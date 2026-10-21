import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { routes } from './router'
import { SITE_URL } from './lib/pages'

export { PAGES, NOT_FOUND, LEGACY, headTags, pageTitle } from './lib/pages'

const handler = createStaticHandler(routes)

/** Renders one path to HTML for scripts/prerender.mjs. */
export async function render (path: string) {
  const context = await handler.query(new Request(SITE_URL + path))
  if (context instanceof Response) throw new Error(`${path} returned a response, not a page`)
  const router = createStaticRouter(handler.dataRoutes, context)
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>
  )
}
