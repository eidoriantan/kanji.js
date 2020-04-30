
import dictionary from './kanjidic2/kanjidic2.min.mjs'

export default class Kanji {
  static dump () { return dictionary }

  static getDetails (character) {
    let details = null
    dictionary.forEach(word => {
      if (word.literal === character) details = word
    })

    return details
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '0.1.0'
  }
}
