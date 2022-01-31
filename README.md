# Partial Text Search

A Javascript library to find string patterns in a collection of documents. It efficiently finds matches even if the text of each document does not begin with the query pattern.

The result of each query is a set containing the document IDs where the query pattern is contained.

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

## Options

### Ways to index each document

By default this library will examine each document and extract (from the first level of nesting only) all strings and numbers (converted to strings) and index them.

```javascript
const doc = {
  title: 'hello world',
  body: 'document content',
  info: {
    year: 2000
  }
}
```

In this example, the resulting string to be indexed for this document will be `hello world|document content`. Note that the `info` key was ignored.

Plus, note that a separator `|` was added between the two fields, this is necessary for the suffix array to work properly. This is because a document must be reduced to a single string first.

The separator can be configured (see below), and it's recommended to use a character that won't appear in any query. It's not a requirement to use a separator, but not using it (or choosing it incorrectly) may lead to strings from two or more fields getting concatenated, resulting in a string that originally wasn't present in any single field of the document.

#### Index only certain strings from the document

Extract only certain keys from each document:

```javascript
partialTextSearch = new PartialTextSearch(docs, { docToString: ['summary', 'another_key'] })
```

#### Configure a different separator

Before indexing the document list, it's necessary to convert each document to a single string, where some or all fields are concatenated. In order to improve search accuracy, a separator can be added (by default a `|`) so that it's possible to clearly differentiate one document field from another. This avoids matching a substring that only exists because of the concatenation of two fields, but not in any individual field of the document. Note that not using a separator (or not configuring it properly) doesn't necessarily lead to severe harmful outcomes, but it's nevertheless recommended to configure it.

It's possible to configure a different separator for combining fields into a single string:

```javascript
partialTextSearch = new PartialTextSearch(docs, { separator: '//' })
```

You can also combine this option with the `docToString` option:

```javascript
partialTextSearch = new PartialTextSearch(docs, { separator: '//', docToString: ['summary', 'another_key'] })
```

What if the query patterns and/or the document strings contain the separator being used? The separator is only used as a way to improve accuracy, but it's not part of the actual text, therefore it shouldn't be used for matching any pattern. One way to deal with this problem is to remove the separator from both the document's text and from each query (before calling the search methods). This way, the separator character will only ever appear as a separator, and in no other context.

#### Custom function to convert a document to a string

You can fully customize the way a document is indexed by providing a function like so:

```javascript
const myDocConversion = doc => (doc.age * 2) + '||' + R.reverse(doc.name) + '||' + doc.surname

partialTextSearch = new PartialTextSearch(docs, { docToString: myDocConversion })
```

Note that you must manually add a separator between fields in case you need it, as the separator is only added automatically when extracting strings using keys, or when the default mechanism is used.

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
