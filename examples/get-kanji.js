
/**
 *  Example script on how to get the details of a kanji
 */

const Kanji = require('../dist/kanji.js')
const day = Kanji.getDetails('日')

console.log(day)
/**
 *  {
 *    freq: 1,
 *    grade: 1,
 *    jlpt: 4,
 *    literal: '日',
 *    meanings: [ 'day', 'sun', 'Japan', 'counter for days' ],
 *    onyomi: [ 'ニチ', 'ジツ' ],
 *    kunyomi: [ 'ひ', '-び', '-か' ],
 *    stroke_count: 4
 *  }
 */
