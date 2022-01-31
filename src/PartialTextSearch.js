const R = require('ramda')
const { SuffixArray } = require('./SuffixArray')
const { concatValuesAtKeys, concatAllStrings, isArrayOfObjects } = require('./util')

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

const docSetFromRange = R.curry((suffixArray, docRanges, range, queryString, limit) => {
  const result = new Set()

  if (range.from == null || range.to == null) return result

  for (let i = range.from; i <= range.to; i++) {
    if (R.is(Number, limit) && result.size === limit) break

    const docId = findDocInRanges(docRanges, suffixArray.array[i], queryString)

    if (docId != null) {
      result.add(docId)
    }
  }

  return result
})

const docRankMapFromRange = R.curry((suffixArray, docRanges, range, queryString) => {
  const result = {}

  if (range.from == null || range.to == null) return result

  for (let i = range.from; i <= range.to; i++) {
    const docId = findDocInRanges(docRanges, suffixArray.array[i], queryString)

    if (docId != null) {
      result[docId] = result[docId] || 0
      result[docId]++
    }
  }

  return result
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

  return { docRanges, stringToIndex }
})

const DEFAULT_CONSTRUCTOR_OPTS = {
  docToString: null,
  beforeCreateSuffixArray: () => {},
  afterCreateSuffixArray: () => {},
  separator: '|'
}

class PartialTextSearch {
  constructor (docList, opts = {}) {
    if (!isArrayOfObjects(docList)) {
      throw new Error('Document list (constructor argument) must be an array of objects')
    }

    opts = R.mergeRight(DEFAULT_CONSTRUCTOR_OPTS, opts)
    const { separator, docToString } = opts

    let doc2str

    if (R.is(Array, docToString)) {
      doc2str = concatValuesAtKeys(separator, docToString)
    } else if (R.is(Function, docToString)) {
      doc2str = docToString
    } else {
      doc2str = concatAllStrings(separator)
    }

    const { stringToIndex, docRanges } = getDocRanges(docList, doc2str)

    this.docRanges = docRanges

    opts.beforeCreateSuffixArray(stringToIndex)
    const start = new Date()
    this.sa = new SuffixArray(stringToIndex)
    opts.afterCreateSuffixArray(start, new Date())
  }

  search (query, opts = {}) {
    if (R.isEmpty(query)) return new Set()
    const range = this.sa.suffixMatchRange(query)
    return docSetFromRange(this.sa, this.docRanges, range, query, opts.limit)
  }

  searchRanked (query) {
    if (R.isEmpty(query)) return {}
    const range = this.sa.suffixMatchRange(query)
    return docRankMapFromRange(this.sa, this.docRanges, range, query)
  }
}

module.exports = {
  PartialTextSearch
}
