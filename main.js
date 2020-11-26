import { NFA as nfa } from "./nfa.js"
import readline from 'readline'

let delta = [
  {start: 'a', end: 'b', symbol:'0' },
  {start: 'a', end: 'c', symbol: '1'},
  {start: 'b', end: 'a', symbol: '0'},
  {start: 'b', end: 'c', symbol: '1'},
  {start: 'c', end:'b', symbol: '0'},
]

let acceptStates = ['c']

let startState = 'a'

const mynfa = new nfa(delta, acceptStates, startState)

console.log(mynfa.checkString("0001"))
console.log(mynfa.checkString("00000001"))
console.log(mynfa.checkString("0011"))
console.log(mynfa.checkString("1001"))
console.log(mynfa.checkString("1101"))
console.log(mynfa.checkString("abc"))



