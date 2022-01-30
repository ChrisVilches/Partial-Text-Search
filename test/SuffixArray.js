const R = require('ramda')
const { SuffixArray } = require('../src/SuffixArray')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const { randString } = require('./helpers')

const expectSuffixOrderIsCorrect = suffixArray => {
  const { string, array } = suffixArray

  const diff = (a, b) => {
    if (string.substr(a) === string.substr(b)) return 0
    if (string.substr(a) < string.substr(b)) return -1
    return 1
  }
  const sortedArray = R.sort(diff, array)

  expect(array).to.eql(sortedArray)
}

describe('SuffixArray', () => {
  describe('suffix order', () => {
    it('has correct order', () => {
      expectSuffixOrderIsCorrect(new SuffixArray(randString('abcbacbababcbacbaccbacsbac', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('abcdefghijklmnopqrstuvwxyz', 1000)))
    })

    it('has correct order even when symbols are used', () => {
      expectSuffixOrderIsCorrect(new SuffixArray(randString('$!\'"(!"&\'("\'#&\\(#\'(("&#"\'#)', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('((`{}*{`=::]@[;:l-/__\\@O_~))(&$;', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('((`{}*{`=::]@[;:labcdefghijklmnopqrstuvwxyz-/__\\@O_~))(&$;', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('$', 1000)))
    })

    it('has correct order even when Japanese is used', () => {
      expectSuffixOrderIsCorrect(new SuffixArray(randString('通用字体は、常用漢字表に掲げられた「印刷文字における現代の通用字体」を示した[2]。手書き文字（筆写の楷書）の字形と印刷文字の字形に関しては、常用漢字表の字体・字形に関する指針 (PDF) （文化審議会国語分科会報告）を参照。', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('常用漢字は2136字。下表の配列は常用漢字表（平成22年内閣告示第2号）に準じる。', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('こんにちは漢字埼玉ひらがなかたかな記号名字東京', 1000)))
    })
  })
})
