const R = require('ramda')

// TODO: Must benchmark these ways to build strings. Find the fastest one for each strategy (keys/auto).

const concatValuesAtKeys = R.curry((separator, keys, obj) => {
  let result = ''

  for (let i = 0; i < keys.length; i++) {
    const val = obj[keys[i]]

    if (R.isEmpty(val) || val == null) continue
    if (i !== 0) result += separator
    result += val
  }

  return result
})

const stringOrNumber = R.either(R.is(String), R.is(Number))

const concatAllStrings = R.curry((separator, obj) => {
  let result = ''

  Object.entries(obj).forEach(([_, val]) => {
    if (stringOrNumber(val) && !R.isEmpty(val)) {
      if (result.length > 0) result += separator
      result += val
    }
  })

  return result
})

const spaceship = (a, b) => a === b ? 0 : (a < b ? -1 : 1)

const isNonNullObject = x => x != null && typeof x === 'object'

const isArrayOfObjects = R.both(R.is(Array), R.all(isNonNullObject))

module.exports = {
  concatAllStrings,
  concatValuesAtKeys,
  spaceship,
  isArrayOfObjects
}
