
const should = require('should')
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
  it('Dump entire dictionary', function () {
    should.strictEqual(Kanji.dump().length, 13108)
  })

  it('Get Kanji details', function () {
    const kanji = Kanji.getDetails('日')
    should.deepEqual(kanji, dayKanji)
  })

  it('Search Kanji', function () {
    const searchResults = Kanji.search({
      meaning: 'days',
      romaji: 'hi'
    })

    searchResults.should.containEql(dayKanji)
  })

  it('Get random character', function () {
    const keys = Object.keys(dayKanji)
    const random = Kanji.random()
    random.should.have.keys(...keys)
  })
})
