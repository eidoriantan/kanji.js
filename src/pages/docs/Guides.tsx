import Seo from '../../components/Seo'
import CodeBlock from '../../components/CodeBlock'
import { DocPage, H } from '../../components/DocsLayout'

const toc = [
  { id: 'kanji-in-text', label: 'Look up every kanji in a text' },
  { id: 'study-list', label: 'Build a study list' },
  { id: 'random-from-level', label: 'Random character from a level' },
  { id: 'top-meaning', label: 'Top matches for a meaning' },
  { id: 'exact-reading', label: 'Exact reading match' },
  { id: 'lazy-load', label: 'Load on demand' },
  { id: 'web-worker', label: 'Search in a Web Worker' }
]

export default function Guides () {
  return (
    <DocPage
      title='Recipes'
      lead='Short, copyable solutions to common tasks. Each one uses only the public API and plain JavaScript.'
      toc={toc}
    >
      <Seo title='Recipes' description='kanji.js examples: look up kanji in text, build JLPT study lists, random flashcards, exact reading matches, lazy loading and Web Workers.' />

      <H id='kanji-in-text'>Look up every kanji in a text</H>
      <p>
        Split the text into characters and keep the ones the dictionary knows. <code>getDetails()</code> returns <code>null</code> for
        kana, punctuation and Latin letters, so a filter removes them.
      </p>
      <CodeBlock code={`function kanjiIn (text) {
  const seen = new Set()
  return [...text]
    .filter(ch => !seen.has(ch) && seen.add(ch))
    .map(ch => Kanji.getDetails(ch))
    .filter(Boolean)
}

kanjiIn('今日は良い天気です').map(k => \`\${k.literal}: \${k.meanings[0]}\`)
// ['今: now', '日: day', '良: good', '天: heavens', '気: spirit']`} />

      <H id='study-list'>Build a study list</H>
      <p>
        Filter by JLPT level, then sort by frequency so the most useful characters come first.
        Entries without a frequency rank go last.
      </p>
      <CodeBlock code={`const byFrequency = (a, b) => (a.freq ?? Infinity) - (b.freq ?? Infinity)

const level3 = Kanji.search({ jlpt: 3 }).sort(byFrequency)
level3.length                                    // 181
level3.slice(0, 5).map(k => k.literal).join('')  // '同事自民発'`} />
      <p>
        For school kanji up to a grade, use a range that starts at 1. Leaving out <code>min</code> would also include every character that has no grade.
      </p>
      <CodeBlock code={`const firstThreeGrades = Kanji.search({ grade: { min: 1, max: 3 } })
firstThreeGrades.length  // 440`} />

      <H id='random-from-level'>Pick a random character from one level</H>
      <p>
        <code>random()</code> picks from the whole dictionary, which is mostly rare characters.
        For flashcards, filter first and then pick from the result.
      </p>
      <CodeBlock code={`const pool = Kanji.search({ jlpt: 4, sort: false })

function flashcard () {
  return pool[Math.floor(Math.random() * pool.length)]
}`} />
      <p>
        Passing <code>sort: false</code> skips sorting, which you don't need here. Run the search once and reuse the pool.
      </p>

      <H id='top-meaning'>Top matches for a meaning</H>
      <p>
        A <code>meaning</code> search ranks the whole dictionary, so take the first few results. Add a filter to stick to common characters. Matching is fuzzy, so results further down may only be loosely related.
      </p>
      <CodeBlock code={`Kanji.search({ meaning: 'mountain' }).slice(0, 3).map(k => k.literal)
// ['岳', '山', '岾']

Kanji.search({ meaning: 'mountain', grade: { min: 1, max: 8 } }).slice(0, 3).map(k => k.literal)
// ['岳', '山', '泉']`} />

      <H id='exact-reading'>Find characters with an exact reading</H>
      <p>
        A <code>romaji</code> search is fuzzy and returns everything, ranked. To get only the characters that have a reading,
        compare against the reading lists yourself. Remove the hyphens first, because they only mark prefix and suffix forms.
      </p>
      <CodeBlock code={`const clean = r => r.replace(/-/g, '')

function withReading (kana) {
  return Kanji.dump().filter(k =>
    k.kunyomi.some(r => clean(r) === kana) ||
    k.onyomi.some(r => clean(r) === kana)
  )
}

withReading('みず').map(k => k.literal)  // ['水', '瑞', '瀣']`} />
      <p>
        Pass kana in the same script as the list you're checking: hiragana for kun readings, katakana for on readings.
        To accept romaji, convert it first with a library such as <a href='https://wanakana.com'>WanaKana</a>.
      </p>

      <H id='lazy-load'>Load the library on demand</H>
      <p>
        The library includes about 1.9 MB of dictionary data. In a browser app, a dynamic <code>import()</code> keeps it out of your main bundle
        so it only downloads when someone needs it. Bundlers such as Vite and webpack split it into a separate file automatically.
      </p>
      <CodeBlock code={`let kanji

async function getKanji () {
  kanji ??= import('kanji.js').then(mod => mod.default)
  return kanji
}

searchInput.addEventListener('focus', () => { getKanji() }, { once: true }) // start early

async function onSearch (query) {
  const Kanji = await getKanji()
  return Kanji.search({ meaning: query }).slice(0, 20)
}`} />

      <H id='web-worker'>Search in a Web Worker</H>
      <p>
        A <code>meaning</code> or <code>romaji</code> search can take a few hundred milliseconds. To keep typing smooth, run it in a worker.
        The example uses Vite's worker syntax. Other bundlers have their own.
      </p>
      <CodeBlock title='kanji-worker.js' code={`import Kanji from 'kanji.js'

self.onmessage = ({ data: { id, options, limit } }) => {
  const results = Kanji.search(options).slice(0, limit)
  self.postMessage({ id, results })
}`} />
      <CodeBlock title='main.js' code={`const worker = new Worker(new URL('./kanji-worker.js', import.meta.url), { type: 'module' })
let nextId = 0

function search (options, limit = 50) {
  const id = nextId++
  return new Promise(resolve => {
    worker.addEventListener('message', function onMessage ({ data }) {
      if (data.id !== id) return
      worker.removeEventListener('message', onMessage)
      resolve(data.results)
    })
    worker.postMessage({ id, options, limit })
  })
}

const results = await search({ meaning: 'river' }, 10)`} />
    </DocPage>
  )
}
