
import dictionary from './kanjidic2/kanjidic2.min.mjs'

export default class Kanji {
  static dump () { return dictionary }

  constructor () {
    this.name = 'Kanji'
    this.version = '0.1.0'
  }
}
