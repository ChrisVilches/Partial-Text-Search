class Suffix {
  constructor (ind, r, nr) {
    this.index = ind
    this.rank = r
    this.next = nr
  }
}

function buildSuffixArray (s) {
  const n = s.length
  const su = new Array(n)

  for (let i = 0; i < n; i++) {
    su[i] = new Suffix(i, s[i].charCodeAt(0), 0)
  }

  for (let i = 0; i < n; i++) { su[i].next = (i + 1 < n ? su[i + 1].rank : -1) }

  su.sort(function (a, b) {
    if (a.rank !== b.rank) { return a.rank - b.rank } else { return a.next - b.next }
  })

  const ind = new Array(n)

  for (let length = 4; length < 2 * n; length <<= 1) {
    let rank = 0; let prev = su[0].rank
    su[0].rank = rank
    ind[su[0].index] = 0
    for (let i = 1; i < n; i++) {
      if (su[i].rank === prev &&
        su[i].next === su[i - 1].next) {
        prev = su[i].rank
        su[i].rank = rank
      } else {
        prev = su[i].rank
        su[i].rank = ++rank
      }
      ind[su[i].index] = i
    }

    for (let i = 0; i < n; i++) {
      const nextP = su[i].index + length / 2
      su[i].next = nextP < n
        ? su[ind[nextP]].rank
        : -1
    }

    su.sort(function (a, b) {
      if (a.rank !== b.rank) { return a.rank - b.rank } else { return a.next - b.next }
    })
  }

  const suf = new Array(n)

  for (let i = 0; i < n; i++) { suf[i] = su[i].index }

  return suf
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
