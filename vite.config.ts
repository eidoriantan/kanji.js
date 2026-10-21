import { execFileSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { PAGES, SITE_URL } from './src/lib/pages.ts'

/** Date of the last commit that touched a file, or now if it isn't committed. */
function lastCommitDate (file: string) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf8' }).trim()
    if (date) return new Date(date)
  } catch {}
  return new Date()
}

const indexed = PAGES.filter(p => !p.noindex)

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Only the client build writes dist/. Routes come from src/lib/pages.ts
    // rather than a scan of dist/, which runs before prerendering and would
    // also pick up the legacy copies and 404.html.
    !isSsrBuild && sitemap({
      hostname: SITE_URL,
      dynamicRoutes: indexed.map(p => p.path),
      extensions: [],
      changefreq: 'monthly',
      priority: { '/': 1, '*': 0.8 },
      lastmod: Object.fromEntries(indexed.map(p => [p.path, lastCommitDate(p.source)])),
    })
  ],
  build: {
    // The kanji.js chunk carries the whole KANJIDIC2 dictionary (~1.9 MB) and
    // is only loaded by the playground.
    chunkSizeWarningLimit: 2000
  }
}))
