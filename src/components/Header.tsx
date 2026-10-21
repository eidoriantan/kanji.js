import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { REPO_URL } from '../lib/site'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { CloseIcon, GitHubIcon, MenuIcon } from './Icons'

const links = [
  { to: '/docs', label: 'Docs' },
  { to: '/playground', label: 'Playground' },
  { to: '/downloads', label: 'Downloads' }
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm transition-colors ${isActive ? 'font-medium text-text' : 'text-muted hover:text-text'}`

export default function Header () {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className='sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/75'>
      <div className='mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6'>
        <Logo />
        <nav className='ml-6 hidden items-center gap-1 md:flex' aria-label='Main'>
          {links.map(l => <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>)}
        </nav>
        <div className='ml-auto flex items-center gap-1'>
          <a
            href={REPO_URL}
            className='inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text'
            aria-label='GitHub repository'
            title='GitHub repository'
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
          <button
            type='button'
            className='inline-flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text md:hidden'
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls='mobile-nav'
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav id='mobile-nav' className='border-t border-border px-4 py-2 md:hidden' aria-label='Main'>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `block rounded-md px-2 py-2.5 text-[15px] ${isActive ? 'font-medium text-text' : 'text-muted'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
