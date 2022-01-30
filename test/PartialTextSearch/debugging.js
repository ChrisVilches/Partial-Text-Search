const { PartialTextSearch } = require('../../src/PartialTextSearch')
const { expect } = require('chai')
const { describe, it } = require('mocha')
const { getDocsNaive } = require('../helpers')

describe('PartialTextSearch', () => {
  describe('debugging case 1', () => {
    const docList = [
      { text: 'asひたddw記なな', about: 'nassd"b"字a' },
      { text: 'i!かbnec感ひ!', about: 'j(aas感らかなa' },
      { text: 'sな"adqひ!!b', about: 'cか)cisnbqn' },
      { text: 'らi　aaaecda', about: 'がdjk号号が号ii' },
      { text: 'kk た$"bsa)', about: 'なたか記kな ekw' },
      { text: 'dadkkaaじかじ', about: 'j dひk  $s$' },
      { text: 'skcsひ記aがじa', about: 'asaら!感　as!' },
      { text: '　k漢たw記漢かb　', about: 'ba bs(ひaej' },
      { text: 'd記akかなdqかb', about: 'かd s$sdsdb' },
      { text: 'じ記b字$ankがj', about: 'ら字感$記じe"aa' }
    ]

    const partialTextSearch = new PartialTextSearch(docList, ['text', 'about'])

    it('gets documents correctly', () => {
      const queryString = 'aa'
      const naiveSet = getDocsNaive(docList, ['text', 'about'], queryString)
      const fastSet = partialTextSearch.search(queryString)
      expect(fastSet).to.eql(naiveSet)
    })

    it('does not match a string that goes from one document to another (in the full concatenated string)', () => {
      const queryString = 'なasな'
      const naiveSet = getDocsNaive(docList, ['text', 'about'], queryString)
      const fastSet = partialTextSearch.search(queryString)
      expect(fastSet).to.eql(naiveSet)
    })
  })

  describe('debugging case 2', () => {
    const docList = [
      { text: 'sなs!esd感)a' },
      { text: ' kak da　がa' },
      { text: 'ssws字sdsan' },
      { text: '記かs号ne%nab' },
      { text: 'akaiひdnqじq' },
      { text: 'かacdかa%(qk' },
      { text: '!　dkひじ"s d' },
      { text: 'aらanbが漢感ab' },
      { text: '　  bkかじja感' },
      { text: '$たsja感n)!s' }
    ]

    const partialTextSearch = new PartialTextSearch(docList, ['text'])

    it('gets documents correctly', () => {
      const queryString = 's '
      const naiveSet = getDocsNaive(docList, ['text'], queryString)
      const fastSet = partialTextSearch.search(queryString)
      expect(fastSet).to.eql(naiveSet)
    })
  })

  describe('debugging case 3', () => {
    const docList = [
      { a: '号a　dknd字ck', b: 'なかa　 j号ak号', c: 'deds感字ddaか', d: 'asdas asks' },
      { a: 'kas$記(aksa', b: 'kbn かcisas', c: 'sjdがanswか)', d: 'nddk bらからn' },
      { a: 'dab字dひbsqた', b: 'らwi記が　sdaw', c: 'iaかcadsjかk', d: 'bqdkたsd!ひa' },
      { a: 'dがbc!漢) ca', b: 'k記bsか%aa字)', c: '号じa漢sbqた字b', d: 'njskiddwkか' },
      { a: '　eddeiqaa%', b: '$aqssaa(らa', c: 's!記jがssk字n', d: 'kabka　$nc　' },
      { a: 'nらsなanakじd', b: 'a記%%なse"nか', c: 'adi s号ddkn', d: ' jか bjsca$' },
      { a: 'basaか感jaaa', b: '!号wひなeba号c', c: 'dadiかasa漢s', d: 'baknd $bnd' },
      { a: ')kbccたa)s　', b: '感jadがた記adc', c: 'iらik記　字n%!', d: 'a("$j字ajdn' },
      { a: 'なb)%!)aj%が', b: '%idsなwb qb', c: '漢　kひk字かか感"', d: 'bqi　bqa記ひj' },
      { a: 'なea らaksた　', b: 'eが)ひqa%" s', c: 'naaades記sa', d: 'bbskdがかna号' }
    ]

    const partialTextSearch = new PartialTextSearch(docList, ['a', 'b', 'c', 'd'])

    it('gets documents correctly', () => {
      const queryString = '号d'
      const naiveSet = getDocsNaive(docList, ['a', 'b', 'c', 'd'], queryString)
      const fastSet = partialTextSearch.search(queryString)
      expect(fastSet).to.eql(naiveSet)
    })
  })
})
