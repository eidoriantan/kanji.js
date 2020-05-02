
import dictionary from './kanjidic2/kanjidic2.min.mjs'
import { toKatakana, toHiragana } from 'wanakana'

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
    const { grade, jlpt, meaning = '', romaji = '' } = options

    dictionary.forEach(word => {
      let match = true
      if (match && typeof grade !== 'undefined' && word.grade !== grade) {
        match = false
      }

      if (match && typeof jlpt !== 'undefined' && word.jlpt !== jlpt) {
        match = false
      }

      if (match && meaning !== '') {
        match = false
        for (let i = 0; i < word.meanings.length; i++) {
          if (word.meanings[i].indexOf(meaning) > -1) {
            match = true
            break
          }
        }
      }

      if (match && romaji !== '') {
        match = false
        for (let i = 0; i < word.onyomi.length; i++) {
          const katakana = toKatakana(romaji)
          if (word.onyomi[i] === katakana) {
            match = true
            break
          }
        }

        for (let i = 0; i < word.kunyomi.length; i++) {
          const hiragana = toHiragana(romaji)
          if (word.kunyomi[i] === hiragana) {
            match = true
            break
          }
        }
      }

      if (match) words.push(word)
    })

    return words
  }

  constructor () {
    this.name = 'Kanji'
    this.version = '0.3.0'
  }
}
