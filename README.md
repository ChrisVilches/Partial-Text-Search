# Partial Text Search

## Install

```
npm install partial-text-search
```

## Usage

```javascript
const PartialTextSearch = require('partial-text-search')

const docList = [{ text: 'abc' }, { text: 'aabbcc' }]

const partialTextSearch = new PartialTextSearch(docList)

partialTextSearch.search('aa')
```

## Development

Tests:

```
npm run test
```

Format:

```
npm run format
```

Benchmarks:

```
node benchmarks/benchmark.js
node benchmarks/benchmark2.js 100000
```
