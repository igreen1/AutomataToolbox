
import {NFA, node} from './nfa.js'
import {lambda} from './global.js'


//When you pass in two nfas
//The first is MODIFIED
// so concatNFA(nfa0, nfa1)
// returns nothing but nfa0 will now hold nfa0.nfa1

const deepCopyNFA = function(nfa){
  const result = createEmptyNFA()
  result.alphabet = [...nfa.alphabet]

  result.nodes = []
  result.acceptNodes = []

  //Names are unused in most of the program (except nfa->dfa)
  //here instead create a one-to-one look up table
  const lookupTable = new WeakMap()
  const lookup = function(currNode){
    return lookupTable.get(currNode)
  }

  //Create the nodes of the graph
  nfa.nodes.forEach((NFANode)=>{
    const DFANode = new node(NFANode.name)
    result.nodes.push(DFANode)
    lookupTable.set(NFANode, DFANode)
  })

  nfa.nodes.forEach((NFANode)=>{
    NFANode.transitionFunction.forEach((transition)=>{
      lookup(NFANode).transitionFunction.push(transition.symbol, lookup(transition.nextNode))
    })
  })

  result.startNode = lookup(nfa.startNode)
  nfa.acceptNodes.forEach((node)=>{
    result.acceptNodes.push(lookup(node))
  })

  return result

}

const createRegexNFA = function(exp){
  const delta = [
    {start: ``, end:exp, symbol:exp }
  ]
  const startState = ``
  const endState = [exp]

  return new NFA(delta, endState, startState)

}

//Accept a single-character string as a name, only accepts '' (empty string)
const createLambdaNode = function(name) {
  let delta = []
  let startState = name
  let endState = [name]

  return new NFA(delta, endState, startState)
}

const createEmptyNFA = function() {
  const nfa = new NFA([''], [''], [''])
  //Clear object fields
  nfa.nodes = undefined
  nfa.alphabet = undefined
  nfa.startNode = undefined
  nfa.acceptNodes =undefined
  return nfa
}

// const NFADeepCopy = function(nfa0){
//   //TODO - unfinished
//   const resultNFA = createLambdaNode('')
  
  

//   return resultNFA
// }

//Puts nfa1 into nfa0
const concatNFA = function(nfa0, nfa1){
  //Note, because names are pretty much just visual sugar
  //i won't bother with them here
  //so if the user is bad with names.. meh, not my problem
  //maybe I'll make a helper function in global for that one day

  const resultNFA = deepCopyNFA(nfa0);

  resultNFA.acceptNodes.map((node)=>{
    node.transitionFunction.push({symbol:lambda, nextNode:nfa1.startNode})
  })
  resultNFA.acceptNodes = [...nfa1.acceptNodes]
  resultNFA.alphabet = [
      ...new Set([...nfa0.alphabet, ...nfa1.alphabet]),

  ]

  return resultNFA
}

const starNFA = function(nfa0){

  const resultNFA = deepCopyNFA(nfa0)

  //create a single node
  const lambdaNode = new node('')

  lambdaNode.addTransition(nfa0.startNode, lambda)

  nfa0.nodes.push(lambdaNode)
  nfa0.startNode = lambdaNode
  nfa0.acceptNodes.map((node)=>{
    node.transitionFunction.push({symbol:lambda, nextNode:nfa0.startNode})
  })
  nfa0.acceptNodes.push(nfa0.startNode)

  return nfa0
}

const orNFA = function(nfa0, nfa1){

  const lambdaNode = new node('')

  lambdaNode.addTransition(nfa0.startNode, lambda)
  lambdaNode.addTransition(nfa1.startNode, lambda)

  nfa0.nodes.push(lambdaNode)
  nfa0.nodes.push(...nfa1.nodes)
  nfa0.startNode = lambdaNode  

  nfa0.alphabet = [
      ...new Set([...nfa0.alphabet, ...nfa1.alphabet]),
  ]
  nfa0.acceptNodes.push(...nfa1.acceptNodes)
 
  return nfa0
}

// const orManyNFA = function(...nfa)

export {
  concatNFA,
  starNFA,
  orNFA,
  createEmptyNFA,
  createRegexNFA,
  createLambdaNode,
  deepCopyNFA,
}