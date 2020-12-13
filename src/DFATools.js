import {NFA, node} from './nfa.js'
import {DFA,} from './dfa.js'
import {lambda} from './global.js'
import {enforceAutomataNaming_, printAutomata} from './generalAutomataTools.js'


const createEmptyDFA = function(){
  //DFA constructor assumes a well defined graph input
  //so bit of a work around to construct empty dfa
  const newDFA = new DFA([''], [''], ['']);
  newDFA.acceptNodes = []
  newDFA.alphabet = []
  newDFA.nodes = []
  newDFA.startNode = undefined

  return newDFA
}

const nfa2dfa = function(nfa){
  enforceAutomataNaming_(nfa) //makes my life infinitely easier :)
  let resultDFA = createEmptyDFA()

  //Initialize our alphabet
  resultDFA.alphabet = [...nfa.alphabet]

  //Make dfa start node the same name as nfa start node and begin :)
  resultDFA.startNode = new node(nfa.startNode.name)
  resultDFA.nodes.push(resultDFA.startNode)
  
  resultDFA = convert2DFAHelper(resultDFA, nfa, resultDFA.startNode)

  if(!resultDFA.validateDFA()){
    console.warn(`Unable to convert NFA to DFA properly. DFA validation failed`)
  }

  return resultDFA
}

const convert2DFAHelper = function(resultDFA, nfa, currNode){

  //Because there is no 'lookup' or 'transition' table, must transit through the nfa
  const equivalentNFANodes = findNFANode(nfa, currNode)

  // equivalentNFANodes.forEach((node)=>{
  //   if(nfa.acceptNodes.includes(node))
  //     resultDFA.acceptNodes = [...new Set([...resultDFA.acceptNodes, currNode])]
  // })

  equivalentNFANodes.forEach((node)=>{
    if(nfa.end(node)){
      resultDFA.acceptNodes = [...new Set([...resultDFA.acceptNodes, currNode])]
    }
  })

  //Find all the nodes adjacent and organize by the symbol by which they are transitioned to 
  let transitionsFromCurrNode = findAdjacentTransitions(equivalentNFANodes)

  let adjacentNodes = {}
  //create a entry for each transition symbol
  resultDFA.alphabet.forEach((alphabetSymbol)=>{
    adjacentNodes[alphabetSymbol] = []
  })

  //for each entry in adjacent nodes, give EVERY node which can be reached via that symbol
  /*
  Adjacent node as a data structure, consider alphabet = [0, 1] then could look like
    where [node, node] are the transitions returned by the transition function
    this node has no neighbors on 1, 
  [
    '0': [[node, node], [node, node]]
    '1': []
  ]
  */
  transitionsFromCurrNode.forEach((transition)=>{
    adjacentNodes[transition.symbol].push(transition.nextNode)
  })


  //Flat map each entry (since they're arrays of arrays)
  //and then change to storing the name as we're about to begin stage 2, recursion
  for(const key in adjacentNodes){
    //Remove duplicates, extract names, and turn into one new string for new name
    let nextNodeName = [... new Set(adjacentNodes[key].flatMap((n)=>n).map((nextNode)=>nextNode.name))]
                      .toString()
    //toString isn't the best, probably should make my own
    while(nextNodeName.includes(',')){
      nextNodeName = nextNodeName.replace(',','')
    }

    if(nextNodeName === ''){
      //empty string means no transition for this symbol
      currNode.addTransition(createGarboState(resultDFA), key)
    }
    else if(!resultDFA.nodes.some(node => node.name === nextNodeName)){
      //New node
      const nextNode = new node(nextNodeName)
      resultDFA.nodes.push(nextNode)
      currNode.addTransition(nextNode, key)
      convert2DFAHelper(resultDFA, nfa, nextNode)
    } else {
      //link curr node to existing node
      currNode.addTransition(resultDFA.nodes.find(({name}) => name === nextNodeName), key)
    }
  }

  return resultDFA
  
}

const findAdjacentTransitions = function(currNodes, accum){
  /*
  Algorithm (todo)
    -check all non-lambda transitions, push next nodes to result
    perform lambda moves (if possile)
      recurse such that those next nodes from lambda return their adjacent nodes 
    return results
  */
  let results = []
  //grabs EVERY SINGLE transition from this node
  //keeping in mind, DFA nodes can be compositions of the NFA nodes
  currNodes.forEach((node)=>{
    node.transitionFunction.forEach((transition) =>{
      if(transition.symbol === lambda) results.push(...findAdjacentTransitions([transition.nextNode]))
      else results.push(transition)
    })
  })
  return [...new Set(results)]
}


const findNFANode = function(nfa, currNode){
  const nodeNames = currNode.name.split('q').filter((name)=> name!== ''). //q1q2 --> ['q1', 'q2']
              map((nodeNumber) => `q${nodeNumber}`)
  //Turn all the node names into the corresponding nfa nodes
  return nodeNames.map((seekName)=>{
    return nfa.nodes.find(({name}) => name === seekName)
  }).filter((n) => n !== undefined)
}

const createGarboState = function(dfa){
  if(dfa.nodes.some((node)=> node.name === 'Garbage state')){
    return dfa.nodes.find((node)=> node.name === 'Garbage state')
  }
  const garbageState = new node('Garbage state')
  dfa.alphabet.forEach((symbol)=>{
    garbageState.addTransition(garbageState, symbol)
  })
  dfa.nodes.push(garbageState)
  return garbageState
}

export {
  nfa2dfa, 
  createEmptyDFA,
}