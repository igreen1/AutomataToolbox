import { DFA } from "../src/dfa.js"
import { deepStrictEqual, throws }from 'assert'
import {dfaMin} from '../src/dfaMin.js'
import { nDepthEquivalent, printAutomata } from "../src/generalAutomataTools.js"

describe('DFA minimizer test', () => {
  it('simple dfa', () => {
    //Ends with 1, no consecutive 1
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
      {start: 'c', end: 'g', symbol: '1'},
      {start: 'g', end: 'g', symbol: '0'},
      {start: 'g', end: 'g', symbol: '1'},
       
    ]
    const acceptStates = ['c']
    const startState = ['a']

    const simpleDFA = new DFA(delta, acceptStates, startState)

    // dfaMin(simpleDFA)
  })
  it('from a test', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol: '0'},
      {start: 'a', end: 'e', symbol: '1'},
      {start: 'b', end: 'c', symbol: '0'},
      {start: 'b', end: 'i', symbol: '1'},
      {start: 'c', end: 'i', symbol: '0'},
      {start: 'c', end: 'd', symbol: '1'},
      {start: 'd', end: 'i', symbol: '0'},
      {start: 'd', end: 'j', symbol: '1'},
      {start: 'e', end: 'f', symbol: '0'},
      {start: 'e', end: 'i', symbol: '1'},
      {start: 'f', end: 'h', symbol: '0'},
      {start: 'f', end: 'g', symbol: '1'},
      {start: 'g', end: 'h', symbol: '0'},
      {start: 'g', end: 'h', symbol: '1'},
      {start: 'h', end: 'h', symbol: '0'},
      {start: 'h', end: 'h', symbol: '1'},
      {start: 'i', end: 'i', symbol: '0'},
      {start: 'i', end: 'j', symbol: '1'},
      {start: 'j', end: 'i', symbol: '0'},
      {start: 'j', end: 'j', symbol: '1'},
      
    ]
    const acceptStates = ['g', 'd']
    const startState = ['a']

    const simpleDFA = new DFA(delta, acceptStates, startState)
    const test = dfaMin(simpleDFA)

    printAutomata(test)

    deepStrictEqual(nDepthEquivalent(simpleDFA, test, 10) , true)

  })
})