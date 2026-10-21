import { Link } from 'react-router'
import { AUTHOR_URL, EDRDG_LICENSE_URL, ISSUES_URL, KANJIDIC_URL, SITE_SOURCE_URL } from '../lib/site'

export default function Footer () {
  const year = new Date().getFullYear()

  return (
    <footer className='mt-24 border-t border-border'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:px-6 md:flex-row md:justify-between'>
        <div className='space-y-2'>
          <p>
            © 2020–{year} <a href={AUTHOR_URL} className='text-text hover:text-primary'>@eidoriantan</a>. Released under the{' '}
            <a href='/LICENSE.txt' className='text-text hover:text-primary'>MIT License</a>.
          </p>
          <p className='max-w-[60ch]'>
            Character data from <a href={KANJIDIC_URL} className='text-text hover:text-primary'>KANJIDIC2</a>, the property of the
            Electronic Dictionary Research and Development Group, used under its{' '}
            <a href={EDRDG_LICENSE_URL} className='text-text hover:text-primary'>licence</a>.
          </p>
        </div>
        <nav className='flex flex-wrap gap-x-5 gap-y-2' aria-label='Footer'>
          <Link to='/docs' className='hover:text-text'>Docs</Link>
          <Link to='/playground' className='hover:text-text'>Playground</Link>
          <Link to='/downloads' className='hover:text-text'>Downloads</Link>
          <a href={ISSUES_URL} className='hover:text-text'>Report an issue</a>
          <a href={SITE_SOURCE_URL} className='hover:text-text'>Site source</a>
        </nav>
      </div>
    </footer>
  )
}
