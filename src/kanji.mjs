
import * as wanakana from 'wanakana'
import FuzzySet from 'fuzzyset.js'

import dictionary from './kanjidic2/kanjidic2.min.mjs'

function outOfRange (value, range) {
  return (typeof range.min === 'number' && value < range.min) ||
    (typeof range.max === 'number' && value > range.max)
}

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
    const { grade, jlpt, meaning, romaji, sort = true } = options

    dictionary.forEach(word => {
      const item = { word, score: 0 }

      if (
        (typeof grade === 'object' && outOfRange(word.grade, grade)) ||
        (typeof grade === 'number' && word.grade !== grade) ||
        (typeof jlpt === 'object' && outOfRange(word.jlpt, jlpt)) ||
        (typeof jlpt === 'number' && word.jlpt !== jlpt)
      ) {
        return
      } else {
        item.score += 1
      }

      if (typeof meaning !== 'undefined') {
        const meaningSet = FuzzySet(word.meanings).get(meaning, null, 0.75)
        if (meaningSet !== null) item.score += meaningSet[0][0]
      }

      if (typeof romaji !== 'undefined') {
        const onyomiSet = FuzzySet(word.onyomi)
          .get(wanakana.toKatakana(romaji), null, 0.75)
        if (onyomiSet !== null) item.score += onyomiSet[0][0]

        const kunyomiSet = FuzzySet(word.kunyomi)
          .get(wanakana.toHiragana(romaji), null, 0.75)
        if (kunyomiSet !== null) item.score += kunyomiSet[0][0]
      }

      if (item.score > 0) words.push(item)
    })

    if (sort) words = words.sort((a, b) => b.score - a.score)
    return words.map(item => item.word)
  }

  static random () {
    const random = Math.floor(Math.random() * dictionary.length)
    return dictionary[random]
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '1.6.2'
  }
}
