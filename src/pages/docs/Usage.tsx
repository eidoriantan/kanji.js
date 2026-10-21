import { Link } from 'react-router'
import Seo from '../../components/Seo'
import CodeBlock from '../../components/CodeBlock'
import Callout from '../../components/Callout'
import { DocPage, H } from '../../components/DocsLayout'

const toc = [
  { id: 'importing', label: 'Importing' },
  { id: 'look-up', label: 'Look up a character' },
  { id: 'search', label: 'Search' },
  { id: 'random', label: 'Random character' },
  { id: 'dump', label: 'The whole dictionary' },
  { id: 'next', label: 'Next steps' }
]

export default function Usage () {
  return (
    <DocPage
      title='Usage'
      lead='kanji.js exports one class, Kanji, and every method on it is static. Import it and call the methods directly. You never need to create an instance.'
      toc={toc}
    >
      <Seo title='Usage' description='Get started with kanji.js: importing the library and using getDetails, search, random and dump.' />

      <H id='importing'>Importing</H>
      <p>The package is a UMD build, so the import depends on your environment.</p>
      <CodeBlock title='ES modules (bundlers, TypeScript, Node.js)' code={`import Kanji from 'kanji.js'`} />
      <CodeBlock title='CommonJS (Node.js)' code={`const Kanji = require('kanji.js')`} />
      <CodeBlock title='Browser script tag' lang='html' code={`<script src="https://cdn.jsdelivr.net/npm/kanji.js@1.6.2/dist/kanji.min.js"></script>
<!-- the global \`Kanji\` is now available -->`} />

      <H id='look-up'>Look up a character</H>
      <p>
        <code>getDetails()</code> finds a single character and returns everything the dictionary has on it.
        It returns <code>null</code> if the character isn't in the dictionary, so check the result before you use it.
      </p>
      <CodeBlock code={`const ki = Kanji.getDetails('気')
// {
//   literal: '気',
//   meanings: ['spirit', 'mind', 'air', 'atmosphere', 'mood'],
//   onyomi: ['キ', 'ケ'],
//   kunyomi: ['いき'],
//   stroke_count: 6,
//   grade: 1,
//   jlpt: 4,
//   freq: 113
// }

Kanji.getDetails('a')  // null`} />
      <p>
        The <Link to='/docs/data'>Character data</Link> page explains what each field means.
      </p>

      <H id='search'>Search</H>
      <p>
        <code>search()</code> scans the whole dictionary and returns an array of characters. There are two kinds of options:
      </p>
      <ul>
        <li><strong>Filters</strong> (<code>grade</code>, <code>jlpt</code>) remove characters that don't match.</li>
        <li><strong>Ranking hints</strong> (<code>meaning</code>, <code>romaji</code>) move the best matches to the top. They never remove anything.</li>
      </ul>
      <CodeBlock code={`// Only first-grade characters, best match for "counter for days" first
Kanji.search({ grade: 1, meaning: 'counter for days' })[0].literal  // '日'

// JLPT levels 1 and 2 (old four-level scale)
Kanji.search({ jlpt: { min: 1, max: 2 } }).length  // 1946

// Characters read "mizu", best match first
Kanji.search({ romaji: 'mizu' })[0].literal  // '水'`} />
      <Callout title='Ranking hints return the whole dictionary'>
        <p>
          <code>{"Kanji.search({ meaning: 'water' })"}</code> returns all 13,108 characters, with the closest matches first.
          To get a short list, slice the result or add a <code>grade</code> or <code>jlpt</code> filter.
          The <Link to='/docs/api#search'>API reference</Link> explains how ranking works.
        </p>
      </Callout>

      <H id='random'>Random character</H>
      <CodeBlock code={`Kanji.random()
// e.g. { literal: '幬', meanings: ['cover up', 'curtain'], grade: null, jlpt: null, … }`} />
      <p>
        <code>random()</code> picks from the whole dictionary. Most entries are rare characters with no grade or JLPT level.
        To pick from common characters only, see <Link to='/docs/guides#random-from-level'>Pick a random character from one level</Link>.
      </p>

      <H id='dump'>The whole dictionary</H>
      <p>
        <code>dump()</code> returns the full array of 13,108 entries. Use it with your own <code>filter</code>, <code>find</code> or <code>map</code> when <code>search()</code> doesn't do what you need.
      </p>
      <CodeBlock code={`const all = Kanji.dump()
const simple = all.filter(k => k.stroke_count <= 3)`} />
      <Callout title="Don't change the array" tone='warning'>
        <p>
          <code>dump()</code> returns the library's own array, not a copy. Sorting it in place or editing an entry changes what <code>getDetails()</code>,{' '}
          <code>search()</code> and <code>random()</code> return afterwards. Copy it first with <code>[...Kanji.dump()]</code> if you need to sort it.
        </p>
      </Callout>

      <H id='next'>Next steps</H>
      <ul>
        <li><Link to='/docs/api'>API reference</Link>: every method, option and type in detail.</li>
        <li><Link to='/docs/guides'>Recipes</Link>: short solutions to common tasks.</li>
        <li><Link to='/playground'>Playground</Link>: try the library in your browser.</li>
      </ul>
    </DocPage>
  )
}
