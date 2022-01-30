const R = require('ramda')
const { SuffixArray } = require('./SuffixArray')
const { concatValuesAtKeys, concatAllStrings } = require('./util')

const findDocInRanges = (docRanges, idxInFullString, queryString) => {
  let low = 0
  let high = docRanges.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const doc = docRanges[mid]

    if (idxInFullString < doc.from) {
      high = mid
    } else if (doc.to < idxInFullString) {
      low = mid + 1
    } else if (idxInFullString + queryString.length - 1 <= doc.to) {
      return mid
    } else {
      return null
    }
  }

  throw new Error('solution should exist')
}

const docSetFromRange = R.curry((suffixArray, docRanges, range, queryString) => {
  const fastSet = new Set()

  if (range.from == null || range.to == null) return fastSet

  for (let i = range.from; i <= range.to; i++) {
    const docId = findDocInRanges(docRanges, suffixArray.array[i], queryString)

    if (docId != null) {
      fastSet.add(docId)
    }
  }

  return fastSet
})

const getDocRanges = R.curry((docList, docToString) => {
  const docRanges = []
  let stringToIndex = ''
  for (let i = 0; i < docList.length; i++) {
    const docString = docToString(docList[i])

    const from = stringToIndex.length
    stringToIndex += docString
    const to = stringToIndex.length - 1

    docRanges.push({ from, to })
  }

  return {
    docRanges,
    stringToIndex
  }
})

class PartialTextSearch {
  constructor (docList, docToString) {
    let doc2str

    // TODO: Test conversion
    if (R.is(Array, docToString)) {
      doc2str = concatValuesAtKeys('|', docToString)
    } else if (R.is(Function, docToString)) {
      doc2str = docToString
    } else {
      doc2str = concatAllStrings('|')
    }

    const { stringToIndex, docRanges } = getDocRanges(docList, doc2str)

    this.docRanges = docRanges
    this.sa = new SuffixArray(stringToIndex)
  }

  search (query) {
    const range = this.sa.suffixMatchRange(query)
    return docSetFromRange(this.sa, this.docRanges, range, query)
  }
}

module.exports = {
  PartialTextSearch
}
