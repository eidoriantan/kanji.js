
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
      if (typeof grade !== 'undefined' && word.grade !== grade) return true
      if (typeof jlpt !== 'undefined' && word.jlpt !== jlpt) return true

      if (meaning !== '') {
        if (word.meanings.length === 0) return true
        for (let i = 0; i < word.meanings.length; i++) {
          if (word.meanings[i].indexOf(meaning) > -1) break
          else if (i === (word.meanings.length - 1)) return true
        }
      }

      if (romaji !== '') {
        let readingsMatch = false
        if (!readingsMatch && word.onyomi.length > 0) {
          const katakana = toKatakana(romaji)
          for (let i = 0; i < word.onyomi.length; i++) {
            if (word.onyomi[i].indexOf(katakana) > -1) {
              readingsMatch = true
              break
            }
          }
        }

        if (!readingsMatch && word.kunyomi.length > 0) {
          const hiragana = toHiragana(romaji)
          for (let i = 0; i < word.kunyomi.length; i++) {
            if (word.kunyomi[i].indexOf(hiragana) > -1) {
              readingsMatch = true
              break
            }
          }
        }

        if (!readingsMatch) return true
      }

      words.push(word)
    })

    return words
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
