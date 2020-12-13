import { NFA } from "../src/nfa.js"
import { concatNFA, starNFA, orNFA,createRegexNFA, deepCopyNFA,} from '../src/NFAtools.js'
import { deepStrictEqual, throws} from 'assert'
import { lambda } from "../src/global.js"
import {nDepthEquivalent, printAutomata} from '../src/generalAutomataTools.js'

describe('NFA tools test', () => {
  it('Create simple regex nfa', ()=>{
    const exp = '0'
    const expNFA = createRegexNFA(exp)
    deepStrictEqual(expNFA.checkString('0') , true)
    deepStrictEqual(expNFA.checkString('00') , false)

    const exp1 = '1'
    const exp1NFA = createRegexNFA(exp1)
    deepStrictEqual(exp1NFA.checkString('1') , true)
    deepStrictEqual(exp1NFA.checkString('11') , false)
  })
  it('Create simple regex NFAs and combine them in a variety of ways', ()=>{
    const exp0 = '0'
    const exp0NFA = createRegexNFA(exp0)
    const exp1 = '1'
    const exp1NFA = createRegexNFA(exp1)

    deepStrictEqual(exp0NFA.checkString('0') , true)
    deepStrictEqual(exp1NFA.checkString('1') , true)

    const exp0or1NFA = orNFA(exp0NFA, exp1NFA)

    deepStrictEqual(exp0or1NFA.checkString('0') , true)
    deepStrictEqual(exp0or1NFA.checkString('1') , true)
    deepStrictEqual(exp0or1NFA.checkString('00') , false)
    deepStrictEqual(exp0or1NFA.checkString('11') , false)
    deepStrictEqual(exp0or1NFA.checkString('01') , false)
    deepStrictEqual(exp0or1NFA.checkString('10') , false)


    const expconcatNFA = concatNFA(exp0NFA, exp1NFA)

    deepStrictEqual(expconcatNFA.checkString('01') , true)
    deepStrictEqual(expconcatNFA.checkString('11') , false)

  })
  
  it('Chain operations together', ()=>{
    let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
    ]
    let start0 = 'a'
    let end0 = ['b']

    let delta1 = [
      {start: 'aa', end:'bb', symbol: '1'}
    ]
    let start1 = 'aa'
    let end1 = ['bb']

    const nfa0 = new NFA(delta0, end0, start0) //0
    const nfa1 = new NFA(delta1, end1, start1) //1

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa1.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('00') , false)
    deepStrictEqual(nfa1.checkString('11') , false)

    const concatThenOr = orNFA(concatNFA(nfa0, nfa1), nfa1)
    
    deepStrictEqual(concatThenOr.checkString('0') , false)
    deepStrictEqual(concatThenOr.checkString('1') , true)
    deepStrictEqual(concatThenOr.checkString('01') , true)
    deepStrictEqual(concatThenOr.checkString('00') , false)

  })
  
  it('Concat 1 node NFAs', () => {

    let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
    ]
    let start0 = 'a'
    let end0 = ['b']

    let delta1 = [
      {start: 'aa', end:'bb', symbol: '1'}
    ]
    let start1 = 'aa'
    let end1 = ['bb']

    let nfa0 = new NFA(delta0, end0, start0)
    const nfa1 = new NFA(delta1, end1, start1)

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa1.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('00') , false)
    deepStrictEqual(nfa1.checkString('11') , false)

    const cNFA = concatNFA(nfa0, nfa1)

    deepStrictEqual(cNFA.checkString('0') , false)
    deepStrictEqual(nfa1.checkString('1') , true)
    deepStrictEqual(cNFA.checkString('01') , true)
    deepStrictEqual(cNFA.checkString('00') , false)
    deepStrictEqual(nfa1.checkString('11') , false)

  })
  it('concat complex NFAs', ()=>{
    let delta0 = [
      {start: 'a', end:'b', symbol: '0'},
      {start: 'b', end: 'c', symbol: '0'},
      {start: 'a', end: 'b', symbol: lambda},
    ]
    let start0 = 'a'
    let end0 = ['c']

    let delta1 = [
      {start: 'a', end:'b', symbol: '1'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'a', end: 'b', symbol: lambda},
    ]
    let start1 = 'a'
    let end1 = ['c']

    let nfa0 = new NFA(delta0, end0, start0)
    const nfa1 = new NFA(delta1, end1, start1)

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa0.checkString('00') , true)
    deepStrictEqual(nfa0.checkString('000') , false)

    deepStrictEqual(nfa1.checkString('1') , true)
    deepStrictEqual(nfa1.checkString('11') , true)
    deepStrictEqual(nfa1.checkString('111') , false)

    nfa0 = concatNFA(nfa0, nfa1)

    deepStrictEqual(nfa0.checkString('01') , true)
    deepStrictEqual(nfa0.checkString('0011') , true)
    deepStrictEqual(nfa0.checkString('0') , false)
    deepStrictEqual(nfa0.checkString('1') , false)
    deepStrictEqual(nfa1.checkString('1') , true)


  })
  it('Test scope of concatNFA', ()=>{
    const testConcatScope = () =>{
      let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
      ]
      let start0 = 'a'
      let end0 = ['b']

      let delta1 = [
        {start: 'aa', end:'bb', symbol: '1'}
      ]
      let start1 = 'aa'
      let end1 = ['bb']

      let nfa0 = new NFA(delta0, end0, start0)
      const nfa1 = new NFA(delta1, end1, start1)

      nfa0 = concatNFA(nfa0, nfa1)
      return nfa0
    }

    let nfa0 = testConcatScope()

    deepStrictEqual(nfa0.checkString('0') , false)
    deepStrictEqual(nfa0.checkString('01') , true)

  })
  it('Kleene star ', ()=>{

    let delta = [
      {start: 'a', end:'b', symbol: '0'}
    ]
    let start = 'a'
    let end = ['b']
    const nfa = new NFA(delta, end, start)

    const nfa0 = starNFA(nfa)

    deepStrictEqual(nfa0.checkString('') , true)
    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa0.checkString('00') , true)
  })
  it('Or nfa', () => {

    let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
    ]
    let start0 = 'a'
    let end0 = ['b']

    let delta1 = [
      {start: 'aa', end:'bb', symbol: '1'}
    ]
    let start1 = 'aa'
    let end1 = ['bb']

    let nfa0 = new NFA(delta0, end0, start0)
    const nfa1 = new NFA(delta1, end1, start1)

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa1.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('00') , false)
    deepStrictEqual(nfa1.checkString('11') , false)

    nfa0 = orNFA(nfa0, nfa1)

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa0.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('11') , false)
    deepStrictEqual(nfa0.checkString('00') , false)

  })
  it('Test scope of orNFA', ()=>{
    const testOrScope = () =>{
      let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
      ]
      let start0 = 'a'
      let end0 = ['b']

      let delta1 = [
        {start: 'aa', end:'bb', symbol: '1'}
      ]
      let start1 = 'aa'
      let end1 = ['bb']

      let nfa0 = new NFA(delta0, end0, start0)
      const nfa1 = new NFA(delta1, end1, start1)

      nfa0 = orNFA(nfa0, nfa1)
      return nfa0
    }

    let nfa0 = testOrScope()

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa0.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('01') , false)
    deepStrictEqual(nfa0.checkString('10') , false)

  })
  it('More complicated or nfa', ()=>{
    const testOrScope = () =>{
      let delta0 = [
      {start: 'a', end:'b', symbol: '0'}
      ]
      let start0 = 'a'
      let end0 = ['b']

      let delta1 = [
        {start: 'aa', end:'bb', symbol: '1'}
      ]
      let start1 = 'aa'
      let end1 = ['bb']

      let nfa0 = new NFA(delta0, end0, start0)
      const nfa1 = new NFA(delta1, end1, start1)

      nfa0 = orNFA(nfa0, nfa1)
      return nfa0
    }

    let nfa0 = testOrScope()

    deepStrictEqual(nfa0.checkString('0') , true)
    deepStrictEqual(nfa0.checkString('1') , true)
    deepStrictEqual(nfa0.checkString('01') , false)
    deepStrictEqual(nfa0.checkString('10') , false)

  })
  it('Copy NFA', ()=>{
    //Ends with 1, no consecutive 1
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
    ]
    const acceptStates = ['c']
    const startState = ['a']

    const simpleNFA = new NFA(delta, acceptStates, startState)

    deepStrictEqual(nDepthEquivalent(simpleNFA, deepCopyNFA(simpleNFA)), true)

  })
  it('Copy more complicated NFA', ()=>{
    const delta = [
      {start:'a', end:'b', symbol:'/'}, // a '/' = lambda in my notation
      {start:'b', end:'b', symbol:'0'},
      {start:'b', end:'b', symbol:'1'},
      {start:'b', end:'c', symbol:'0'},
      {start:'b', end:'d', symbol:'1'},
      {start:'c', end:'d', symbol:'1'},
      {start:'d', end:'c', symbol:'0'},
      {start:'c', end:'e', symbol:'/'},
    ]
    const acceptStates=['e']
    const startState=['a']

    const simpleNFA = new NFA(delta, acceptStates, startState)

    deepStrictEqual(nDepthEquivalent(simpleNFA, deepCopyNFA(simpleNFA)), true)

  })
})