
import {NFA, node} from './nfa.js'
import {lambda} from './global.js'


//When you pass in two nfas
//The first is MODIFIED
// so concatNFA(nfa0, nfa1)
// returns nothing but nfa0 will now hold nfa0.nfa1

//Accept a single-character string and creates a node for it
const createSingeNodeNFA = function(simpleRegex) {
  let delta = []
  let startState = simpleRegex
  let endState = [simpleRegex]

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
//   const resultNFA = createEmptyNFA()
//   resultNFA.nodes = []

//   const translationTable = {}

//   //First create the nodes (since the transitions use linking)
//   nfa0.nodes.forEach((oldNode)=>{
//     let copyNode = new node(oldNode.name)
//     resultNFA.nodes.push(copyNode)
//     translationTable.oldNode = copyNode
//   })

//   nfa0.nodes.forEach((oldNode)=>{
//     oldNode.transitionFunction.forEach((transition)=>{
//       translationTable.oldNode.addTransition(transition.symbol, translationTable.oldNode)
//     })
//   })

//   resultNFA.alphabet = [...nfa0.alphabet]
//   resultNFA.acceptNodes = nfa0.acceptNodes.map((n)=>translationTable.n)

//   return resultNFA
// }

//Puts nfa1 into nfa0
const concatNFA = function(nfa0, nfa1){
  //Note, because names are pretty much just visual sugar
  //i won't bother with them here
  //so if the user is bad with names.. meh, not my problem
  //maybe I'll make a helper function in global for that one day

  nfa0.acceptNodes.map((node)=>{
    node.transitionFunction.push({symbol:lambda, nextNode:nfa1.startNode})
  })
  nfa0.acceptNodes = [...nfa1.acceptNodes]
  nfa0.alphabet = [
      ...new Set([...nfa0.alphabet, ...nfa1.alphabet]),

  ]

}

const starNFA = function(nfa0){

  //create a single node
  const lambdaNode = new node('')

  lambdaNode.addTransition(nfa0.startNode, lambda)

  nfa0.nodes.push(lambdaNode)
  nfa0.startNode = lambdaNode
  nfa0.acceptNodes.map((node)=>{
    node.transitionFunction.push({symbol:lambda, nextNode:nfa0.startNode})
  })
  nfa0.acceptNodes.push(nfa0.startNode)

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
  
}

export {
  createSingeNodeNFA,
  // NFADeepCopy,
  concatNFA,
  starNFA,
  orNFA,
  createEmptyNFA,
}