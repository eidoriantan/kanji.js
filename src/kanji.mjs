
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
    const { grade, jlpt, meaning, romaji, sort = true } = options

    dictionary.forEach(word => {
      const item = { word, score: 0 }

      if (typeof grade === 'object') {
        if (grade.min && word.grade < grade.min) return
        else if (grade.max && word.grade > grade.max) return
      } else if (typeof grade === 'number') {
        if (word.grade !== grade) return
      }

      if (typeof jlpt === 'object') {
        if (jlpt.min && word.jlpt < jlpt.min) return
        else if (jlpt.max && word.jlpt > jlpt.max) return
      } else if (typeof grade === 'number') {
        if (word.grade !== grade) return
      }

      if (typeof meaning !== 'undefined') {
        const meaningSet = FuzzySet(word.meanings).get(meaning, null, 0.75)
        if (meaningSet !== null) item.score += meaningSet[0][0]
      }

      if (typeof romaji !== 'undefined') {
        const onyomiSet = FuzzySet(word.onyomi)
          .get(toKatakana(romaji), null, 0.75)
        if (onyomiSet !== null) item.score += onyomiSet[0][0] / 2

        const kunyomiSet = FuzzySet(word.kunyomi)
          .get(toHiragana(romaji), null, 0.75)
        if (kunyomiSet !== null) item.score += kunyomiSet[0][0] / 2
      }

      if (item.score > 0) words.push(item)
    })

    if (sort) words = words.sort((a, b) => b.score - a.score)
    return words.map(item => item.word)
  }

  static random () {
    const random = Math.floor(Math.random() * (dictionary.length - 1))
    return dictionary[random]
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '1.3.0'
  }
}
