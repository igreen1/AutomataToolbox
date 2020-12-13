import { DFA } from "../src/dfa.js"
import { deepStrictEqual, throws }from 'assert'
import { NFA } from "../src/nfa.js"
import { lambda } from "../src/global.js"
import { printAutomata, enforceAutomataNaming_,nDepthEquivalent} from "../src/generalAutomataTools.js"



describe('General automata tools test', () => {
  //I just did in command line
  it('TODO',()=> {})
  it('N depth equivalence', ()=> {
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

    const nfa0 = new NFA(delta, acceptStates, startState)
    const nfa1 = new NFA(delta, acceptStates, startState)

    for(let i = 0; i < 10; i++)
    deepStrictEqual(nDepthEquivalent(nfa0, nfa1, i), true)


  })
  it('N depth equivalence can be false', ()=> {
    let delta = [
      {start:'a', end:'b', symbol:'/'}, // a '/' = lambda in my notation
      {start:'b', end:'b', symbol:'0'},
      {start:'b', end:'b', symbol:'1'},
      {start:'b', end:'c', symbol:'0'},
      {start:'b', end:'d', symbol:'1'},
      {start:'c', end:'d', symbol:'1'},
      {start:'d', end:'c', symbol:'0'},
      {start:'c', end:'e', symbol:'/'},
    ]
    let acceptStates=['e']
    const startState=['a']

    const nfa0 = new NFA(delta, acceptStates, startState)
    delta = [
      {start:'a', end:'b', symbol:'/'}, // a '/' = lambda in my notation
      {start:'b', end:'b', symbol:'0'},
      {start:'b', end:'b', symbol:'1'},
      {start:'b', end:'c', symbol:'0'},
      {start:'b', end:'d', symbol:'1'},
      {start:'c', end:'d', symbol:'1'},
      {start:'d', end:'c', symbol:'0'},
    ]
    acceptStates=['c']
    const nfa1 = new NFA(delta, acceptStates, startState)

    for(let i = 0; i < 10; i++)
    deepStrictEqual(nDepthEquivalent(nfa0, nfa1, i), true)


  })
  
})