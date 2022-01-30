const R = require('ramda')
const { SuffixArray } = require('../src/SuffixArray')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const { randString } = require('./helpers')
const { spaceship } = require('../src/util')

const expectSuffixOrderIsCorrect = suffixArray => {
  const { string, array } = suffixArray

  const diff = (a, b) => spaceship(string.substr(a), string.substr(b))

  const sortedArray = R.sort(diff, array)

  expect(array).to.eql(sortedArray)
}

const simpleSA = new SuffixArray('eaacbbccdeabbcde')

describe('SuffixArray', () => {
  describe('construction', () => {
    it('has correct suffix array (strings)', () => {
      const suffixStrings = simpleSA.array.map(idx => simpleSA.string.substr(idx))
      const correctArray = [
        'aacbbccdeabbcde',
        'abbcde',
        'acbbccdeabbcde',
        'bbccdeabbcde',
        'bbcde',
        'bccdeabbcde',
        'bcde',
        'cbbccdeabbcde',
        'ccdeabbcde',
        'cde',
        'cdeabbcde',
        'de',
        'deabbcde',
        'e',
        'eaacbbccdeabbcde',
        'eabbcde'
      ]

      expect(suffixStrings).to.eql(correctArray)
    })
  })

  describe('.suffixMatchRange', () => {
    it('gets ranges correctly', () => {
      expect(simpleSA.suffixMatchRange('a')).to.eql(R.zipObj(['from', 'to'], [0, 2]))
      expect(simpleSA.suffixMatchRange('aa')).to.eql(R.zipObj(['from', 'to'], [0, 0]))
      expect(simpleSA.suffixMatchRange('bb')).to.eql(R.zipObj(['from', 'to'], [3, 4]))
      expect(simpleSA.suffixMatchRange('b')).to.eql(R.zipObj(['from', 'to'], [3, 6]))
      expect(simpleSA.suffixMatchRange('bc')).to.eql(R.zipObj(['from', 'to'], [5, 6]))
      expect(simpleSA.suffixMatchRange('bcc')).to.eql(R.zipObj(['from', 'to'], [5, 5]))
      expect(simpleSA.suffixMatchRange('bcd')).to.eql(R.zipObj(['from', 'to'], [6, 6]))
      expect(simpleSA.suffixMatchRange('cd')).to.eql(R.zipObj(['from', 'to'], [9, 10]))
      expect(simpleSA.suffixMatchRange('cde')).to.eql(R.zipObj(['from', 'to'], [9, 10]))
      expect(simpleSA.suffixMatchRange('c')).to.eql(R.zipObj(['from', 'to'], [7, 10]))
      expect(simpleSA.suffixMatchRange('de')).to.eql(R.zipObj(['from', 'to'], [11, 12]))
      expect(simpleSA.suffixMatchRange('dea')).to.eql(R.zipObj(['from', 'to'], [12, 12]))
      expect(simpleSA.suffixMatchRange('cbbccdeabbcde')).to.eql(R.zipObj(['from', 'to'], [7, 7]))
      expect(simpleSA.suffixMatchRange('eaacbbccdeabbcde')).to.eql(R.zipObj(['from', 'to'], [14, 14]))
      expect(simpleSA.suffixMatchRange('eaacbbccdeabbcd')).to.eql(R.zipObj(['from', 'to'], [14, 14]))
      expect(simpleSA.suffixMatchRange('eaacbbccdeabbc')).to.eql(R.zipObj(['from', 'to'], [14, 14]))
      expect(simpleSA.suffixMatchRange('eaacbbccdeabb')).to.eql(R.zipObj(['from', 'to'], [14, 14]))
    })

    it('gets null range when it does not exist', () => {
      expect(simpleSA.suffixMatchRange('sa')).to.eql(R.zipObj(['from', 'to'], [null, null]))
      expect(simpleSA.suffixMatchRange('f')).to.eql(R.zipObj(['from', 'to'], [null, null]))
      expect(simpleSA.suffixMatchRange('eaacbbccdeabbcdea')).to.eql(R.zipObj(['from', 'to'], [null, null]))
    })
  })

  describe('.equals', () => {
    it('matches the substring correctly', () => {
      expect(simpleSA.equals(2, 'a')).to.eq(true)
      expect(simpleSA.equals(2, 'ac')).to.eq(true)
      expect(simpleSA.equals(2, 'acbb')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbcc')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbccde')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbccdeab')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbccdeabb')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbccdeabbcde')).to.eq(true)
      expect(simpleSA.equals(2, 'acbbccdeabbcdee')).to.eq(false)
      expect(simpleSA.equals(13, 'a')).to.eq(false)
      expect(simpleSA.equals(13, 'e')).to.eq(true)
      expect(simpleSA.equals(5, 'bc')).to.eq(true)
      expect(simpleSA.equals(5, 'bccd')).to.eq(true)
      expect(simpleSA.equals(5, 'bccdea')).to.eq(true)
      expect(simpleSA.equals(5, 'bccdeabbcde')).to.eq(true)
      expect(simpleSA.equals(5, 'xbc')).to.eq(false)
      expect(simpleSA.equals(5, 'bxc')).to.eq(false)
      expect(simpleSA.equals(5, 'bccxd')).to.eq(false)
      expect(simpleSA.equals(5, 'bccdxea')).to.eq(false)
      expect(simpleSA.equals(5, 'bccdeabxbcde')).to.eq(false)
    })

    it('matches even with an empty string', () => {
      expect(simpleSA.equals(0, '')).to.eq(true)
      expect(simpleSA.equals(1, '')).to.eq(true)
      expect(simpleSA.equals(2, '')).to.eq(true)
      expect(simpleSA.equals(3, '')).to.eq(true)
      expect(simpleSA.equals(4, '')).to.eq(true)
      expect(simpleSA.equals(5, '')).to.eq(true)
    })
  })

  describe('.lt', () => {
    it('compares the substring correctly', () => {
      expect(simpleSA.lt(2, 'acbbccdeabbcde')).to.eq(false)
      expect(simpleSA.lt(2, 'acbbccdeabb')).to.eq(false)
      expect(simpleSA.lt(2, 'a')).to.eq(false)
      expect(simpleSA.lt(2, 'acbbcddeabbcde')).to.eq(true)
      expect(simpleSA.lt(2, 'ad')).to.eq(true)
      expect(simpleSA.lt(2, 'b')).to.eq(true)
    })

    it('compares empty string correctly', () => {
      expect('aaaa' < '').to.eq(false)
      expect(R.empty('') < '').to.eq(false)
      expect(simpleSA.lt(0, '')).to.eq(false)
      expect(simpleSA.lt(1, '')).to.eq(false)
      expect(simpleSA.lt(2, '')).to.eq(false)
      expect(simpleSA.lt(3, '')).to.eq(false)
      expect(simpleSA.lt(4, '')).to.eq(false)
      expect(simpleSA.lt(5, '')).to.eq(false)
    })
  })

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
      expectSuffixOrderIsCorrect(new SuffixArray(randString('|', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('|$', 1000)))
    })

    it('has correct order even when Japanese is used', () => {
      expectSuffixOrderIsCorrect(new SuffixArray(randString('通用字体は、常用漢字表に掲げられた「印刷文字における現代の通用字体」を示した[2]。手書き文字（筆写の楷書）の字形と印刷文字の字形に関しては、常用漢字表の字体・字形に関する指針 (PDF) （文化審議会国語分科会報告）を参照。', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('常用漢字は2136字。下表の配列は常用漢字表（平成22年内閣告示第2号）に準じる。', 1000)))
      expectSuffixOrderIsCorrect(new SuffixArray(randString('こんにちは漢字埼玉ひらがなかたかな記号名字東京', 1000)))
    })
  })
})
