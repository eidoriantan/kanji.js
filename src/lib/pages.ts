import { AUTHOR_URL, LIB_VERSION, REPO_URL } from './site.ts'

/**
 * Every indexable page, with its metadata. The prerender step, the sitemap
 * (vite.config.ts) and the <Seo> component all read from this list, so a new
 * page only needs an entry here and a route in router.tsx.
 *
 * Kept free of DOM and JSX imports because vite.config.ts imports it.
 */

export const SITE_URL = 'https://kanji.js.org'
export const SITE_NAME = 'kanji.js'
export const AUTHOR = 'Adriane Justine Tan'

export interface PageMeta {
  path: string
  /** Shown before " · kanji.js". Leave out for the home page. */
  title?: string
  description: string
  /** The page's source file, used for the sitemap's lastmod. */
  source: string
  noindex?: boolean
  jsonLd?: object
}

const HOME_DESCRIPTION = 'kanji.js is an open-source JavaScript library to search and look up 漢字 (kanji) characters in Node.js and browsers, powered by KANJIDIC2.'

export const PAGES: PageMeta[] = [
  {
    path: '/',
    description: HOME_DESCRIPTION,
    source: 'src/pages/Home.tsx',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`
        },
        {
          '@type': 'SoftwareSourceCode',
          name: SITE_NAME,
          description: HOME_DESCRIPTION,
          url: `${SITE_URL}/`,
          codeRepository: REPO_URL,
          programmingLanguage: 'JavaScript',
          runtimePlatform: 'Node.js',
          version: LIB_VERSION,
          license: 'https://opensource.org/licenses/MIT',
          author: { '@type': 'Person', name: AUTHOR, url: AUTHOR_URL }
        }
      ]
    }
  },
  {
    path: '/docs',
    title: 'Installation',
    description: 'How to install kanji.js with npm, a CDN script tag, or a direct download.',
    source: 'src/pages/docs/Installation.tsx'
  },
  {
    path: '/docs/usage',
    title: 'Usage',
    description: 'Get started with kanji.js: importing the library and using getDetails, search, random and dump.',
    source: 'src/pages/docs/Usage.tsx'
  },
  {
    path: '/docs/api',
    title: 'API reference',
    description: 'Complete API reference for kanji.js: getDetails, search, random, dump, search options, ranking and TypeScript types.',
    source: 'src/pages/docs/Api.tsx'
  },
  {
    path: '/docs/data',
    title: 'Character data',
    description: 'What each field in a kanji.js entry means: readings, meanings, stroke count, school grade, JLPT level and frequency.',
    source: 'src/pages/docs/Data.tsx'
  },
  {
    path: '/docs/guides',
    title: 'Recipes',
    description: 'kanji.js examples: look up kanji in text, build JLPT study lists, random flashcards, exact reading matches, lazy loading and Web Workers.',
    source: 'src/pages/docs/Guides.tsx'
  },
  {
    path: '/playground',
    title: 'Playground',
    description: 'Try kanji.js in your browser: search the KANJIDIC2 dictionary by meaning, romaji, grade and JLPT level.',
    source: 'src/pages/Playground.tsx'
  },
  {
    path: '/downloads',
    title: 'Downloads',
    description: 'Download kanji.js releases, or install it from npm or a CDN.',
    source: 'src/pages/Downloads.tsx'
  }
]

export const NOT_FOUND: PageMeta = {
  path: '/404',
  title: 'Page not found',
  description: "This page doesn't exist or has moved.",
  source: 'src/pages/NotFound.tsx',
  noindex: true
}

/** Paths from the old Jekyll site, kept so existing links keep working. */
export const LEGACY: Record<string, string> = {
  '/index.html': '/',
  '/docs/index.html': '/docs',
  '/docs/usage.html': '/docs/usage',
  '/docs/kanji.html': '/docs/api',
  '/downloads/index.html': '/downloads'
}

/** Drops a trailing slash, so /docs/ and /docs are the same page. */
export function normalizePath (pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function findPage (pathname: string): PageMeta {
  const path = normalizePath(pathname)
  return PAGES.find(p => p.path === path) ?? NOT_FOUND
}

export function pageTitle (page: PageMeta) {
  return page.title ? `${page.title} · ${SITE_NAME}` : `${SITE_NAME} · 漢字 search and lookup for JavaScript`
}

export interface HeadTag {
  tag: 'meta' | 'link' | 'script'
  attrs: Record<string, string>
  content?: string
}

/** The per-page tags in <head>. Site-wide tags live in index.html. */
export function headTags (page: PageMeta): HeadTag[] {
  const title = pageTitle(page)
  const tags: HeadTag[] = [
    { tag: 'meta', attrs: { name: 'description', content: page.description } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: page.description } }
  ]
  if (page.noindex) {
    tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } })
  } else {
    const url = page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`
    tags.push(
      { tag: 'meta', attrs: { property: 'og:url', content: url } },
      { tag: 'link', attrs: { rel: 'canonical', href: url } }
    )
  }
  if (page.jsonLd) {
    // Escape "<" so the JSON can't close the script element early.
    const json = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, content: json })
  }
  return tags
}
