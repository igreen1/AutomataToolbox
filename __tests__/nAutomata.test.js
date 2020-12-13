import { NFA } from "../src/nfa.js"
import { deepStrictEqual, throws} from 'assert'

describe('NFA tests', () => {
  it('NFA null args err', () => {
    let delta=[]
    let acceptStates=[]
    let startState=[]

    startState=null
    // throws( ()=> throws( ()=> (new NFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
    startState=[]
    delta=null
    throws( ()=> (new NFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
    delta=[]
    acceptStates=null
    throws( ()=> (new NFA(delta, acceptStates, startState)), {message:"Null arguments not accepted"} );
  })
  it('invalid start node datatype handling', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
    ]
    const acceptStates = ['c']
    let startState = {a:'a'}

    throws(()=>(new NFA(delta, acceptStates, startState)), {message:'Start node datatype is invalid; unable to recover'} )

    //check that array startState is properly handled
    startState = ['a']
    new NFA(delta, acceptStates, startState)

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
  it('complex nfa', ()=>{
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

    deepStrictEqual(simpleNFA.checkString('0'), true)
    deepStrictEqual(simpleNFA.checkString('01'), false)
    deepStrictEqual(simpleNFA.checkString('011111110'), true)
    deepStrictEqual(simpleNFA.checkString('01010101010'), true)
    deepStrictEqual(simpleNFA.checkString('0101010101'), false)
    deepStrictEqual(simpleNFA.checkString('0'), true)
  
  })
  it('poorly defined nfa', ()=>{
    const delta = [
      {start:'a', end:'b', symbol:'/'}, // a '/' = lambda in my notation
      {start:'b', end:'b', symbol:'0'},
      {start:'b', end:'b', symbol:'1'},
      {start:'b', end:'c', symbol:'0'},
      {start:'b', end:'d', symbol:'1'},
      {start:'c', end:'d', symbol:'1'},
      {start:'d', end:'c', symbol:'0'},
      {start:'c', end:'e', symbol:'/'},
      {start:'e', end:'e', symbol:'/'},
      {start:'b', end:'g', symbol:'/'},
      {start:'g', end:'b', symbol:'/'}
    ]
    const acceptStates=['e']
    const startState=['a']
    const simpleNFA = new NFA(delta, acceptStates, startState)

    deepStrictEqual(simpleNFA.checkString('0'), true)
    deepStrictEqual(simpleNFA.checkString('01'), false)
    deepStrictEqual(simpleNFA.checkString('011111110'), true)
    deepStrictEqual(simpleNFA.checkString('01010101010'), true)
    deepStrictEqual(simpleNFA.checkString('0101010101'), false)
    deepStrictEqual(simpleNFA.checkString('0'), true)

  })
  it('n-depth cyclic nfa', ()=>{
    const delta = [
      {start:'a', end:'b', symbol:'/'}, // a '/' = lambda in my notation
      {start:'b', end:'b', symbol:'0'},
      {start:'b', end:'b', symbol:'1'},
      {start:'b', end:'c', symbol:'0'},
      {start:'b', end:'d', symbol:'1'},
      {start:'c', end:'d', symbol:'1'},
      {start:'d', end:'c', symbol:'0'},
      {start:'c', end:'e', symbol:'/'},
      {start:'e', end:'e', symbol:'/'},
      {start:'b', end:'g', symbol:'/'},
      {start:'g', end:'c', symbol:'/'},
      {start:'c', end:'b', symbol:'/'}
    ]
    const acceptStates=['e']
    const startState=['a']
    const simpleNFA = new NFA(delta, acceptStates, startState)

    //TODO

    // deepStrictEqual(simpleNFA.checkString(''), true)

  })
  it('get start node', ()=>{
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

    deepStrictEqual(simpleNFA.startNode.name, 'a')
  })
  it('get end nodes', ()=>{
    const delta = [
      {start: 'a', end: 'b', symbol:'0' },
      {start: 'a', end: 'c', symbol: '1'},
      {start: 'b', end: 'a', symbol: '0'},
      {start: 'b', end: 'c', symbol: '1'},
      {start: 'c', end:'b', symbol: '0'},
    ]
    const acceptStates = ['b','c']
    const startState = ['a']

    const simpleNFA = new NFA(delta, acceptStates, startState)

    deepStrictEqual(simpleNFA.acceptNodes.map(({name})=>name), ['b', 'c'])
  })
})