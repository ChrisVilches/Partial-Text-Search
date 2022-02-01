const R = require('ramda')
const { PartialTextSearch } = require('../../src/PartialTextSearch')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const { createDocList } = require('../helpers')

describe('PartialTextSearch', () => {
  describe('.search', () => {
    it('returns empty set when the query string is empty', () => {
      const partialTextSearch = new PartialTextSearch(createDocList(['a', 'b', 'c'], 100, 100))
      expect(partialTextSearch.search('').size).to.eq(0)
    })

    it('limits the results when setting the flag', () => {
      const partialTextSearch = new PartialTextSearch([{ text: 'aaa' }, { text: 'abaa' }, { text: 'bbba' }])

      expect(partialTextSearch.search('aaa').size).to.eq(1)
      expect(partialTextSearch.search('aa').size).to.eq(2)
      expect(partialTextSearch.search('a').size).to.eq(3)
      expect(partialTextSearch.search('aaa', { limit: 10 }).size).to.eq(1)
      expect(partialTextSearch.search('aaa', { limit: 0 }).size).to.eq(0)
      expect(partialTextSearch.search('aa', { limit: 2 }).size).to.eq(2)
      expect(partialTextSearch.search('aa', { limit: 1 }).size).to.eq(1)
      expect(partialTextSearch.search('a', { limit: 4 }).size).to.eq(3)
      expect(partialTextSearch.search('a', { limit: 3 }).size).to.eq(3)
      expect(partialTextSearch.search('a', { limit: 2 }).size).to.eq(2)
      expect(partialTextSearch.search('a', { limit: 1 }).size).to.eq(1)
      expect(partialTextSearch.search('a', { limit: 0 }).size).to.eq(0)
    })

    it('the separator gets matched if not used properly', () => {
      const partialTextSearch = new PartialTextSearch([{ text: 'abc', bio: 'def' }, { text: 'xy', bio: 'z' }])

      expect(partialTextSearch.search('abc|def').size).to.eq(1)
      expect(partialTextSearch.search('xy|z').size).to.eq(1)
      expect(partialTextSearch.search('abcdef').size).to.eq(0)
      expect(partialTextSearch.search('xyz').size).to.eq(0)
    })

    it('supports case insensitive search using a workaround (query must also be lowercased manually)', () => {
      const textToLowerCase = R.compose(R.toLower, R.prop('text'))
      const partialTextSearch = new PartialTextSearch([{ text: 'cHRiS' }, { text: 'vIlCh' }, { text: 'heLLo' }], { docToString: textToLowerCase })

      expect(partialTextSearch.search('h').size).to.eq(3)
      expect(partialTextSearch.search('H').size).to.eq(0)
      expect(partialTextSearch.search('e').size).to.eq(1)
      expect(partialTextSearch.search('e').size).to.eq(1)
      expect(partialTextSearch.search('ello').size).to.eq(1)
      expect(partialTextSearch.search('i').size).to.eq(2)
    })
  })

  describe('.searchRanked', () => {
    it('counts occurrences correctly', () => {
      const partialTextSearch = new PartialTextSearch([{ text: 'aaa' }, { text: 'abaa' }, { text: 'bbba' }])

      expect(partialTextSearch.searchRanked('aaaaa')).to.eql({})
      expect(partialTextSearch.searchRanked('a')).to.eql(R.zipObj([0, 1, 2], [3, 3, 1]))
      expect(partialTextSearch.searchRanked('aa')).to.eql(R.zipObj([0, 1], [2, 1]))
      expect(partialTextSearch.searchRanked('aaa')).to.eql(R.zipObj([0], [1]))
      expect(partialTextSearch.searchRanked('b')).to.eql(R.zipObj([1, 2], [1, 3]))
      expect(partialTextSearch.searchRanked('bb')).to.eql(R.zipObj([2], [2]))
      expect(partialTextSearch.searchRanked('bbb')).to.eql(R.zipObj([2], [1]))
      expect(partialTextSearch.searchRanked('bbbb')).to.eql({})
    })

    it('counts overlapping strings correctly', () => {
      const partialTextSearch = new PartialTextSearch([{ text: 'gagagagagaga' }, { text: 'gagagaga' }, { text: 'gagaga' }])

      expect(partialTextSearch.searchRanked('gagaga')).to.eql(R.zipObj([0, 1, 2], [4, 2, 1]))
      expect(partialTextSearch.searchRanked('gagagag')).to.eql(R.zipObj([0, 1], [3, 1]))
    })
  })
})
