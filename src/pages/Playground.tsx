import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import Seo from '../components/Seo'
import KanjiCard from '../components/KanjiCard'
import CodeBlock from '../components/CodeBlock'
import { loadKanji, type KanjiLib, type RangeOption, type SearchOptions, type Word } from '../lib/kanji'
import { STATS } from '../lib/site'

type Tab = 'search' | 'lookup' | 'random'
type FilterMode = 'any' | 'exact' | 'range'

interface FilterState { mode: FilterMode, exact: string, min: string, max: string }

const PAGE = 60

const fieldBase = 'rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted/70 focus:border-primary focus:outline-none'
const inputClass = `w-full ${fieldBase}`
const labelClass = 'mb-1.5 block text-sm font-medium'

function toFilter (f: FilterState): number | RangeOption | undefined {
  if (f.mode === 'exact' && f.exact !== '') return Number(f.exact)
  if (f.mode === 'range') {
    const range: RangeOption = {}
    if (f.min !== '') range.min = Number(f.min)
    if (f.max !== '') range.max = Number(f.max)
    return Object.keys(range).length ? range : undefined
  }
  return undefined
}

function formatOptions (options: SearchOptions) {
  const parts = Object.entries(options).map(([key, value]) => {
    if (typeof value === 'string') return `${key}: '${value.replace(/'/g, "\\'")}'`
    if (typeof value === 'object') {
      const inner = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')
      return `${key}: { ${inner} }`
    }
    return `${key}: ${value}`
  })
  return parts.length ? `{ ${parts.join(', ')} }` : ''
}

function useKanji () {
  const [lib, setLib] = useState<KanjiLib | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    // The library is a class (a function), so wrap it to stop React calling it as an updater.
    loadKanji().then(l => alive && setLib(() => l), () => alive && setError(true))
    return () => { alive = false }
  }, [])

  return { lib, error }
}

