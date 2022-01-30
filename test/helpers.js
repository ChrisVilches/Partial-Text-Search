const R = require('ramda')
const _ = require('lodash')

const alphabet = 'abbacbacbasd$jaひらがな かたかな 感じ　漢字　記号sdsad%kjnqwkeisa!)"(sadksdnk'

const randString = R.curry((alphabet, length) => {
  const result = new Array(length)
  for (let i = 0; i < length; i++) {
    result[i] = _.sample(alphabet)
  }
  return result.join('')
})

const defaultRandString = randString(alphabet)

const createDoc = R.curry((keys, stringLength) => {
  const result = {}

  keys.forEach(k => { result[k] = defaultRandString(stringLength) })

  return result
})

const createDocList = R.curry((docKeys, docStringLength, docN) => {
  const result = new Array(docN)
  for (let i = 0; i < docN; i++) result[i] = createDoc(docKeys, docStringLength)
  return result
})

const numberSetToString = s => {
  if (!s.size) return '(Empty)'

  return Array.from(s).sort((a, b) => a - b).join(', ')
}

const takeSomeRandomItems = array => {
  array = _.shuffle(array)
  const n = _.random(1, array.length)
  return _.take(array, n)
}

const getDocsNaive = R.curry((docList, keys, queryString) => {
  const result = new Set()

  if (R.isEmpty(queryString)) return result

  for (let i = 0; i < docList.length; i++) {
    keys.forEach(k => {
      if (R.includes(queryString, docList[i][k])) {
        result.add(i)
      }
    })
  }

  return result
})

const occurrences = (string, subString, allowOverlapping = true) => {
  string += ''
  subString += ''
  if (subString.length <= 0) return (string.length + 1)

  let n = 0
  let pos = 0
  const step = allowOverlapping ? 1 : subString.length

  while (true) {
    pos = string.indexOf(subString, pos)
    if (pos >= 0) {
      n++
      pos += step
    } else break
  }
  return n
}

const getDocsRankMapNaive = R.curry((docList, keys, queryString) => {
  const result = {}

  if (R.isEmpty(queryString)) return result

  for (let i = 0; i < docList.length; i++) {
    keys.forEach(k => {
      const count = occurrences(docList[i][k], queryString)

      if (count > 0) {
        result[i] = result[i] || 0
        result[i] += count
      }
    })
  }

  return result
})

module.exports = {
  randString,
  defaultRandString,
  createDocList,
  numberSetToString,
  takeSomeRandomItems,
  getDocsNaive,
  getDocsRankMapNaive
}
