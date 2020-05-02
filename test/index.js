
const assert = require('assert')
const Kanji = require('../dist/kanji.js')

const dayKanji = {
  literal: '日',
  freq: 1,
  grade: 1,
  jlpt: 4,
  meanings: ['day', 'sun', 'Japan', 'counter for days'],
  onyomi: ['ニチ', 'ジツ'],
  kunyomi: ['ひ', '-び', '-か'],
  stroke_count: 4
}

describe('Kanji', function () {
  it('Get Kanji details', function () {
    const kanji = Kanji.getDetails('日')
    assert.deepStrictEqual(kanji, dayKanji)
  })
})