export default function Playground () {
  const { lib, error } = useKanji()
  const [tab, setTab] = useState<Tab>('search')

  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>
      <Seo title='Playground' description='Try kanji.js in your browser: search the KANJIDIC2 dictionary by meaning, romaji, grade and JLPT level.' />
      <header className='max-w-[65ch]'>
        <h1 className='text-3xl font-bold tracking-tight'>Playground</h1>
        <p className='mt-3 text-[17px] leading-7 text-muted'>
          Try kanji.js in your browser. Everything runs on this page with the same library you install from npm, and each panel shows
          the code it runs.
        </p>
      </header>

      <div className='mt-8 flex gap-6 border-b border-border text-sm' role='tablist' aria-label='Playground mode'>
        {([['search', 'Search'], ['lookup', 'Look up'], ['random', 'Random']] as const).map(([key, label]) => (
          <button
            key={key}
            type='button'
            role='tab'
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2.5 transition-colors ${tab === key ? 'border-primary font-medium text-text' : 'border-transparent text-muted hover:text-text'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className='mt-8'>
        {error
          ? <p className='text-sm text-primary'>The dictionary failed to load. Check your connection and reload the page.</p>
          : !lib
              ? <Loading />
              : (
                <>
                  <div role='tabpanel' id='panel-search' aria-labelledby='tab-search' hidden={tab !== 'search'}><SearchPanel lib={lib} /></div>
                  <div role='tabpanel' id='panel-lookup' aria-labelledby='tab-lookup' hidden={tab !== 'lookup'}><LookupPanel lib={lib} /></div>
                  <div role='tabpanel' id='panel-random' aria-labelledby='tab-random' hidden={tab !== 'random'}><RandomPanel lib={lib} /></div>
                </>
                )}
      </div>
    </div>
  )
}

function Loading () {
  return (
    <div className='flex items-center gap-3 text-sm text-muted' role='status'>
      <span className='size-4 animate-spin rounded-full border-2 border-border border-t-primary' aria-hidden='true' />
      Loading the dictionary ({STATS.sizeMB} MB, {STATS.total.toLocaleString('en-US')} characters)…
    </div>
  )
}

function FilterField ({ id, label, hint, value, onChange, max }: {
  id: string
  label: string
  hint: ReactNode
  value: FilterState
  onChange: (v: FilterState) => void
  max: number
}) {
  const num = (field: 'exact' | 'min' | 'max', placeholder: string) => (
    <input
      id={`${id}-${field}`}
      type='number'
      inputMode='numeric'
      min={1}
      max={max}
      placeholder={placeholder}
      aria-label={`${label} ${placeholder}`}
      value={value[field]}
      onChange={e => onChange({ ...value, [field]: e.target.value })}
      className={`${fieldBase} w-20`}
    />
  )

  return (
    <div>
      <label htmlFor={`${id}-mode`} className={labelClass}>{label}</label>
      <div className='flex flex-wrap gap-2'>
        <select
          id={`${id}-mode`}
          value={value.mode}
          onChange={e => onChange({ ...value, mode: e.target.value as FilterMode })}
          className={`${fieldBase} w-auto`}
        >
          <option value='any'>Any</option>
          <option value='exact'>Exactly</option>
          <option value='range'>Range</option>
        </select>
        {value.mode === 'exact' && num('exact', 'value')}
        {value.mode === 'range' && <>{num('min', 'min')}{num('max', 'max')}</>}
      </div>
      <p className='mt-1.5 text-xs text-muted'>{hint}</p>
    </div>
  )
}

function SearchPanel ({ lib }: { lib: KanjiLib }) {
  const [meaning, setMeaning] = useState('water')
  const [romaji, setRomaji] = useState('')
  const [grade, setGrade] = useState<FilterState>({ mode: 'range', exact: '', min: '1', max: '8' })
  const [jlpt, setJlpt] = useState<FilterState>({ mode: 'any', exact: '', min: '', max: '' })
  const [sort, setSort] = useState(true)

  const [results, setResults] = useState<Word[] | null>(null)
  const [ran, setRan] = useState<{ code: string, ms: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState(PAGE)
  const [selected, setSelected] = useState<Word | null>(null)

  const options = useMemo(() => {
    const o: SearchOptions = {}
    const g = toFilter(grade)
    const j = toFilter(jlpt)
    if (g !== undefined) o.grade = g
    if (j !== undefined) o.jlpt = j
    if (meaning.trim()) o.meaning = meaning.trim()
    if (romaji.trim()) o.romaji = romaji.trim()
    if (!sort) o.sort = false
    return o
  }, [meaning, romaji, grade, jlpt, sort])

  const code = `Kanji.search(${formatOptions(options)})`

  const run = (e?: FormEvent) => {
    e?.preventDefault()
    setBusy(true)
    // Let the busy state paint before the synchronous search blocks the thread.
    setTimeout(() => {
      const start = performance.now()
      const found = lib.search(options)
      const ms = performance.now() - start
      setResults(found)
      setRan({ code, ms })
      setShown(PAGE)
      setSelected(found[0] ?? null)
      setBusy(false)
    }, 16)
  }

  // Run the sample search once so the page opens with results.
  useEffect(() => { run() }, [])

  const hasHint = Boolean(options.meaning || options.romaji)

  return (
    <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]'>
      <div className='min-w-0 space-y-8'>
        <form onSubmit={run} className='space-y-5'>
          <div className='grid gap-5 sm:grid-cols-2'>
            <div>
              <label htmlFor='pg-meaning' className={labelClass}>Meaning</label>
              <input id='pg-meaning' className={inputClass} value={meaning} onChange={e => setMeaning(e.target.value)} placeholder='e.g. water' autoComplete='off' />
              <p className='mt-1.5 text-xs text-muted'>English. Ranks results by fuzzy match.</p>
            </div>
            <div>
              <label htmlFor='pg-romaji' className={labelClass}>Reading</label>
              <input id='pg-romaji' className={inputClass} value={romaji} onChange={e => setRomaji(e.target.value)} placeholder='e.g. mizu or みず' autoComplete='off' />
              <p className='mt-1.5 text-xs text-muted'>Romaji or kana. Ranks by on and kun readings.</p>
            </div>
            <FilterField id='pg-grade' label='Grade' value={grade} onChange={setGrade} max={10} hint={<>1–6 school, 8 jōyō, 9–10 jinmeiyō. <Link to='/docs/data#grade' className='underline'>Details</Link></>} />
            <FilterField id='pg-jlpt' label='JLPT level' value={jlpt} onChange={setJlpt} max={4} hint={<>Old scale: 4 is easiest, 1 is hardest. <Link to='/docs/data#jlpt' className='underline'>Details</Link></>} />
          </div>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
            <button
              type='submit'
              disabled={busy}
              className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60'
            >
              {busy ? 'Searching…' : 'Search'}
            </button>
            <label className='flex items-center gap-2 text-sm'>
              <input type='checkbox' id='pg-sort' checked={sort} onChange={e => setSort(e.target.checked)} className='size-4 accent-[var(--primary)]' />
              Sort by best match
            </label>
          </div>
          <CodeBlock code={code} />
        </form>

        {results && ran && (
          <section aria-live='polite' aria-busy={busy}>
            <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3'>
              <h2 className='font-bold'>
                {results.length.toLocaleString('en-US')} result{results.length === 1 ? '' : 's'}
              </h2>
              <span className='text-xs tabular-nums text-muted'>{ran.ms.toFixed(0)} ms</span>
            </div>
            {hasHint && results.length > 0 && (
              <p className='mt-3 text-xs text-muted'>
                Meaning and reading only change the order, so every character that passes the filters is listed. The best matches come first.
              </p>
            )}
            {results.length === 0
              ? <p className='mt-6 text-sm text-muted'>No characters pass these filters. Widen the grade or JLPT range.</p>
              : (
                <>
                  <ul className='mt-4 grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2'>
                    {results.slice(0, shown).map(w => (
                      <li key={w.literal}>
                        <button
                          type='button'
                          onClick={() => setSelected(w)}
                          aria-pressed={selected?.literal === w.literal}
                          className={`flex w-full flex-col items-center gap-1 rounded-lg border px-1 py-2.5 transition-colors ${selected?.literal === w.literal ? 'border-primary bg-primary/[0.06]' : 'border-border hover:border-muted'}`}
                        >
                          <span className='jp text-2xl leading-none' lang='ja'>{w.literal}</span>
                          <span className='w-full truncate text-center text-[11px] text-muted'>{w.meanings[0] ?? '—'}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {shown < results.length && (
                    <button
                      type='button'
                      onClick={() => setShown(s => s + PAGE)}
                      className='mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface'
                    >
                      Show {Math.min(PAGE, results.length - shown)} more
                    </button>
                  )}
                </>
                )}
          </section>
        )}
      </div>

      <aside className='lg:sticky lg:top-20 lg:self-start'>
        {selected
          ? (
            <div className='space-y-3'>
              <KanjiCard word={selected} />
              <p className='text-center font-mono text-xs text-muted'>Kanji.getDetails('{selected.literal}')</p>
            </div>
            )
          : <p className='text-sm text-muted'>Select a result to see its details.</p>}
      </aside>
    </div>
  )
}

function LookupPanel ({ lib }: { lib: KanjiLib }) {
  const [text, setText] = useState('今日は良い天気')

  const chars = useMemo(() => [...new Set([...text.trim()])], [text])
  const found = chars.map(ch => ({ ch, word: lib.getDetails(ch) }))
  const hits = found.filter(f => f.word)
  const misses = found.filter(f => !f.word).map(f => f.ch).filter(ch => ch.trim())

  return (
    <div className='space-y-8'>
      <div className='max-w-xl'>
        <label htmlFor='pg-lookup' className={labelClass}>Characters</label>
        <input id='pg-lookup' className={`${inputClass} jp text-base`} value={text} onChange={e => setText(e.target.value)} placeholder='Type or paste Japanese text' autoComplete='off' lang='ja' />
        <p className='mt-1.5 text-xs text-muted'>The page calls getDetails() once for each different character you enter.</p>
      </div>
      <CodeBlock code={chars.length ? chars.map(ch => `Kanji.getDetails('${ch}')`).join('\n') : "Kanji.getDetails('')"} />
      {hits.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {hits.map(({ ch, word }) => <KanjiCard key={ch} word={word!} />)}
        </div>
      )}
      {misses.length > 0 && (
        <p className='text-sm text-muted'>
          <code className='font-mono'>null</code> for <span className='jp text-text' lang='ja'>{misses.join(' ')}</span>.
          Kana, punctuation and Latin letters aren't in the dictionary.
        </p>
      )}
    </div>
  )
}

function RandomPanel ({ lib }: { lib: KanjiLib }) {
  const [word, setWord] = useState<Word>(() => lib.random())

  return (
    <div className='grid gap-8 md:grid-cols-[20rem_minmax(0,1fr)] md:items-start'>
      <KanjiCard word={word} />
      <div className='min-w-0 space-y-4'>
        <CodeBlock code='Kanji.random()' />
        <button
          type='button'
          onClick={() => setWord(lib.random())}
          className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90'
        >
          Pick another
        </button>
        <p className='max-w-[60ch] text-sm text-muted'>
          Most results are rare characters, since about 77% of the dictionary has no grade or JLPT level.{' '}
          <Link to='/docs/guides#random-from-level' className='text-primary underline'>Pick from one level instead</Link>.
        </p>
      </div>
    </div>
  )
}
