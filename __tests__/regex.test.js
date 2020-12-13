import { NFA } from "../src/nfa.js"
import { concatNFA, starNFA, orNFA,createRegexNFA,} from '../src/NFAtools.js'
import { deepStrictEqual, throws} from 'assert'
import { lambda } from "../src/global.js"
import {regexToNFA} from '../src/regex.js'
import { printAutomata } from "../src/generalAutomataTools.js"

describe('Regex expressions tests', () => {
  it('Simple regex', ()=>{
    const n = regexToNFA('0')

    deepStrictEqual(n.checkString('0') , true)
    deepStrictEqual(n.checkString('00') , false)
  })
  it('Or regex', ()=>{
    const n = regexToNFA('0+1')

    deepStrictEqual(n.checkString('0') , true)
    deepStrictEqual(n.checkString('1') , true)
    deepStrictEqual(n.checkString('00') , false)
    deepStrictEqual(n.checkString('11') , false)
  })
  it('Concat regex', ()=>{
    const n = regexToNFA('01')

    deepStrictEqual(n.checkString('0') , false)
    deepStrictEqual(n.checkString('1') , false)
    deepStrictEqual(n.checkString('00') , false)
    deepStrictEqual(n.checkString('11') , false)
    deepStrictEqual(n.checkString('01') , true)
  })
  it('Or and concat regex', ()=>{
    const n = regexToNFA('01+1')

    deepStrictEqual(n.checkString('0') , false)
    deepStrictEqual(n.checkString('1') , true)
    deepStrictEqual(n.checkString('00') , false)
    deepStrictEqual(n.checkString('11') , false)
    deepStrictEqual(n.checkString('01') , true)
  })
  it('Kleene regex', ()=>{
    const n = regexToNFA('0*')

    deepStrictEqual(n.checkString('0') , true)
    deepStrictEqual(n.checkString('') , true)
    deepStrictEqual(n.checkString('00') , true)
  })
  it('Concat Kleene regex', ()=>{
    const n = regexToNFA('01*')

    deepStrictEqual(n.checkString('01') , true)
    deepStrictEqual(n.checkString('0') , true)
    deepStrictEqual(n.checkString('0111111') , true)
    deepStrictEqual(n.checkString('00001') , false)
  })
  it('Or Kleene regex', ()=>{
    const n = regexToNFA('0+1*')

    deepStrictEqual(n.checkString('1') , true)
    deepStrictEqual(n.checkString('0') , true)
    deepStrictEqual(n.checkString('111111') , true)
    deepStrictEqual(n.checkString('00001') , false)
  })
  it('Kleene regex with parentheses', ()=>{
    const n = regexToNFA('(01)*')
    
    deepStrictEqual(n.checkString('01') , true)
    deepStrictEqual(n.checkString('0') , false)
    deepStrictEqual(n.checkString('0111111') , false)
    deepStrictEqual(n.checkString('00001') , false)
    deepStrictEqual(n.checkString('01010101') , true)
    deepStrictEqual(n.checkString('') , true)
  })
  it('Kleene regex - Complicated', ()=>{
    const n = regexToNFA('0(0+1*)* + 1*00+1')
    
    deepStrictEqual(n.checkString('01') , true)
    deepStrictEqual(n.checkString('00') , true)
    deepStrictEqual(n.checkString('010') , true)
    deepStrictEqual(n.checkString('01111') , true)
    deepStrictEqual(n.checkString('00') , true)
    deepStrictEqual(n.checkString('1') , true)
    deepStrictEqual(n.checkString('111111111100') , true)
    deepStrictEqual(n.checkString('11') , false)
    deepStrictEqual(n.checkString('1000') , false)
  })
})