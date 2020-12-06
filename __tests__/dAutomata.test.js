import { DFA } from "../src/dfa.js"
import { deepStrictEqual, throws }from 'assert'

describe('DFA tests', () => {
  it('DFA null args err', () => {
    let delta=[]
    let acceptStates=[]
    let startState=[]

    startState=null
    // throws( ()=> throws( ()=> (new DFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
    startState=[]
    delta=null
    throws( ()=> (new DFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
    delta=[]
    acceptStates=null
    throws( ()=> (new DFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
  })
  it('invalid start node datatype handling', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
      {start: 'c', end:'c', symbol:'1'}
    ]
    const acceptStates = ['c']
    let startState = {a:'a'}

    throws(()=>(new DFA(delta, acceptStates, startState)), {message:'Start node datatype is invalid; unable to recover'} )

    //check that array startState is properly handled
    startState = ['a']
    new DFA(delta, acceptStates, startState)

  })
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

    deepStrictEqual(simpleDFA.checkString('1') , true)
    deepStrictEqual(simpleDFA.checkString('01') , true)
    deepStrictEqual(simpleDFA.checkString('001') , true)
    deepStrictEqual(simpleDFA.checkString('000000001') , true)
    deepStrictEqual(simpleDFA.checkString('10') , false)
    deepStrictEqual(simpleDFA.checkString('11') , false)
    deepStrictEqual(simpleDFA.checkString('101') , true)
    deepStrictEqual(simpleDFA.checkString('0011') , false)
    deepStrictEqual(simpleDFA.checkString('0000101') , true)
    deepStrictEqual(simpleDFA.checkString('11111') , false)

    throws( () => simpleDFA.checkString('a'), {message:'Symbol not part of alphabet'})
     
  })
  it('improperly defined dfa', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
    ]
    const acceptStates = ['c']
    let startState = 'a'

    throws(()=>(new DFA(delta, acceptStates, startState)), {message:'DFA validation failed'} )

  })
  it('dfa with lambda fails', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '/'},
      {start: 'c', end: 'c', symbol: '1'}
    ]
    const acceptStates = ['c']
    let startState = 'a'

    throws(()=>(new DFA(delta, acceptStates, startState)), {message:'DFA validation failed'} )

  })
})