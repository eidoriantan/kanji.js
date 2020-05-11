
# Kanji.js
[![Node.js CI](https://github.com/eidoriantan/kanji.js/workflows/Node.js%20CI/badge.svg)](https://github.com/eidoriantan/kanji.js/actions?query=workflow%3A%22Node.js+CI%22)
[![Build Status](https://travis-ci.com/eidoriantan/kanji.js.svg?branch=master)](https://travis-ci.com/eidoriantan/kanji.js)
[![npm](https://img.shields.io/npm/v/kanji.js/latest?registry_uri=https%3A%2F%2Fregistry.npmjs.com%2Fkanji.js&label=kanji.js@latest)](https://npmjs.com/kanji.js)
![Maintenance](https://img.shields.io/maintenance/yes/2020)

漢字 search/lookup library for Node.js and browsers.

This library uses the
[KANJIDIC](http://www.edrdg.org/wiki/index.php/KANJIDIC_Project) to search for
the characters. The dictionary file is included so that it will work with
browsers. The size of the distributed file is about ~2MB.

For examples, you can browse the
[examples](https://github.com/eidoriantan/kanji.js/tree/master/examples) folder.

### Features
 * Easy to use
 * Search function

## Installation
You can download the ready-to-use script at
[GitHub releases](https://github.com/eidoriantan/kanji.js/releases) or you can
build your own by cloning this repository using `git` then build it.

```shell
git clone https://github.com/eidoriantan/kanji.js.git
cd ./kanji.js
npm install
npm run build
```

You can also install this package by using `npm`:

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

Please browse the [documentations page](https://kanji.js.org/docs/kanji.html)
for more detailed information.

### Support
If you had found a bug or any unexpected behavior, you can submit an issue
through [GitHub issues](https://github.com/eidoriantan/kanji.js/issues). If you
wanted to contribute to this repository, please refer to
[CONTRIBUTING.md](https://github.com/eidoriantan/kanji.js/blob/master/CONTRIBUTING.md).

You can also show your support by becoming a patron!

[![Patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/eidoriantan)
