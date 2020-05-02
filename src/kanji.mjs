
import dictionary from './kanjidic2/kanjidic2.min.mjs'

export default class Kanji {
  static dump () { return dictionary }

  static getDetails (character) {
    let details = null
    for (let i = 0; i < dictionary.length; i++) {
      const word = dictionary[i]
      if (word.literal === character) {
        details = word
        break
      }
    }

    return details
  }

  static search (options = {}) {
    const words = []
    const { grade, jlpt, meaning = '' } = options

    dictionary.forEach(word => {
      if (typeof grade !== 'undefined' && grade !== word.grade) return
      if (typeof jlpt !== 'undefined' && jlpt !== word.jlpt) return

      for (let i = 0; i < word.meanings.length; i++) {
        const wordMeaning = word.meanings[i]
        if (wordMeaning.indexOf(meaning) > -1) {
          words.push(word)
          break
        }
      }
    })

    return words
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '0.2.0'
  }
}
