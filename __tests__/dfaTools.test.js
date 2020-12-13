import { DFA } from "../src/dfa.js"
import {NFA} from "../src/nfa.js"
import { deepStrictEqual, throws} from 'assert'
import { lambda } from "../src/global.js"
import {nfa2dfa} from "../src/DFATools.js"
import {printAutomata, nDepthEquivalent} from "../src/generalAutomataTools.js"


describe('DFA to NFA', () => {

  /*
    I've yet to make automated tests for this
    For now, then, I check by hand :)
  */
  it('Simple nfa to dfa', ()=>{
    //Ends with 1, no consecutive 1
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'b', end: 'c', symbol: '1'},
      {start:'b', end:'a', symbol:'0'}
    ]
    const acceptStates = ['c']
    const startState = ['a']

    const simpleNFA = new NFA(delta, acceptStates, startState)

    const dfa = nfa2dfa(simpleNFA)

    deepStrictEqual(nDepthEquivalent(simpleNFA, dfa, 10),true)

  })
  it('Simple nfa to dfa, with cycles', ()=>{
    //Must have lambda
    //must have cycles
    const delta = [
      {start: 'a', end:'b', symbol:'0'},
      {start: 'b', end:'c', symbol:'0'},
      {start: 'c', end:'b', symbol:'0'},
      {start: 'c', end:'d', symbol:'1'},
      {start: 'd', end:'a', symbol:'0'},
      {start: 'a', end:'d', symbol:'1'},
    ]
    const acceptStates = ['c']
    const startState = ['a']

    const slightlyComplexNFA = new NFA(delta, acceptStates, startState)

    const dfa = nfa2dfa(slightlyComplexNFA)

    deepStrictEqual(nDepthEquivalent(slightlyComplexNFA, dfa, 10),true)

  })
  it('Multiple next nodes', ()=>{
    //Must have lambda
    //must have cycles
    const delta = [
      {start: 'a', end:'b', symbol:'0'},
      {start: 'a', end:'c', symbol:'0'},
      {start: 'a', end:'d', symbol:'0'},
      {start: 'b', end: 'b', symbol: '1'},
      {start: 'b', end: 'e', symbol: '1'},
      {start: 'c', end: 'e', symbol: '1'},
      {start: 'd', end: 'e', symbol: '1'},
    ]
    const acceptStates = ['e']
    const startState = ['a']

    const slightlyComplexNFA = new NFA(delta, acceptStates, startState)
    const dfa = nfa2dfa(slightlyComplexNFA)

    deepStrictEqual(nDepthEquivalent(slightlyComplexNFA, dfa, 10),true)
  })
  it('slightly complex nfa', ()=>{
    //Must have lambda
    //must have cycles
    const delta = [
      {start: 'a', end:'b', symbol:'0'},
      {start: 'b', end: 'b', symbol: '1'},
      {start: 'a', end: 'c', symbol: '0'},
      {start: 'c', end: 'e', symbol: '1'},
      {start: 'b', end: 'e', symbol: '1'},
    ]
    const acceptStates = ['e']
    const startState = ['a']

    const slightlyComplexNFA = new NFA(delta, acceptStates, startState)

    const dfa = nfa2dfa(slightlyComplexNFA)

    deepStrictEqual(nDepthEquivalent(slightlyComplexNFA, dfa, 10),true)


  })
  it('2-depth lambda moves', ()=>{
    //Must have lambda
    //must have cycles
    const delta = [
      {start: 'a', end:'b', symbol:lambda},
      {start: 'b', end:'c', symbol:lambda},
      {start: 'c', end:'d', symbol:'0'},
      
    ]
    const acceptStates = ['d']
    const startState = ['a']

    const slightlyComplexNFA = new NFA(delta, acceptStates, startState)

    const dfa = nfa2dfa(slightlyComplexNFA)

    deepStrictEqual(nDepthEquivalent(slightlyComplexNFA, dfa, 10),true)

  })
})