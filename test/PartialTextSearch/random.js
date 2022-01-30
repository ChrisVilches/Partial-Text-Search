const R = require('ramda')
const { PartialTextSearch } = require('../../src/PartialTextSearch')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const { createDocList, defaultRandString, numberSetToString, takeSomeRandomItems, getDocsNaive, getDocsRankMapNaive } = require('../helpers')

const createTestCase = (docKeys, docStringLength, docN, queryN, queryLength) => {
  const docList = createDocList(docKeys, docStringLength, docN)
  const keysToIndex = takeSomeRandomItems(docKeys)
  const partialTextSearch = new PartialTextSearch(docList, keysToIndex)

  describe(`with ${docN} documents with structure { ${docKeys.join(', ')} }. Using keys { ${keysToIndex.join(', ')} } for indexation. Query length: ${queryLength}.`, () => {
    for (let i = 0; i < queryN; i++) {
      const query = defaultRandString(queryLength)
      const naiveSet = getDocsNaive(docList, keysToIndex, query)
      const naiveRankMap = getDocsRankMapNaive(docList, keysToIndex, query)

      it(`Find query '${query}' and return ${numberSetToString(naiveSet)}`, done => {
        const fastSet = partialTextSearch.search(query)
        const fastRankMap = partialTextSearch.searchRanked(query)

        expect(R.is(Set, fastSet)).to.eq(true)
        expect(R.is(Set, naiveSet)).to.eq(true)
        expect(fastSet).to.eql(naiveSet)

        expect(R.is(Object, naiveRankMap)).to.eq(true)
        expect(R.is(Object, fastRankMap)).to.eq(true)
        expect(fastRankMap).to.eql(naiveRankMap)

        done()
      })
    }
  })
}

// createTestCase = (docKeys, docStringLength, docN, queryN, queryLength)
createTestCase(['text', 'conclusion', 'about'], 100, 300, 20, 3)
createTestCase(['name', 'surname', 'bio', 'hobby'], 500, 300, 20, 3)
createTestCase(['a', 'b', 'c', 'd'], 500, 300, 20, 5)
createTestCase(['ww', 'xx', 'yy', 'zz'], 500, 300, 20, 10)
createTestCase(['a', 'b', 'c', 'd'], 100, 1000, 100, 1)
createTestCase(['a', 'b', 'c', 'd'], 100, 1000, 100, 2)
createTestCase(['a', 'b', 'c', 'd'], 100, 1000, 100, 3)
createTestCase(['a', 'b', 'c', 'd'], 100, 1000, 100, 4)
createTestCase(['a', 'b', 'c', 'd'], 10, 10, 200, 2)
createTestCase(['a', 'b', 'c', 'd'], 0, 100, 100, 0)
createTestCase(['a', 'b', 'c', 'd'], 1, 100, 100, 0)
createTestCase(['a', 'b', 'c', 'd'], 0, 100, 100, 1)
createTestCase(['a', 'b', 'c', 'd'], 1, 100, 200, 1)
createTestCase(['a', 'b', 'c', 'd'], 2, 100, 200, 1)
createTestCase(['a', 'b', 'c', 'd'], 1, 100, 200, 2)
createTestCase(['a', 'b', 'c', 'd'], 2, 100, 200, 2)
createTestCase(['a', 'b', 'c', 'd'], 2, 100, 10, 500)
createTestCase(['a', 'b', 'c', 'd'], 2, 100, 10, 10000)

// Small datasets

describe('PartialTextSearch', () => {
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 5; j++) {
      createTestCase(['a', 'b', 'c', 'd'], 50, i, 200, j)
    }
  }
})
