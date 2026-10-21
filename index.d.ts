
export as namespace Kanji;

export default class Kanji {
  readonly name: string;
  readonly version: string;

  constructor ();

  static dump () : Array<Kanji.Word>;
  static getDetails (character: string) : Kanji.Word | null;
  static search (options?: Kanji.SearchOptions) : Array<Kanji.Word>;
  static random () : Kanji.Word;
}

export interface Word {
  freq: number | null;
  grade: number | null;
  jlpt: number | null;
  kunyomi: Array<string>;
  literal: string;
  meanings: Array<string>;
  onyomi: Array<string>;
  stroke_count: number;
}

export interface SearchOptions {
  grade?: Kanji.RangeOption | number;
  jlpt?: Kanji.RangeOption | number;
  meaning?: string;
  romaji?: string;
  sort?: boolean;
}

export interface RangeOption {
  min?: number;
  max?: number;
}
