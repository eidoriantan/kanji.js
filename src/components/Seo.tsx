import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { findPage, headTags, pageTitle } from '../lib/pages'

/**
 * Keeps the title and per-page <head> tags in sync with the current route.
 * Prerendered pages already ship these tags (marked data-seo), so this only
 * changes anything after client-side navigation, or in the dev server.
 */
export default function Seo () {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = findPage(pathname)
    document.title = pageTitle(page)
    document.head.querySelectorAll('[data-seo]').forEach(el => el.remove())
    for (const { tag, attrs, content } of headTags(page)) {
      const el = document.createElement(tag)
      for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value)
      if (content) el.textContent = content
      el.setAttribute('data-seo', '')
      document.head.append(el)
    }
  }, [pathname])

  return null
}
