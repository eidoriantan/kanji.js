/**
 * Types that match what kanji.js 1.6.2 actually returns. The package's own
 * index.d.ts types these fields as non-nullable, but the dictionary contains
 * nulls (most characters have no grade, JLPT level or frequency rank).
 */
export interface Word {
  literal: string
  meanings: string[]
  onyomi: string[]
  kunyomi: string[]
  stroke_count: number
  grade: number | null
  jlpt: number | null
  freq: number | null
}

export interface RangeOption {
  min?: number
  max?: number
}

export interface SearchOptions {
  grade?: number | RangeOption
  jlpt?: number | RangeOption
  meaning?: string
  romaji?: string
  sort?: boolean
}

export interface KanjiLib {
  dump(): Word[]
  getDetails(character: string): Word | null
  search(options?: SearchOptions): Word[]
  random(): Word
}

let pending: Promise<KanjiLib> | null = null

/** Loads the library (and its ~1.9 MB dictionary) on first use. */
export function loadKanji (): Promise<KanjiLib> {
  pending ??= import('kanji.js').then(mod => {
    const lib = (mod as { default?: unknown }).default ?? mod
    return lib as KanjiLib
  })
  return pending
}

/** A sample entry, used for static previews so pages don't need the library. */
export const SAMPLE_DAY: Word = {
  literal: '日',
  meanings: ['day', 'sun', 'Japan', 'counter for days'],
  onyomi: ['ニチ', 'ジツ'],
  kunyomi: ['ひ', '-び', '-か'],
  stroke_count: 4,
  grade: 1,
  jlpt: 4,
  freq: 1
}
