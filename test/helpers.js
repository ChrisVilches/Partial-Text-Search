const R = require('ramda')
const _ = require('lodash')

const alphabet = 'abbacbacbasd$jaひらがな かたかな 感じ　漢字　記号sdsad%kjnqwkeisa!)"(sadksdnk'

const randString = R.curry((alphabet, length) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += _.sample(alphabet)
  }
  return result
})

const defaultRandString = randString(alphabet)

const createDoc = R.curry((keys, stringLength) => {
  const result = {}

  keys.forEach(k => { result[k] = defaultRandString(stringLength) })

  return result
})

const createDocList = R.curry((docKeys, docStringLength, docN) => {
  const result = []
  for (let i = 0; i < docN; i++) result.push(createDoc(docKeys, docStringLength))
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

  for (let i = 0; i < docList.length; i++) {
    keys.forEach(k => {
      if (R.includes(queryString, docList[i][k])) {
        result.add(i)
      }
    })
  }

  return result
})

module.exports = {
  defaultRandString,
  createDocList,
  numberSetToString,
  takeSomeRandomItems,
  getDocsNaive
}
