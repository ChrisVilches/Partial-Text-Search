const Benchmark = require('benchmark')
const SuffixArrayMnemonist = require('mnemonist/suffix-array')
const { SuffixArray } = require('../src/SuffixArray')
const { randString } = require('../test/helpers')

const stringLength = +(process.argv[2] || 0)

if (isNaN(stringLength) || stringLength <= 0) {
  console.log('First argument must be string length (positive number)')
  process.exit(1)
}

console.log(`Generating a string of length ${stringLength}`)

const alphabet = 'qwertyuioasdfghjklzxcvbnm &({`*$#"%(~{}*`通用字体は、常用漢字表に掲げられた「印刷文字に})}'

const suite = new Benchmark.Suite()

const str = randString(alphabet, stringLength)

suite.add('Custom suffix array', () => new SuffixArray(str))
suite.add('mnemonist', () => new SuffixArrayMnemonist(str))

suite.on('complete', () => {
  suite.forEach(benchmark => {
    console.log(`${benchmark.name} | ${benchmark.hz} ops/sec (${1 / benchmark.hz}s per op) | Stats sample length: ${benchmark.stats.sample.length}`)
  })

  console.log('Fastest: ' + suite.filter('fastest').map('name'))
  console.log('Slowest: ' + suite.filter('slowest').map('name'))
})

suite.run({ async: false })
