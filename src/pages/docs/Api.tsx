import type { ReactNode } from 'react'
import { Link } from 'react-router'
import CodeBlock from '../../components/CodeBlock'
import Callout from '../../components/Callout'
import { DocPage, H } from '../../components/DocsLayout'
import { LIB_VERSION } from '../../lib/site'

const toc = [
  { id: 'getdetails', label: 'getDetails()' },
  { id: 'search', label: 'search()' },
  { id: 'search-filters', label: 'Filters', depth: 3 as const },
  { id: 'search-ranking', label: 'Ranking', depth: 3 as const },
  { id: 'search-performance', label: 'Performance', depth: 3 as const },
  { id: 'random', label: 'random()' },
  { id: 'dump', label: 'dump()' },
  { id: 'instance', label: 'Instance properties' },
  { id: 'types', label: 'Types' },
  { id: 'known-issues', label: 'Known issues' }
]

function Signature ({ children, returns }: { children: ReactNode, returns: string }) {
  return (
    <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm'>
      <span className='min-w-0 break-words'>{children}</span>
      <span className='text-muted'>→ <span className='text-text'>{returns}</span></span>
    </div>
  )
}

function Params ({ rows }: { rows: [ReactNode, ReactNode, ReactNode][] }) {
  return (
    <div className='overflow-x-auto'>
      <table>
        <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className='whitespace-nowrap font-mono text-[13px]'>{r[0]}</td>
              <td className='whitespace-nowrap font-mono text-[13px] text-muted'>{r[1]}</td>
              <td>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Api () {
  return (
    <DocPage
      title='API reference'
      lead={<>Everything kanji.js {LIB_VERSION} exports. The default export is the <code className='font-mono text-[0.9em]'>Kanji</code> class, and all of its methods are static.</>}
      toc={toc}
    >

      <H id='getdetails'>Kanji.getDetails()</H>
      <Signature returns='Word | null'>Kanji.getDetails(character: string)</Signature>
      <p>Returns the dictionary entry whose <code>literal</code> is exactly <code>character</code>, or <code>null</code> if there isn't one.</p>
      <Params rows={[
        ['character', 'string', 'A single kanji, such as \'日\'. The match is exact: no trimming, no variant folding, and no lookup by reading or meaning.']
      ]} />
      <CodeBlock code={`Kanji.getDetails('日')   // { literal: '日', meanings: ['day', 'sun', …], … }
Kanji.getDetails('日本') // null (only single characters are entries)
Kanji.getDetails('ア')   // null (kana are not in the dictionary)`} />
      <p>
        The returned object is the dictionary's own entry, not a copy. Don't change it.
      </p>

      <H id='search'>Kanji.search()</H>
      <Signature returns='Word[]'>Kanji.search(options?: SearchOptions)</Signature>
      <p>
        Scans every entry in the dictionary. It drops the entries that fail the filters, scores the rest against the ranking hints,
        and returns them best match first.
      </p>
      <Params rows={[
        ['grade', 'number | RangeOption', <>Filter. Keep entries with this school grade, or with a grade inside the range. See <Link to='/docs/data#grade'>grade values</Link>.</>],
        ['jlpt', 'number | RangeOption', <>Filter. Keep entries with this JLPT level, or with a level inside the range. Levels use the <Link to='/docs/data#jlpt'>old 1–4 scale</Link>.</>],
        ['meaning', 'string', 'Ranking hint. An English word or phrase, fuzzy-matched against each entry\'s meanings.'],
        ['romaji', 'string', 'Ranking hint. A reading in romaji (or kana), fuzzy-matched against the on and kun readings.'],
        ['sort', 'boolean', <>Default <code>true</code>. Set it to <code>false</code> to skip sorting and return matches in dictionary order.</>]
      ]} />
      <p>
        A <code>RangeOption</code> is <code>{'{ min?: number, max?: number }'}</code>. Both ends are inclusive.
      </p>
      <CodeBlock code={`Kanji.search({ grade: 2 })                      // grade 2 only (160 characters)
Kanji.search({ jlpt: { min: 3 } })              // JLPT 3 and 4 (284 characters)
Kanji.search({ grade: 1, meaning: 'water' })[0] // 水
Kanji.search({ romaji: 'hi', jlpt: 4 })[0]      // 火`} />

      <H id='search-filters' level={3}>Filters</H>
      <p>
        <code>grade</code> and <code>jlpt</code> are the only options that remove results. Each is checked in one of two ways:
      </p>
      <ul>
        <li>
          <strong>A number</strong> keeps entries whose value is exactly that number. Entries with <code>null</code> are always dropped.
        </li>
        <li>
          <strong>A range</strong> drops entries below <code>min</code> or above <code>max</code>. A <code>min</code> also drops entries
          with <code>null</code>, but a <code>max</code> on its own doesn't, because the library compares <code>null &gt; max</code> and that is false.
        </li>
      </ul>
      <CodeBlock code={`Kanji.search({ grade: { max: 6 } }).length          // 11117, includes ungraded
Kanji.search({ grade: { min: 1, max: 6 } }).length  // 1006, school kanji only`} />
      <Callout title='Always set min when you use max' tone='warning'>
        <p>
          To get only characters that have a grade or JLPT level, include <code>min: 1</code> in the range. Also:
          a <code>min</code> or <code>max</code> of <code>0</code> is ignored, and passing <code>null</code> as
          the <code>grade</code> or <code>jlpt</code> option throws a <code>TypeError</code>. Leave the option out instead.
        </p>
      </Callout>

      <H id='search-ranking' level={3}>Ranking</H>
      <p>Every entry that passes the filters gets a score:</p>
      <ol>
        <li>It starts at <strong>1</strong>, just for passing the filters.</li>
        <li>
          If you set <code>meaning</code>, the library fuzzy-matches it against the entry's <code>meanings</code> with{' '}
          <a href='https://github.com/Glench/fuzzyset.js'>fuzzyset.js</a>. A similarity of at least 0.75 adds that similarity (0.75–1) to the score.
        </li>
        <li>
          If you set <code>romaji</code>, the library converts it to katakana and matches it against <code>onyomi</code>.
          It also converts it to hiragana and matches it against <code>kunyomi</code>, using{' '}
          <a href='https://wanakana.com'>WanaKana</a>. Each reading list that matches with a similarity of at least 0.75 adds its similarity,
          so a romaji match can add up to 2.
        </li>
      </ol>
      <p>
        With <code>sort</code> on, results are ordered from the highest score down. Entries with the same score stay in dictionary order.
        Because every entry that passes the filters scores at least 1, <strong>ranking hints never remove results</strong>.
        A search with only <code>meaning</code> or <code>romaji</code> returns all 13,108 entries.
      </p>
      <CodeBlock code={`// Top five results for a meaning
Kanji.search({ meaning: 'water' }).slice(0, 5).map(k => k.literal)
// ['水', '霑', '氵', '潑', '㴑']

// Kana input works too, since WanaKana passes kana through
Kanji.search({ romaji: 'みず' })[0].literal  // '水'`} />
      <p>
        Scores aren't returned. To keep only real matches, check the fields yourself.
        See <Link to='/docs/guides#exact-reading'>Find characters with an exact reading</Link>.
      </p>

      <H id='search-performance' level={3}>Performance</H>
      <p>
        <code>search()</code> builds new fuzzy-match sets for every entry on every call, so a search with <code>meaning</code> or{' '}
        <code>romaji</code> takes a noticeable moment: about 0.3 seconds in Node.js 22 on a recent laptop. Searches with only filters are much faster.
        In a UI, debounce input, or run the search in a <Link to='/docs/guides#web-worker'>Web Worker</Link>.
      </p>

      <H id='random'>Kanji.random()</H>
      <Signature returns='Word'>Kanji.random()</Signature>
      <p>
        Returns a random entry from the whole dictionary. It takes no options, and the result is mostly rare characters, since about 77% of
        entries have no grade or JLPT level. It uses <code>Math.random()</code>, so it isn't suitable for anything security-related.
      </p>
      <CodeBlock code={`Kanji.random().literal  // e.g. '幬'`} />

      <H id='dump'>Kanji.dump()</H>
      <Signature returns='Word[]'>Kanji.dump()</Signature>
      <p>
        Returns the full dictionary: 13,108 entries in KANJIDIC2 order. Every call returns the same array, the library's own copy,
        so treat it as read-only.
      </p>
      <CodeBlock code={`const all = Kanji.dump()
all.length                       // 13108
Kanji.dump() === all             // true

const sorted = [...all].sort((a, b) => a.stroke_count - b.stroke_count) // copy first`} />

      <H id='instance'>Instance properties</H>
      <p>
        You don't need an instance to use the library. Creating one gives you its name and version:
      </p>
      <CodeBlock code={`const k = new Kanji()
k.name     // 'Kanji'
k.version  // '${LIB_VERSION}'`} />

      <H id='types'>Types</H>
      <p>
        These are the shapes the library actually returns. They differ from the bundled <code>index.d.ts</code> in the
        fields marked <code>null</code>. Copy them into your project if you want TypeScript to catch the missing values.
      </p>
      <CodeBlock lang='ts' title='kanji-types.ts' code={`export interface Word {
  literal: string          // the character, e.g. '日'
  meanings: string[]       // English meanings, may be empty
  onyomi: string[]         // on readings in katakana, may be empty
  kunyomi: string[]        // kun readings in hiragana, may be empty
  stroke_count: number
  grade: number | null     // 1–6, 8, 9 or 10, or null
  jlpt: number | null      // 1–4 (old scale), or null
  freq: number | null      // 1–2501, or null
}

export interface RangeOption {
  min?: number             // inclusive
  max?: number             // inclusive
}

export interface SearchOptions {
  grade?: number | RangeOption
  jlpt?: number | RangeOption
  meaning?: string
  romaji?: string
  sort?: boolean           // default true
}`} />
      <p>
        The <Link to='/docs/data'>Character data</Link> page describes each field and its values.
      </p>

      <H id='known-issues'>Known issues</H>
      <p>These are current behaviors of version {LIB_VERSION}. They may change in a future release.</p>
      <ul>
        <li>The bundled types don't allow <code>null</code> from <code>getDetails()</code>, or in <code>grade</code>, <code>jlpt</code> and <code>freq</code>.</li>
        <li><code>random()</code> never returns the last dictionary entry (頻).</li>
        <li>A range with only <code>max</code> includes entries with no value. A <code>min</code> or <code>max</code> of <code>0</code> is ignored.</li>
        <li><code>meaning</code> and <code>romaji</code> rank results but don't filter them.</li>
      </ul>
    </DocPage>
  )
}
