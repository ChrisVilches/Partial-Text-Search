const { spaceship } = require('./util')

function buildSuffixArray (s) {
  const S = s.length
  const sa = new Array(S)
  const ranks = new Array(S)
  const tmp = new Array(S)
  let gap

  for (let i = 0; i < S; i++) {
    sa[i] = i
    tmp[i] = 0
    ranks[i] = s[i]
  }

  const cmp = (x, y) => {
    if (ranks[x] !== ranks[y]) return spaceship(ranks[x], ranks[y])
    x += gap
    y += gap

    return x < S && y < S ? spaceship(ranks[x], ranks[y]) : spaceship(y, x)
  }

  for (gap = 1; tmp[S - 1] < S - 1; gap <<= 1) {
    sa.sort(cmp)

    for (let i = 1; i < S; i++) {
      tmp[i] = tmp[i - 1] + (cmp(sa[i - 1], sa[i]) === -1 ? 1 : 0)
    }

    for (let i = 0; i < S; i++) {
      ranks[sa[i]] = tmp[i]
    }
  }

  return sa
}

const binarySearch = (first, sa, x) => {
  let low = 0
  let high = sa.array.length - 1
  let result = -1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    if (sa.equals(mid, x)) {
      result = mid
      if (first) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    } else if (sa.lt(mid, x)) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return result === -1 ? null : result
}

class SuffixArray {
  constructor (s) {
    this.string = s
    this.length = s.length
    this.array = buildSuffixArray(s)
  }

  lt (idx, query) {
    const posInString = this.array[idx]

    for (let i = 0; i < query.length; i++) {
      if (posInString + i >= this.string.length) return true

      const c = this.string[posInString + i]
      if (query[i] !== c) return c < query[i]
    }

    return false
  }

  equals (idx, query) {
    const posInString = this.array[idx]
    for (let i = 0; i < query.length; i++) {
      const c = this.string[posInString + i]
      if (query[i] !== c) return false
    }

    return true
  }

  suffixMatchRange (queryString) {
    return {
      from: binarySearch(true, this, queryString),
      to: binarySearch(false, this, queryString)
    }
  }
}

module.exports = {
  SuffixArray
}
