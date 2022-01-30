const R = require('ramda')
const { PartialTextSearch } = require('../../src/PartialTextSearch')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('PartialTextSearch', () => {
  describe('.constructor', () => {
    const docList = [
      { name: 'john', surname: 'yamamoto', age: 20 },
      { name: 'chris', surname: 'vilch', age: 21 },
      { name: 'nick', surname: 'mariangel', age: 22 }
    ]

    describe('when passing keys array (doc to string)', () => {
      const partialTextSearch = new PartialTextSearch(docList, ['name', 'age'])
      it('uses given keys to concatenate all strings', () => {
        expect(partialTextSearch.sa.string).to.eq('john|20chris|21nick|22')
      })
    })

    describe('when passing a function (doc to string)', () => {
      const partialTextSearch = new PartialTextSearch(docList, doc => (doc.age * 2) + R.reverse(doc.name) + doc.surname)
      it('converts each document using the given function, and concatenates all strings', () => {
        expect(partialTextSearch.sa.string).to.eq('40nhojyamamoto42sirhcvilch44kcinmariangel')
      })
    })

    describe('when passing nothing (doc to string)', () => {
      const partialTextSearch = new PartialTextSearch(docList)
      it('automatically extracts strings from each document, and concatenates all strings', () => {
        expect(partialTextSearch.sa.string).to.eq('john|yamamoto|20chris|vilch|21nick|mariangel|22')
      })
    })

    describe('when document list is empty', () => {
      const partialTextSearch = new PartialTextSearch([])
      it('has empty data', () => {
        expect(partialTextSearch.sa.string).to.eq('')
        expect(partialTextSearch.sa.length).to.eq(0)
      })
    })
  })
})
