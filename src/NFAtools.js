
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
  const lookupTable = {
    tableA:[],
    tableB:[],
    set (a, b){
      this.tableA.push(a)
      this.tableB.push(b)
    },
    get (a){
      for(let i = 0; i < this.tableA.length && i < this.tableB.length; i ++){
        if(this.tableA[i] === a)
          return this.tableB[i] 
      }
      return undefined
    },
  }
  const lookup = function(currNode){
    return lookupTable.get(currNode)
  }

  //Create the nodes of the graph
  nfa.nodes.forEach((NFANode)=>{
    const resultNode = new node(NFANode.name)
    result.nodes.push(resultNode)
    lookupTable.set(NFANode, resultNode)
  })

  nfa.nodes.forEach((NFANode)=>{
    NFANode.transitionFunction.forEach((transition)=>{
      lookup(NFANode).addTransition(lookup(transition.nextNode), transition.symbol)
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

const concatNFA = function(a, b){
  //Note, because names are pretty much just visual sugar
  //i won't bother with them here
  //so if the user is bad with names.. meh, not my problem
  //maybe I'll make a helper function in global for that one day

  const nfa0 = deepCopyNFA(a);
  const nfa1 = deepCopyNFA(b);

  nfa0.nodes.push(...nfa1.nodes)
  nfa0.acceptNodes.forEach((node)=>{
    node.addTransition(nfa1.startNode, lambda)
  })

  nfa0.acceptNodes = [...nfa1.acceptNodes]
  nfa0.alphabet = [
      ...new Set([...nfa0.alphabet, ...nfa1.alphabet]),

  ]

  return nfa0
}

const starNFA = function(a){

  const resultNFA = deepCopyNFA(a)

  //create a single node
  const lambdaNode = new node('')

  lambdaNode.addTransition(resultNFA.startNode, lambda)

  resultNFA.nodes.push(lambdaNode)
  resultNFA.startNode = lambdaNode
  resultNFA.acceptNodes.map((node)=>{
    node.addTransition(resultNFA.startNode, lambda)
  })
  resultNFA.acceptNodes.push(resultNFA.startNode)

  return resultNFA
}

const orNFA = function(a, b){

  const lambdaNode = new node('')
  const nfa0 = deepCopyNFA(a)
  const nfa1 = deepCopyNFA(b)

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