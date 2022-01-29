const { SuffixArray } = require('mnemonist')
const R = require('ramda')
const _ = require('lodash')

function spaceship (val1, val2) {
  if ((val1 === null || val2 === null) || (typeof val1 !== typeof val2)) {
    return null
  }
  if (typeof val1 === 'string') {
    return (val1).localeCompare(val2)
  } else {
    if (val1 > val2) {
      return 1
    } else if (val1 < val2) {
      return -1
    }
    return 0
  }
}

const randString = R.curry((alphabet, length) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += _.sample(alphabet)
  }
  return result
})

const createDoc = () => {
  const alphabet = 'aabbcccdddeef'
  const length = 100
  return {
    title: randString(alphabet, length),
    text: randString(alphabet, length),
    about: randString(alphabet, length),
    conclusion: randString(alphabet, length)
  }
}

const docList = [
  createDoc(),
  createDoc(),
  createDoc(),
  createDoc(),
  createDoc(),
  createDoc(),
  createDoc()
]

let string = ''

for (let i = 0; i < docList.length; i++) {
  string += docList[i].text + docList[i].conclusion + '<'
}

const suffixArray = new SuffixArray(string)

const myArray = []

for (let i = 0; i < suffixArray.string.length; i++) {
  myArray.push(i)
}

myArray.sort((a, b) => spaceship(string.substr(a), string.substr(b)))

if (!R.equals(myArray, suffixArray.array)) {
  throw new Error('suffix arrays are not equal')
}

for (let i = 0; i < suffixArray.array.length; i++) {
  // console.log(string.substr(suffixArray.array[i]))
}

const query = 'abc'

const matches = R.curry((suffixArray, idx, query) => {
  const posInString = suffixArray.array[idx]
  let i = 0

  // console.log(`comparison of ${query} and ${suffixArray.string.substr(posInString)}`)

  for (; i < query.length && posInString + i < suffixArray.string.length; i++) {
    if (query[i] !== suffixArray.string[posInString + i]) {
      return false
    }
  }

  return i === query.length
})

let first = null
let last = null

for (let i = 0; i < suffixArray.array.length; i++) {
  if (matches(suffixArray, i, query)) {
    first = first || i
    last = i
  }
}

console.log(first, last)

if (first != null && last != null) {
  console.log(`query: ${query}`)
  for (let i = first - 1; i <= last + 1; i++) {
    console.log(suffixArray.string.substr(suffixArray.array[i]))
    console.log()
  }
}
