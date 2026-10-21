import { useEffect, useState, type ReactNode } from 'react'
import CodeBlock from '../components/CodeBlock'
import { DownloadIcon, ExternalIcon } from '../components/Icons'
import { CDN_URL, RELEASES_URL, REPO } from '../lib/site'

interface Asset { name: string, size: number, browser_download_url: string }
interface Release {
  id: number
  name: string | null
  tag_name: string
  html_url: string
  published_at: string
  prerelease: boolean
  zipball_url: string
  body: string | null
  assets: Asset[]
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready', releases: Release[] }

const CACHE_KEY = 'releases:v1'
const COUNT = 5

async function fetchReleases (): Promise<Release[]> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) return JSON.parse(cached) as Release[]
  } catch {}

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=${COUNT}`, {
    headers: { Accept: 'application/vnd.github+json' }
  })
  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`)
  const releases = (await res.json()) as Release[]

  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(releases)) } catch {}
  return releases
}

/** The built package for a release: prefer the asset named after its version. */
function packageAsset (r: Release): Asset | undefined {
  const version = r.tag_name.replace(/^v/, '')
  return r.assets.find(a => a.name.includes(version)) ?? r.assets[0]
}

const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const sizeFormat = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`

/** Renders the simple bullet-list notes used in this project's releases. */
function Notes ({ body }: { body: string }) {
  const inline = (text: string): ReactNode[] =>
    text.split(/(`[^`]+`)/).map((part, i) =>
      part.startsWith('`') && part.endsWith('`')
        ? <code key={i} className='rounded bg-surface px-1 py-0.5 font-mono text-[0.85em]'>{part.slice(1, -1)}</code>
        : part
    )

  const items = body
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^[*-]\s+/.test(line))
    .map(line => line.replace(/^[*-]\s+/, ''))

  if (!items.length) return null
  return (
    <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-muted marker:text-border'>
      {items.map((item, i) => <li key={i}>{inline(item)}</li>)}
    </ul>
  )
}

export default function Downloads () {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    fetchReleases().then(
      releases => alive && setState({ status: 'ready', releases: releases.slice(0, COUNT) }),
      () => alive && setState({ status: 'error' })
    )
    return () => { alive = false }
  }, [])

  return (
    <div className='mx-auto max-w-3xl px-4 py-10 sm:px-6'>
      <header>
        <h1 className='text-3xl font-bold tracking-tight'>Downloads</h1>
        <p className='mt-3 max-w-[60ch] text-[17px] leading-7 text-muted'>
          Most projects should install kanji.js from npm or load it from a CDN. If you'd rather host the file yourself, download a built package below.
        </p>
      </header>

      <div className='mt-8 grid gap-3 sm:grid-cols-2'>
        <CodeBlock lang='shell' title='npm' code='npm install kanji.js' />
        <CodeBlock lang='html' title='CDN' code={`<script src="${CDN_URL}"></script>`} />
      </div>

      <section className='mt-14'>
        <div className='flex items-baseline justify-between gap-4 border-b border-border pb-3'>
          <h2 className='font-bold'>Releases</h2>
          <a href={RELEASES_URL} className='inline-flex items-center gap-1 text-sm text-muted hover:text-text'>
            All releases <ExternalIcon width={14} height={14} />
          </a>
        </div>

        {state.status === 'loading' && (
          <ul className='divide-y divide-border' aria-busy='true' aria-label='Loading releases'>
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className='space-y-2 py-6'>
                <div className='h-4 w-40 animate-pulse rounded bg-surface' />
                <div className='h-3 w-28 animate-pulse rounded bg-surface' />
              </li>
            ))}
          </ul>
        )}

        {state.status === 'error' && (
          <p className='py-6 text-sm text-muted'>
            The release list couldn't be loaded from GitHub. This can happen when the API rate limit is reached.
            You can find every release on <a href={RELEASES_URL} className='text-primary underline'>GitHub Releases</a>.
          </p>
        )}

        {state.status === 'ready' && (
          <ul className='divide-y divide-border'>
            {state.releases.map((r, i) => {
              const asset = packageAsset(r)
              return (
                <li key={r.id} className='py-6'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <a href={r.html_url} className='font-bold hover:text-primary'>{r.name || r.tag_name}</a>
                        {i === 0 && !r.prerelease && <span className='rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary'>Latest</span>}
                        {r.prerelease && <span className='rounded-full border border-border px-2 py-0.5 text-xs text-muted'>Pre-release</span>}
                      </div>
                      <p className='mt-1 text-sm text-muted'>
                        <time dateTime={r.published_at}>{dateFormat.format(new Date(r.published_at))}</time>
                      </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {asset && (
                        <a
                          href={asset.browser_download_url}
                          className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-on-primary transition-opacity hover:opacity-90'
                          title={`${asset.name}, ${sizeFormat(asset.size)}`}
                        >
                          <DownloadIcon width={16} height={16} /> Package
                        </a>
                      )}
                      <a
                        href={r.zipball_url}
                        className='inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface'
                      >
                        <DownloadIcon width={16} height={16} /> Source
                      </a>
                    </div>
                  </div>
                  {r.body && <Notes body={r.body} />}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
