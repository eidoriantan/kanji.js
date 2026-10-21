// Renders every page in src/lib/pages.ts to static HTML in dist/, so crawlers
// and link previews get real content and per-page tags. Runs after the client
// build and the SSR build of src/entry-server.tsx (see "build" in package.json).
//
// GitHub Pages serves /docs/usage from docs/usage.html, and redirects to
// /docs/ when a docs/ directory exists, so /docs is written both ways.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const DIST = 'dist'
const SSR_DIST = 'dist-ssr'

const { render, PAGES, NOT_FOUND, LEGACY, headTags, pageTitle } = await import(`../${SSR_DIST}/entry-server.js`)
const template = await readFile(join(DIST, 'index.html'), 'utf8')

const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderTag ({ tag, attrs, content }) {
  const attributes = Object.entries(attrs).map(([k, v]) => ` ${k}="${escape(v)}"`).join('')
  return tag === 'meta' || tag === 'link'
    ? `<${tag}${attributes} data-seo />`
    : `<${tag}${attributes} data-seo>${content ?? ''}</${tag}>`
}

async function page (meta, renderPath = meta.path) {
  const app = await render(renderPath)
  const head = headTags(meta).map(t => `    ${renderTag(t)}`).join('\n')
  // Function replacements, so "$" in the page (code samples) isn't a pattern.
  const html = template
    .replace(/<title>.*?<\/title>/s, () => `<title>${escape(pageTitle(meta))}</title>`)
    .replace(/\s*<\/head>/, () => `\n${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${app}</div>`)
  if (html === template) throw new Error('index.html is missing the markers prerender.mjs expects')
  return html
}

async function write (file, html) {
  const path = join(DIST, file)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, html)
}

const files = new Map()
const dirs = new Set(PAGES.map(p => dirname(p.path)))
for (const meta of PAGES) {
  const html = await page(meta)
  if (meta.path === '/') {
    files.set('index.html', html)
    continue
  }
  files.set(`${meta.path.slice(1)}.html`, html)
  if (dirs.has(meta.path)) files.set(`${meta.path.slice(1)}/index.html`, html)
}

// Old Jekyll URLs get a copy of the page they moved to. Its canonical tag points
// at the new URL, and main.tsx switches the address bar to it.
for (const [from, to] of Object.entries(LEGACY)) {
  const file = from.slice(1)
  if (!files.has(file)) files.set(file, files.get(to === '/' ? 'index.html' : `${to.slice(1)}.html`))
}

// GitHub Pages serves 404.html, with a 404 status, for any unknown path.
files.set('404.html', await page(NOT_FOUND, '/404'))

for (const [file, html] of files) await write(file, html)
await rm(SSR_DIST, { recursive: true, force: true })
console.log(`Prerendered ${files.size} files: ${[...files.keys()].join(', ')}`)
