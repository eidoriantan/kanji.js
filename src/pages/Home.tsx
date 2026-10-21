import { useState } from 'react'
import { Link } from 'react-router'
import Seo from '../components/Seo'
import KanjiCard from '../components/KanjiCard'
import CodeBlock from '../components/CodeBlock'
import CopyButton from '../components/CopyButton'
import { ArrowRightIcon } from '../components/Icons'
import { SAMPLE_DAY } from '../lib/kanji'
import { CDN_URL, LIB_VERSION, STATS } from '../lib/site'

const installs = {
  npm: 'npm install kanji.js',
  CDN: `<script src="${CDN_URL}"></script>`
}

const features = [
  {
    title: `${STATS.total.toLocaleString('en-US')} characters`,
    body: 'The full KANJIDIC2 dictionary ships with the library. You get meanings, on and kun readings, stroke counts, school grades, JLPT levels and frequency ranks, with no network requests.'
  },
  {
    title: 'Fuzzy search',
    body: 'Rank characters by English meaning or by reading typed in romaji, and filter them by school grade or JLPT level, using exact values or ranges.'
  },
  {
    title: 'Runs anywhere',
    body: 'One UMD build that works in Node.js, bundlers and plain <script> tags. TypeScript types are included, and there is no setup step.'
  }
]

const example = `import Kanji from 'kanji.js'

Kanji.getDetails('気')
// { literal: '気', meanings: ['spirit', 'mind', …], … }

Kanji.search({ meaning: 'counter for days', grade: 1 })[0]
// { literal: '日', onyomi: ['ニチ', 'ジツ'], … }

Kanji.random()
// a random entry from the dictionary`

export default function Home () {
  const [tab, setTab] = useState<keyof typeof installs>('npm')

  return (
    <>
      <Seo />
      <section className='mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 md:grid-cols-[1fr_auto] md:pt-24'>
        <div className='min-w-0'>
          <Link
            to='/downloads'
            className='inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-muted hover:text-text'
          >
            <span className='size-1.5 rounded-full bg-primary' aria-hidden='true' />
            v{LIB_VERSION} · MIT License
          </Link>
          <h1 className='mt-6 max-w-[18ch] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl'>
            <span className='jp text-primary' lang='ja'>漢字</span> search and lookup for JavaScript
          </h1>
          <p className='mt-5 max-w-[52ch] text-lg leading-8 text-muted'>
            kanji.js is a small, open-source library that searches and looks up Japanese kanji characters in Node.js and in the browser.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link to='/docs' className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-opacity hover:opacity-90'>
              Get started <ArrowRightIcon width={16} height={16} />
            </Link>
            <Link to='/playground' className='inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface'>
              Try the playground
            </Link>
          </div>

          <div className='mt-10 max-w-xl'>
            <div className='flex gap-4 text-sm' role='tablist' aria-label='Install method'>
              {(Object.keys(installs) as (keyof typeof installs)[]).map(key => (
                <button
                  key={key}
                  type='button'
                  role='tab'
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={`border-b-2 pb-1.5 transition-colors ${tab === key ? 'border-primary font-medium text-text' : 'border-transparent text-muted hover:text-text'}`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className='mt-3 flex items-center gap-2 rounded-lg border border-border bg-code-bg py-1.5 pl-4 pr-1.5' role='tabpanel'>
              <code className='min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px]'>
                {tab === 'npm' && <span className='select-none text-muted'>$ </span>}
                {installs[tab]}
              </code>
              <CopyButton text={installs[tab]} />
            </div>
          </div>
        </div>

        <div className='w-full md:w-80'>
          <KanjiCard word={SAMPLE_DAY} />
          <p className='mt-3 text-center font-mono text-xs text-muted'>Kanji.getDetails('日')</p>
        </div>
      </section>

      <section className='border-y border-border bg-surface'>
        <div className='mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3'>
          {features.map(f => (
            <div key={f.title}>
              <h2 className='font-bold'>{f.title}</h2>
              <p className='mt-2 text-[15px] leading-7 text-muted'>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='mx-auto grid max-w-6xl gap-10 px-4 pt-20 sm:px-6 md:grid-cols-[2fr_3fr] md:items-start'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Four static methods. Nothing to configure.</h2>
          <p className='mt-4 text-[15px] leading-7 text-muted'>
            Import the class and call its methods directly. The dictionary is bundled, so results come back synchronously as plain objects.
          </p>
          <ul className='mt-6 space-y-2 font-mono text-sm'>
            {['getDetails(character)', 'search(options)', 'random()', 'dump()'].map(m => (
              <li key={m}>
                <Link to={`/docs/api#${m.split('(')[0].toLowerCase()}`} className='hover:text-primary'>Kanji.{m}</Link>
              </li>
            ))}
          </ul>
          <Link to='/docs/api' className='mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'>
            Read the API reference <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
        <div className='min-w-0'>
          <CodeBlock code={example} />
        </div>
      </section>
    </>
  )
}
