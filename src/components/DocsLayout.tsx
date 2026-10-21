import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { ArrowRightIcon } from './Icons'

export const docsNav = [
  {
    title: 'Getting started',
    items: [
      { to: '/docs', label: 'Installation', file: 'Installation' },
      { to: '/docs/usage', label: 'Usage', file: 'Usage' }
    ]
  },
  {
    title: 'Reference',
    items: [
      { to: '/docs/api', label: 'API', file: 'Api' },
      { to: '/docs/data', label: 'Character data', file: 'Data' }
    ]
  },
  {
    title: 'Guides',
    items: [
      { to: '/docs/guides', label: 'Recipes', file: 'Guides' }
    ]
  }
]

const flat = docsNav.flatMap(s => s.items)

export default function DocsLayout () {
  return (
    <div className='mx-auto flex max-w-6xl gap-10 px-4 sm:px-6'>
      <aside className='hidden w-48 shrink-0 md:block'>
        <nav className='sticky top-14 space-y-7 py-10' aria-label='Documentation'>
          {docsNav.map(section => (
            <div key={section.title}>
              <p className='mb-2 text-xs font-medium uppercase tracking-wider text-muted'>{section.title}</p>
              <ul className='space-y-0.5 border-l border-border'>
                {section.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        `-ml-px block border-l py-1 pl-3 text-sm transition-colors ${isActive ? 'border-primary font-medium text-text' : 'border-transparent text-muted hover:border-muted hover:text-text'}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className='min-w-0 flex-1'>
        <MobileDocsNav />
        <Outlet />
      </div>
    </div>
  )
}

function MobileDocsNav () {
  return (
    <nav className='-mx-4 flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden' aria-label='Documentation'>
      {flat.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => `shrink-0 rounded-md px-2.5 py-1 text-sm ${isActive ? 'bg-surface font-medium text-text' : 'text-muted'}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export interface TocItem { id: string, label: string, depth?: 2 | 3 }

interface DocPageProps {
  title: string
  lead?: ReactNode
  toc?: TocItem[]
  children: ReactNode
}

export function DocPage ({ title, lead, toc, children }: DocPageProps) {
  const { pathname } = useLocation()
  const index = flat.findIndex(i => i.to === pathname)
  const prev = index > 0 ? flat[index - 1] : null
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null

  return (
    <div className='flex gap-10'>
      <article className='min-w-0 flex-1 py-10'>
        <header className='mb-10'>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          {lead && <p className='mt-3 max-w-[65ch] text-[17px] leading-7 text-muted'>{lead}</p>}
        </header>
        <div className='prose-doc'>{children}</div>
        <footer className='mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-sm'>
          {prev
            ? <Link to={prev.to} className='group'><span className='block text-muted'>Previous</span><span className='font-medium group-hover:text-primary'>{prev.label}</span></Link>
            : <span />}
          {next && (
            <Link to={next.to} className='group text-right'>
              <span className='block text-muted'>Next</span>
              <span className='inline-flex items-center gap-1 font-medium group-hover:text-primary'>{next.label}<ArrowRightIcon width={14} height={14} /></span>
            </Link>
          )}
        </footer>
      </article>
      {toc && toc.length > 0 && (
        <aside className='hidden w-44 shrink-0 xl:block'>
          <nav className='sticky top-14 py-10 text-sm' aria-label='On this page'>
            <p className='mb-2 text-xs font-medium uppercase tracking-wider text-muted'>On this page</p>
            <ul className='space-y-1.5'>
              {toc.map(item => (
                <li key={item.id} className={item.depth === 3 ? 'pl-3' : ''}>
                  <a href={`#${item.id}`} className='text-muted hover:text-text'>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  )
}

/** A heading with a hover anchor link. */
export function H ({ id, level = 2, children }: { id: string, level?: 2 | 3, children: ReactNode }) {
  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag id={id} className='group relative scroll-mt-20'>
      {children}
      <a href={`#${id}`} className='ml-2 text-muted no-underline opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100' aria-label='Link to this section'>#</a>
    </Tag>
  )
}
