import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import Seo from './Seo'

function ScrollToTop () {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function Layout () {
  return (
    <div className='flex min-h-dvh flex-col'>
      <a href='#main' className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-on-primary'>
        Skip to content
      </a>
      <ScrollToTop />
      <Seo />
      <Header />
      <main id='main' className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
