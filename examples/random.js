
/**
 *  Example script on how to get a random Kanji character
 */

const Kanji = require('../dist/kanji.js')
const random = Kanji.random()

console.log(random)
/**
 *  {
 *    freq: null,
 *    grade: null,
 *    jlpt: null,
 *    literal: '幬',
 *    meanings: [ 'cover up', 'curtain' ],
 *    onyomi: [ 'チュウ', 'ジュ', 'トウ' ],
 *    kunyomi: [ 'とばり' ],
 *    stroke_count: 17
 *  }
 */
