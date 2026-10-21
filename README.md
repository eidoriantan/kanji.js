# Kanji.js

[![Node.js CI](https://github.com/eidoriantan/kanji.js/workflows/Node.js%20CI/badge.svg)](https://github.com/eidoriantan/kanji.js/actions?query=workflow%3A%22Node.js+CI%22)
[![npm](https://img.shields.io/npm/v/kanji.js/latest?registry_uri=https%3A%2F%2Fregistry.npmjs.com%2Fkanji.js&label=kanji.js@latest)](https://npmjs.com/kanji.js)
[![GitHub](https://img.shields.io/github/license/eidoriantan/kanji.js)](https://github.com/eidoriantan/kanji.js/blob/main/LICENSE.txt)

漢字 search/lookup library for Node.js and browsers.

Kanji.js bundles the [KANJIDIC] dictionary (13,108 characters), so it works
offline and in the browser with no server or extra downloads. Look up a
character's readings, meanings, stroke count, school grade, JLPT level and
frequency, or search the dictionary by English meaning or romaji reading.

```javascript
Kanji.getDetails('気').meanings // ['spirit', 'mind', 'air', 'atmosphere', 'mood']
```

Visit [kanji.js.org][homepage] for the full documentation and a live demo. The
website's source is on the
[gh-pages](https://github.com/eidoriantan/kanji.js/tree/gh-pages) branch.

## Features

* Look up any of the 13,108 characters in KANJIDIC
* Fuzzy search by English meaning or romaji reading (on'yomi and kun'yomi)
* Filter by school grade and JLPT level, as an exact value or a range
* Pick a random character
* Works in Node.js and browsers (UMD build), with TypeScript types included

## Installation

Install from [npm](https://www.npmjs.com/package/kanji.js):

```shell
npm install kanji.js
```

Or load it in the browser from a CDN, which exposes a global `Kanji`:

```html
<script src="https://cdn.jsdelivr.net/npm/kanji.js@latest/dist/kanji.min.js"></script>
```

Ready-to-use scripts are also attached to each
[GitHub release](https://github.com/eidoriantan/kanji.js/releases).

> **Note:** the bundled dictionary makes the script about 2 MB, so consider
> loading it lazily on pages where it is not needed right away.

## Usage

```javascript
// CommonJS
const Kanji = require('kanji.js')

// ES modules / TypeScript
import Kanji from 'kanji.js'
```

### Look up a character

```javascript
Kanji.getDetails('気')
// {
//   freq: 113,
//   grade: 1,
//   jlpt: 4,
//   literal: '気',
//   meanings: ['spirit', 'mind', 'air', 'atmosphere', 'mood'],
//   onyomi: ['キ', 'ケ'],
//   kunyomi: ['いき'],
//   stroke_count: 6
// }

Kanji.getDetails('a') // null
```

### Search

```javascript
Kanji.search({ grade: 1, meaning: 'counter for days' })[0]
// {
//   freq: 1,
//   grade: 1,
//   jlpt: 4,
//   literal: '日',
//   meanings: ['day', 'sun', 'Japan', 'counter for days'],
//   onyomi: ['ニチ', 'ジツ'],
//   kunyomi: ['ひ', '-び', '-か'],
//   stroke_count: 4
// }

// Romaji is matched against both on'yomi and kun'yomi
Kanji.search({ romaji: 'mizu', grade: { min: 1, max: 2 } })[0].literal // '水'
```

### Random character and full dictionary

```javascript
Kanji.random() // e.g. { literal: '幬', meanings: ['cover up', 'curtain'], ... }
Kanji.dump()   // Array of all 13,108 characters
```

More runnable scripts are in the [examples](examples) directory.

## API

All methods are static.

| Method | Returns | Description |
| --- | --- | --- |
| `Kanji.getDetails(character)` | `Word \| null` | Details of a single character, or `null` if it is not in the dictionary. |
| `Kanji.search(options?)` | `Word[]` | Characters matching `options`, best matches first. |
| `Kanji.random()` | `Word` | A random character from the dictionary. |
| `Kanji.dump()` | `Word[]` | Every character in the dictionary. |

### Search options

| Option | Type | Description |
| --- | --- | --- |
| `grade` | `number \| { min?, max? }` | School grade, as an exact value or a range. Filters results. |
| `jlpt` | `number \| { min?, max? }` | JLPT level, as an exact value or a range. Filters results. |
| `meaning` | `string` | English meaning, matched fuzzily. Ranks results. |
| `romaji` | `string` | Reading in romaji, matched fuzzily against on'yomi and kun'yomi. Ranks results. |
| `sort` | `boolean` | Sort results by match score. Defaults to `true`. |

`grade` and `jlpt` remove characters that do not match. `meaning` and `romaji`
only change the order, so the closest matches come first but weaker matches are
still returned. Check the first few results rather than expecting a single one.

### `Word`

| Field | Type | Description |
| --- | --- | --- |
| `literal` | `string` | The character itself. |
| `meanings` | `string[]` | English meanings. |
| `onyomi` | `string[]` | On'yomi readings, in katakana. |
| `kunyomi` | `string[]` | Kun'yomi readings, in hiragana. |
| `stroke_count` | `number` | Number of strokes. |
| `grade` | `number \| null` | School grade: 1–6 for kyōiku kanji, 8 for the rest of the jōyō kanji, 9–10 for jinmeiyō kanji. |
| `jlpt` | `number \| null` | JLPT level from the **pre-2010** four-level test (4 is easiest, 1 is hardest). |
| `freq` | `number \| null` | Rank among the roughly 2,500 most used characters in newspapers (1 is most frequent). |

Fields marked `null` have no value for that character in KANJIDIC.

## Development

```shell
git clone https://github.com/eidoriantan/kanji.js.git
cd kanji.js
npm install
npm run build   # build dist/kanji.js (set NODE_ENV=production to also build kanji.min.js)
npm test        # lint, build and run the tests
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
and are checked by commitlint.

## Support and contributing

Found a bug or unexpected behavior? Please open an issue on
[GitHub issues](https://github.com/eidoriantan/kanji.js/issues). To contribute,
see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

Kanji.js is released under the [MIT License](LICENSE.txt).

The bundled dictionary data comes from [KANJIDIC], the property of the
[Electronic Dictionary Research and Development Group][EDRDG], and is used in
conformance with the Group's [licence][EDRDG-licence].

[homepage]: https://kanji.js.org
[KANJIDIC]: https://www.edrdg.org/wiki/index.php/KANJIDIC_Project
[EDRDG]: https://www.edrdg.org/
[EDRDG-licence]: https://www.edrdg.org/edrdg/licence.html
