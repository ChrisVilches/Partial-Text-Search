const { expect } = require('chai')
const { describe, it } = require('mocha')
const { concatAllStrings, concatValuesAtKeys, isArrayOfObjects } = require('../src/util')

describe('concatAllStrings', () => {
  it('concatenates strings correctly', () => {
    expect(concatAllStrings('|', { name: 'my name is christopher' })).to.eq('my name is christopher')
    expect(concatAllStrings('|', { name: 'chris', surname: 'vilches' })).to.eq('chris|vilches')
    expect(concatAllStrings('', { name: 'chris', surname: 'vilches' })).to.eq('chrisvilches')
    expect(concatAllStrings('|', { a: 'a', b: 'b', c: 'c' })).to.eq('a|b|c')
    expect(concatAllStrings('|', { a: 'aa', b: 'bb', c: 'cc' })).to.eq('aa|bb|cc')
    expect(concatAllStrings('|', { a: 1, b: 2, c: 3 })).to.eq('1|2|3')
    expect(concatAllStrings('|', { a: 1 })).to.eq('1')
  })

  it('skips empty strings', () => {
    expect(concatAllStrings('|', { a: 'a', b: 'b', c: '' })).to.eq('a|b')
    expect(concatAllStrings('|', { a: 'aa', b: '', c: 'cc' })).to.eq('aa|cc')
  })

  it('skips booleans, objects, and functions', () => {
    expect(concatAllStrings('|', { a: 'a', b: 'b', c: true })).to.eq('a|b')
    expect(concatAllStrings('|', { a: 'aa', b: () => {}, c: 'cc' })).to.eq('aa|cc')
    expect(concatAllStrings('|', { a: null, b: () => {}, c: [] })).to.eq('')
  })

  it('only extracts strings in the first level of nesting', () => {
    expect(concatAllStrings('|', { a: 'a', b: 'b', c: { name: 'chris' } })).to.eq('a|b')
  })
})

describe('concatValuesAtKeys', () => {
  it('extracts the value of given keys and concatenates all', () => {
    expect(concatValuesAtKeys('|', ['name', 'age'], { name: 'chris', age: 10, surname: 'vilch' })).to.eq('chris|10')
    expect(concatValuesAtKeys('|', ['age'], { name: 'chris', age: 11, surname: 'vilch' })).to.eq('11')
    expect(concatValuesAtKeys('|', ['name'], { name: 'chris', age: 12, surname: 'vilch' })).to.eq('chris')
    expect(concatValuesAtKeys('|', [], { name: 'chris', age: 12, surname: 'vilch' })).to.eq('')
  })

  it('supports different separators', () => {
    expect(concatValuesAtKeys('|', ['name', 'surname'], { name: 'chris', age: 10, surname: 'vilch' })).to.eq('chris|vilch')
    expect(concatValuesAtKeys('', ['name', 'surname'], { name: 'chris', age: 10, surname: 'vilch' })).to.eq('chrisvilch')
    expect(concatValuesAtKeys('-', ['name', 'surname'], { name: 'chris', age: 10, surname: 'vilch' })).to.eq('chris-vilch')
  })
})

describe('isArrayOfObjects', () => {
  it('verifies the type correctly (correct data type)', () => {
    expect(isArrayOfObjects([])).to.eq(true)
    expect(isArrayOfObjects([{}])).to.eq(true)
    expect(isArrayOfObjects([{}, {}])).to.eq(true)
    expect(isArrayOfObjects([{ a: 1 }, { b: 4 }])).to.eq(true)
    expect(isArrayOfObjects([[], []])).to.eq(true)
  })

  it('verifies the type correctly (incorrect data type)', () => {
    expect(isArrayOfObjects(1)).to.eq(false)
    expect(isArrayOfObjects(null)).to.eq(false)
    expect(isArrayOfObjects({}, {})).to.eq(false)
    expect(isArrayOfObjects('aaaa')).to.eq(false)
    expect(isArrayOfObjects('aaaa')).to.eq(false)
    expect(isArrayOfObjects(false)).to.eq(false)
    expect(isArrayOfObjects(() => {})).to.eq(false)
    expect(isArrayOfObjects([() => {}])).to.eq(false)
    expect(isArrayOfObjects([() => {}, () => {}])).to.eq(false)
    expect(isArrayOfObjects(['aa', 'bb'])).to.eq(false)
    expect(isArrayOfObjects([true, false])).to.eq(false)
    expect(isArrayOfObjects([10, 100])).to.eq(false)
    expect(isArrayOfObjects([null, null])).to.eq(false)
  })
})
