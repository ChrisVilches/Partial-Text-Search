const R = require('ramda')

const concatKeysAt = R.curry((keys, separator, obj) => {
  let result = ''

  for (let i = 0; i < keys.length; i++) {
    if (i !== 0) result += separator
    result += obj[keys[i]]
  }

  return result
})

const stringOrNumber = R.either(R.is(String), R.is(Number))

// TODO: Test
const concatAllStrings = R.curry((separator, obj) => {
  let result = ''

  Object.entries(obj).forEach(([_, val]) => {
    if (stringOrNumber(val)) {
      if (result.length > 0) result += separator
      result += val
    }
  })

  return result
})

module.exports = {
  concatAllStrings,
  concatKeysAt
}
