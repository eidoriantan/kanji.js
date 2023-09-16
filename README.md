
# Kanji.js

[![Node.js CI](https://github.com/eidoriantan/kanji.js/workflows/Node.js%20CI/badge.svg)](https://github.com/eidoriantan/kanji.js/actions?query=workflow%3A%22Node.js+CI%22)
[![npm](https://img.shields.io/npm/v/kanji.js/latest?registry_uri=https%3A%2F%2Fregistry.npmjs.com%2Fkanji.js&label=kanji.js@latest)](https://npmjs.com/kanji.js)
[![GitHub](https://img.shields.io/github/license/eidoriantan/kanji.js)](https://github.com/eidoriantan/kanji.js/blob/master/LICENSE.txt)

漢字 search/lookup library for Node.js and browsers. It uses the [KANJIDIC]
dictionary file to search/lookup for the characters. The dictionary file is
included so that it will work with browsers. The size of the distributed file
is about ~2MB.

Visit [kanji.js.org][homepage] to learn more about the library. You can also
explore the
[examples](https://github.com/eidoriantan/kanji.js/tree/master/examples)
directory for examples on how to use the library.

The website is also open sourced and can be viewed at
[gh-pages](https://github.com/eidoriantan/kanji.js/tree/gh-pages) branch.

### Features
* Easy to use
* Fuzzy search function

## Installation
You can download the ready-to-use script at
[GitHub releases](https://github.com/eidoriantan/kanji.js/releases). You can
also install this package by using [npm](https://www.npmjs.com/):

```shell
npm install --save kanji.js@latest
```

If you are using browser, you can just install the library through a CDN:

```
<script src="https://cdn.jsdelivr.net/npm/kanji.js@latest/dist/kanji.min.js">
```

## Usage
```javascript

Kanji.dump() // Returns an array of all the characters.

Kanji.getDetails('気')
//  {
//    freq: 113,
//    grade: 1,
//    jlpt: 4,
//    kunyomi: ["いき"],
//    literal: "気",
//    meanings: (5) ["spirit", "mind", "air", "atmosphere", "mood"],
//    onyomi: (2) ["キ", "ケ"],
//    stroke_count: 6
//  }

Kanji.search({
  grade: 1,
  meaning: 'counter for days'
})
//  [{
//    freq: 1,
//    grade: 1,
//    jlpt: 4,
//    kunyomi: (3) ["ひ", "-び", "-か"],
//    literal: "日",
//    meanings: (4) ["day", "sun", "Japan", "counter for days"],
//    onyomi: (2) ["ニチ", "ジツ"],
//    stroke_count: 4
//  }]
```

If you want a detailed documentations, please visit the documentations page at
[kanji.js.org][docs].

### Support
If you had found a bug or any unexpected behavior, you can submit an issue
through [GitHub issues](https://github.com/eidoriantan/kanji.js/issues). If you
wanted to contribute to this repository, please refer to
[CONTRIBUTING.md](https://github.com/eidoriantan/kanji.js/blob/master/CONTRIBUTING.md).

[homepage]: https://kanji.js.org
[docs]: https://kanji.js.org/docs/
[KANJIDIC]: http://www.edrdg.org/wiki/index.php/KANJIDIC_Project
