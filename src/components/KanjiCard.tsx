import type { Word } from '../lib/kanji'

const gradeLabel = (g: number) => (g <= 6 ? `Grade ${g}` : g === 8 ? 'Jōyō (secondary)' : 'Jinmeiyō')

export function Badges ({ word }: { word: Word }) {
  const items = [
    word.jlpt != null && `JLPT ${word.jlpt}`,
    word.grade != null && gradeLabel(word.grade),
    `${word.stroke_count} stroke${word.stroke_count === 1 ? '' : 's'}`,
    word.freq != null && `Freq #${word.freq}`
  ].filter(Boolean) as string[]

  return (
    <div className='flex flex-wrap gap-1.5'>
      {items.map(item => (
        <span key={item} className='rounded bg-accent-soft px-2 py-0.5 text-xs font-medium tabular-nums text-accent-text'>{item}</span>
      ))}
    </div>
  )
}

function Readings ({ label, values }: { label: string, values: string[] }) {
  return (
    <div className='flex gap-3 text-sm'>
      <dt className='w-10 shrink-0 text-muted'>{label}</dt>
      <dd className='jp min-w-0'>{values.length ? values.join('、') : <span className='font-sans text-muted'>None</span>}</dd>
    </div>
  )
}

export default function KanjiCard ({ word, className = '' }: { word: Word, className?: string }) {
  return (
    <article className={`rounded-xl border border-border bg-bg p-5 ${className}`} lang='en'>
      <div className='flex items-start gap-5'>
        <div className='jp text-7xl leading-none font-bold' lang='ja'>{word.literal}</div>
        <div className='min-w-0 flex-1 space-y-3 pt-1'>
          <p className='text-[15px] leading-snug'>{word.meanings.join(', ') || <span className='text-muted'>No English meanings</span>}</p>
          <Badges word={word} />
        </div>
      </div>
      <dl className='mt-5 space-y-1.5 border-t border-border pt-4'>
        <Readings label='On' values={word.onyomi} />
        <Readings label='Kun' values={word.kunyomi} />
      </dl>
    </article>
  )
}
