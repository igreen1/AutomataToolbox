import {NFA} from './nfa.js'

class DFA extends NFA {

  constructor(transitionFunction, acceptStates, startState){
    super(transitionFunction, acceptStates, startState)
    if(!this.validateDFA())
      throw {message:'DFA validation failed'}
  }

  validateDFA(){
    return this.nodes.every((node) => {
      let tranSymbols = node.transitionFunction.map(({symbol}) => symbol)
      //if array has duplicated elements or if it doesn't have the same amount of symbols as the alphabet
      //because NFA confirms all transitions symbols are part of the alphabet, this is the only check necessary
      //note: lambda is not part of the alphabet so this also checks that this is a DFA not NFA
      if(new Set(tranSymbols).size !== tranSymbols.length || tranSymbols.length !== this.alphabet.length){
        return false
      }
      return true
    })
  } 

}
export {DFA}