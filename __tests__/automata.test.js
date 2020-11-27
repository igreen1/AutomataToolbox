import { NFA } from "../src/nfa.js"
import {  ok, deepStrictEqual, match, throws, fail} from 'assert'

describe('NFA tests', () => {
  it('constructor errors', () => {
    //TODO
  })
  it('simple nfa', () => {
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

    deepStrictEqual(simpleNFA.checkString('1') , true)
    deepStrictEqual(simpleNFA.checkString('01') , true)
    deepStrictEqual(simpleNFA.checkString('001') , true)
    deepStrictEqual(simpleNFA.checkString('000000001') , true)
    deepStrictEqual(simpleNFA.checkString('10') , false)
    deepStrictEqual(simpleNFA.checkString('11') , false)
    deepStrictEqual(simpleNFA.checkString('101') , true)
    deepStrictEqual(simpleNFA.checkString('0011') , false)
    deepStrictEqual(simpleNFA.checkString('0000101') , true)
    deepStrictEqual(simpleNFA.checkString('11111') , false)

    throws( () => simpleNFA.checkString('a'), {message:'Symbol not part of alphabet'})
     
  })
})