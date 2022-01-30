const movies = require('./moviedata')
const { PartialTextSearch } = require('../src/PartialTextSearch')
const R = require('ramda')
const util = require('util')

const docToString = doc => doc.title + '|' + (doc.info.directors || []).join('') + '|' + doc.info.plot + '|' + (doc.info.genres || []).join('') + '|' + (doc.info.actors || []).join('|')

// const docToString = doc => doc.title + '|' + doc.info.plot

const formatDateDiffSeconds = (start, end) => `${(end - start) / 1000}s`

const printFormatted = R.compose(
  console.log,
  s => s + '\n',
  formatDateDiffSeconds
)

const measure = (title, fn) => {
  const start = new Date()
  console.log(`Measuring: ${title}`)
  const result = fn()

  if (result) console.log(`Returned: ${util.inspect(result)}`)

  return printFormatted(start, new Date())
}

let partialTextSearch

measure(`new PartialTextSearch (index ${movies.length} documents)`, () => {
  partialTextSearch = new PartialTextSearch(movies, {
    docToString,
    beforeCreateSuffixArray: string => { console.log(`  Creating suffix array. Total string length: ${string.length}...`) },
    afterCreateSuffixArray: (start, end) => { console.log(`  Created suffix array in ${formatDateDiffSeconds(start, end)}.`) }
  })
})
measure("partialTextSearch.search 'hello'", () => partialTextSearch.search('hello').size)
measure("partialTextSearch.search 'big'", () => partialTextSearch.search('big', { limit: 50 }).size)
measure("partialTextSearch.search 'international'", () => partialTextSearch.search('international', { limit: 50 }).size)
measure("partialTextSearch.search 'the'", () => partialTextSearch.search('the', { limit: 60 }).size)
