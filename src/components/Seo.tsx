import { useEffect } from 'react'
import { useLocation } from 'react-router'

const BASE_TITLE = 'kanji.js'

function setMeta (selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

export default function Seo ({ title, description }: { title?: string, description?: string }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const full = title ? `${title} · ${BASE_TITLE}` : `${BASE_TITLE} · 漢字 search and lookup for JavaScript`
    document.title = full
    setMeta('meta[property="og:title"]', 'content', full)
    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }
    const url = `https://kanji.js.org${pathname}`
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
  }, [title, description, pathname])

  return null
}
