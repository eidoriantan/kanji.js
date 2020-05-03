
/**
 *  Example script on how to get a random Kanji character
 */

const Kanji = require('../dist/kanji.js')

/**
 *  Currently supported search params:
 *    meaning, romaji, grade, jlpt
 */
const searchResults = Kanji.search({
  meaning: 'counter for days',
  romaji: 'hi',
  grade: 1,
  jlpt: 4
})

console.log(searchResults)
/**
 *  [{
 *    freq: 1,
 *    grade: 1,
 *    jlpt: jlpt,
 *    literal: '日',
 *    meanings: [ 'day', 'sun', 'Japan', 'counter for days' ],
 *    onyomi: [ 'ニチ', 'ジツ' ],
 *    kunyomi: [ 'ひ', '-び', '-か' ],
 *    stroke_count: 4
 *  }]
 */
