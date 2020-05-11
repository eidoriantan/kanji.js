
import { toKatakana, toHiragana } from 'wanakana'
import FuzzySet from 'fuzzyset.js'

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
    let words = []
    const { grade, jlpt, meaning, romaji } = options

    dictionary.forEach(word => {
      const item = { word, scores: [0] }

      if (typeof grade !== 'undefined' && word.grade !== grade) return true
      if (typeof jlpt !== 'undefined' && word.jlpt !== jlpt) return true

      if (typeof meaning !== 'undefined') {
        const meaningSet = FuzzySet(word.meanings).get(meaning)
        if (meaningSet !== null) item.scores.push(meaningSet[0][0])
      }

      if (typeof romaji !== 'undefined') {
        const onyomiSet = FuzzySet(word.onyomi).get(toKatakana(romaji))
        if (onyomiSet !== null) item.scores.push(onyomiSet[0][0] / 2)

        const kunyomiSet = FuzzySet(word.kunyomi).get(toHiragana(romaji))
        if (kunyomiSet !== null) item.scores.push(kunyomiSet[0][0] / 2)
      }

      const maxScore = Math.max(...item.scores)
      if (maxScore > 0) {
        item.score = maxScore
        words.push(item)
      }
    })

    if (options.sort) words = words.sort((a, b) => b.score - a.score)
    return words.map(item => item.word)
  }

  static random () {
    const random = Math.floor(Math.random() * (dictionary.length - 1))
    return dictionary[random]
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '1.0.1'
  }
}
