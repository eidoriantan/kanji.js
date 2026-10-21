
/* eslint-env mocha */

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
  }).timeout(5000)

  it('Search Kanji with a range limit of 0', function () {
    const gradeResults = Kanji.search({ grade: { max: 0 } })
    gradeResults.should.not.containEql(dayKanji)
    gradeResults.forEach(word => should(word.grade > 0).be.false())

    const jlptResults = Kanji.search({ jlpt: { min: 0, max: 0 } })
    jlptResults.should.not.containEql(dayKanji)
    jlptResults.forEach(word => should(word.jlpt > 0).be.false())
  })

  it('Get random character', function () {
    const keys = Object.keys(dayKanji)
    const random = Kanji.random()
    random.should.have.keys(...keys)
  })
})
