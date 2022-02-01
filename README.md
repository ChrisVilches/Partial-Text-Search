# Partial Text Search

A JavaScript library that finds string patterns in a collection of documents. It efficiently finds matches even if the words in each document do not begin with the query pattern.

The result of each query is a set containing the document indices where the query pattern is contained.

It uses the suffix array data structure to achieve high performance queries.

## Basic usage

```javascript
const PartialTextSearch = require('partial-text-search')

const docs = [
  { title: 'the beatles', summary: 'the beatles were an english rock band formed in liverpool in 1960.' },
  { title: 'blackpink', summary: 'blackpink is a south korean girl group formed by yg entertainment, consisting of members jisoo, jennie, rose, and lisa.' }
]

const partialTextSearch = new PartialTextSearch(docs)

partialTextSearch.search('li')
// Set { 1, 0 }

partialTextSearch.search('liv')
// Set { 0 }
```

## Install

```
npm install partial-text-search
```

## Advanced

### .searchRanked method

Instead of a document index set, you can get an object that maps each document to the amount of occurrences found.

```javascript
partialTextSearch.searchRanked('a')
/*
{
  '0': 42,
  '1': 311,
  '2': 23
}
*/
```

### Limit the results

Add the `limit` option to get fewer results:

```javascript
partialTextSearch.search('aaa')
// Set { 0, 1, 2, 3, 4, 5 }

partialTextSearch.search('aaa', { limit: 3 })
// Set { 0, 1, 2 }
```

This option is only available for the `.search` method, and not for `.searchRanked`.

The decision of which ones to return or omit is completely arbitrary.

### Ways to index each document

In order for the suffix array to work properly, it's necessary to reduce each document to a single string before indexing them.

By default this library will examine each document and extract (from the first level of nesting only) all strings and numbers (converted to strings) and concatenate them to create a single string.

```javascript
const doc = {
  title: 'hello world',
  body: 'document content',
  info: {
    year: 2000
  }
}
```

In this example, the resulting string to be indexed for this document will be `hello world|document content`. Note that the `info` field was ignored.

Plus, note that a separator `|` was added between the two fields. Read more about the [separator](#separator).

There are more ways to convert documents to strings, which are described next.

#### Index only certain fields from the document

Extract only certain fields from each document:

```javascript
partialTextSearch = new PartialTextSearch(docs, { docToString: ['summary', 'anotherField'] })
```

#### Custom function to convert a document to a string

You can fully customize the way a document is indexed by providing a function, for example:

```javascript
// myDocConversion :: Object -> String
const myDocConversion = doc => (doc.age * 2) + '||' + R.reverse(doc.name) + '||' + doc.surname

partialTextSearch = new PartialTextSearch(docs, { docToString: myDocConversion })
```

In this case you must manually add a separator between fields in case you need it.

### Separator

Before indexing the document list, it's necessary to convert each document to a single string, where some or all fields are concatenated. In order to improve search accuracy, a separator can be added (by default a pipe character, or `|`) so that it's possible to clearly differentiate one document field from another. This avoids matching a substring that only exists because of the concatenation of two fields, but not in any individual field of the document. Take a look at the following example:

```javascript
const docList = [
  { text: 'bana', about: 'na' }
]
```

When indexing this document, the document needs to be reduced to a single string, and if the resulting string has no separators, then the query `banana` would match this document, even though the word was not present in any individual field.

The workaround used by this library to avoid this problem is to insert a separator between document fields.

Note that not using a separator (or not configuring it properly) doesn't necessarily lead to severe harmful outcomes, but it's nevertheless recommended to configure it.

If you want to use a character different from `|`, you can configure a different separator for combining fields into a single string:

```javascript
partialTextSearch = new PartialTextSearch(docs, { separator: '/' })
```

What if the query patterns and/or the document strings contain the separator being used? The separator is only used as a way to improve accuracy, but it's not part of the actual text (since it's inserted by the library), therefore it shouldn't be used for pattern matching. One way to deal with this problem is to remove the separator from both the document's text (at the time of indexing) and from each query (before calling the search methods). This way, the separator character will only ever appear as a separator, and in no other context:

```javascript
const removePipe = x => x.replace(/\|/g, '')

const myDocConversion = doc => removePipe(doc.name) + '|' + removePipe(doc.surname)

const partialTextSearch = new PartialTextSearch(docs, {
  docToString: myDocConversion
})

const myQuery = 'I love the pipe | symbol'

partialTextSearch.search(removePipe(myQuery))
```

### Case insensitive support

Search is case sensitive by design, but there are a few ways to support case insensitive search. The recommended way is to:

1. At indexing time, convert the strings to lowercase (don't modify the original documents, simply modify the string to index).
2. Lowercase the query before executing the search.

```javascript
const myDocConversion = doc => (doc.title + '|' + doc.text).toLowerCase()

partialTextSearch = new PartialTextSearch(docs, { docToString: myDocConversion })

const someQuery = 'I hAve mIXED cAsEs'

partialTextSearch.search(someQuery.toLowerCase())
```

This trick can also be used to remove characters determined to be "useless" like dots, commas, extra whitespace, etc. Remember to apply the same pre-processing to both the documents and the query patterns, otherwise they would not match.

## Contribution

Your contributions are always welcome and appreciated. Following are the things you can do to contribute to this project.

1. **Report a bug:** If you think you have encountered a bug, and I should know about it, feel free to report it in the issues section and I will take care of it.
2. **Request a feature:** You can request a feature in the issues section, and if it's viable, it will be added to the development backlog.
3. **Create a pull request:** Your pull request will be appreciated by the community. You can get started by picking up any open issues and make a pull request.

## License

This library is available as open source under the terms of the MIT License.

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
