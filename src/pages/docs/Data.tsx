import { Link } from 'react-router'
import Seo from '../../components/Seo'
import CodeBlock from '../../components/CodeBlock'
import { DocPage, H } from '../../components/DocsLayout'
import { EDRDG_LICENSE_URL, KANJIDIC_URL } from '../../lib/site'

const toc = [
  { id: 'fields', label: 'Fields' },
  { id: 'grade', label: 'Grade' },
  { id: 'jlpt', label: 'JLPT level' },
  { id: 'freq', label: 'Frequency' },
  { id: 'readings', label: 'Readings' },
  { id: 'source', label: 'Source and license' }
]

const grades: [string, string, string, number][] = [
  ['1–6', 'Kyōiku kanji', 'Taught in elementary school, grade 1 to 6', 1006],
  ['8', 'Jōyō kanji', 'The rest of the general-use list, taught in secondary school', 1130],
  ['9', 'Jinmeiyō kanji', 'Approved for personal names', 684],
  ['10', 'Jinmeiyō variants', 'Name kanji that are variant forms of jōyō kanji', 177],
  ['null', 'None', 'Not on any official list', 10111]
]

const jlpt: [string, string, number][] = [
  ['4', 'Easiest. Roughly today\'s N5', 103],
  ['3', 'Roughly today\'s N4', 181],
  ['2', 'Roughly today\'s N3 and N2', 739],
  ['1', 'Hardest. Roughly today\'s N1', 1207],
  ['null', 'Not on a JLPT list', 10878]
]

const n = (x: number) => x.toLocaleString('en-US')

export default function Data () {
  return (
    <DocPage
      title='Character data'
      lead='Every method returns entries of the same shape. This page describes each field, what its values mean, and when it can be empty.'
      toc={toc}
    >
      <Seo title='Character data' description='What each field in a kanji.js entry means: readings, meanings, stroke count, school grade, JLPT level and frequency.' />

      <H id='fields'>Fields</H>
      <CodeBlock code={`{
  literal: '日',
  meanings: ['day', 'sun', 'Japan', 'counter for days'],
  onyomi: ['ニチ', 'ジツ'],
  kunyomi: ['ひ', '-び', '-か'],
  stroke_count: 4,
  grade: 1,
  jlpt: 4,
  freq: 1
}`} />
      <div className='overflow-x-auto'>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td className='font-mono text-[13px]'>literal</td><td className='font-mono text-[13px] text-muted'>string</td><td>The character itself. Every entry has a unique one.</td></tr>
            <tr><td className='font-mono text-[13px]'>meanings</td><td className='font-mono text-[13px] text-muted'>string[]</td><td>English meanings. Empty for {n(2761)} entries.</td></tr>
            <tr><td className='font-mono text-[13px]'>onyomi</td><td className='font-mono text-[13px] text-muted'>string[]</td><td>On (Sino-Japanese) readings, in katakana. Empty for {n(960)} entries.</td></tr>
            <tr><td className='font-mono text-[13px]'>kunyomi</td><td className='font-mono text-[13px] text-muted'>string[]</td><td>Kun (native Japanese) readings, in hiragana. Empty for {n(3309)} entries.</td></tr>
            <tr><td className='font-mono text-[13px]'>stroke_count</td><td className='font-mono text-[13px] text-muted'>number</td><td>Number of strokes, from 1 to 34.</td></tr>
            <tr><td className='font-mono text-[13px]'>grade</td><td className='font-mono text-[13px] text-muted'>number | null</td><td>School grade or official list. See <a href='#grade'>Grade</a>.</td></tr>
            <tr><td className='font-mono text-[13px]'>jlpt</td><td className='font-mono text-[13px] text-muted'>number | null</td><td>JLPT level, old scale. See <a href='#jlpt'>JLPT level</a>.</td></tr>
            <tr><td className='font-mono text-[13px]'>freq</td><td className='font-mono text-[13px] text-muted'>number | null</td><td>Newspaper frequency rank. See <a href='#freq'>Frequency</a>.</td></tr>
          </tbody>
        </table>
      </div>

      <H id='grade'>Grade</H>
      <p>
        <code>grade</code> shows where a character sits in the Japanese government's kanji lists. The value 7 isn't used.
      </p>
      <div className='overflow-x-auto'>
        <table>
          <thead><tr><th>Value</th><th>List</th><th>Meaning</th><th className='text-right'>Entries</th></tr></thead>
          <tbody>
            {grades.map(([v, list, meaning, count]) => (
              <tr key={v}>
                <td className='font-mono text-[13px]'>{v}</td>
                <td className='whitespace-nowrap'>{list}</td>
                <td>{meaning}</td>
                <td className='text-right tabular-nums'>{n(count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Grades 1–6 and 8 together make up the 2,136 jōyō (general-use) kanji. To get them all, use{' '}
        <code>{'search({ grade: { min: 1, max: 8 } })'}</code>.
      </p>

      <H id='jlpt'>JLPT level</H>
      <p>
        <code>jlpt</code> uses the <strong>old four-level scale</strong> that the Japanese-Language Proficiency Test used before 2010.
        Higher numbers are easier. This is the opposite of today's N1–N5 order, where N5 is the easiest. The current test has no official kanji lists,
        so the mapping below is only approximate.
      </p>
      <div className='overflow-x-auto'>
        <table>
          <thead><tr><th>Value</th><th>Meaning</th><th className='text-right'>Entries</th></tr></thead>
          <tbody>
            {jlpt.map(([v, meaning, count]) => (
              <tr key={v}>
                <td className='font-mono text-[13px]'>{v}</td>
                <td>{meaning}</td>
                <td className='text-right tabular-nums'>{n(count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H id='freq'>Frequency</H>
      <p>
        <code>freq</code> ranks the 2,501 most-used characters by how often they appear in Japanese newspapers. 1 is the most frequent (日).
        Every other entry has <code>null</code>. Sort by it to put common characters first:
      </p>
      <CodeBlock code={`const byFrequency = (a, b) => (a.freq ?? Infinity) - (b.freq ?? Infinity)

Kanji.search({ jlpt: 4 }).sort(byFrequency).slice(0, 10).map(k => k.literal).join('')
// '日一国会人年大十二本'`} />

      <H id='readings'>Readings</H>
      <ul>
        <li><code>onyomi</code> entries are in katakana, and <code>kunyomi</code> entries are in hiragana.</li>
        <li>
          A hyphen marks a reading that only appears as part of a word. A leading hyphen means a suffix, as in <span className='jp' lang='ja'>-び</span> for 日.
          A trailing hyphen means a prefix, as in <span className='jp' lang='ja'>なま-</span> for 生. {n(281)} entries have one.
        </li>
        <li>Kun readings don't mark okurigana (the kana that follow the kanji), so <span className='jp' lang='ja'>いきる</span> for 生 is stored as one string.</li>
        <li>A reading can appear more than once in the same list.</li>
      </ul>
      <p>
        The <Link to='/docs/api#search-ranking'>romaji search</Link> matches against these lists, hyphens included.
      </p>

      <H id='source'>Source and license</H>
      <p>
        The data comes from <a href={KANJIDIC_URL}>KANJIDIC2</a>, compiled by Jim Breen and the Electronic Dictionary Research and Development Group (EDRDG).
        kanji.js includes a subset of its fields. KANJIDIC2 is available under the Creative Commons Attribution-ShareAlike 4.0 license.
        If you redistribute the data, follow the <a href={EDRDG_LICENSE_URL}>EDRDG licence terms</a>.
      </p>
    </DocPage>
  )
}
