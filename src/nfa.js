class node {
  //Give the node a name :)
  constructor(name) {
    this.name = name
    this.transitionFunction = []
  }

  //Add an edge to the graph
  addTransition(nextNode, symbol) {
    const newTransition = { symbol: symbol, nextNode: nextNode }
    this.transitionFunction.push(newTransition)
  }

  //Return a array of node (names)
  transition(transitionSymbol) {
    return this.transitionFunction
      .filter(({ symbol }) => symbol === transitionSymbol)
      .map(({ nextNode }) => nextNode)
  }
}

class NFA {
  //Creates the 'graph' of the automata
  constructor(transitionFunction, acceptStates, startNode) {

    if(transitionFunction === null || acceptStates === null || startNode === null){
      throw "Null arguments not accepted"
    }

    if(typeof startNode === 'object'){
      try{
        startNode = startNode[0]
      }catch(err){
        throw "Start node datatype is invalid; unable to recover"
      }
    }

    //find all node names and the alphabet by inference
    this.alphabet = [
      ...new Set(transitionFunction.map(({ symbol }) => symbol)),
    ]
    const nodeNames = [
      ...new Set(transitionFunction.flatMap(({ start, end }) => [start, end])),
    ]

    //create a node object for each node )
    this.nodes = nodeNames.map((name) => new node(name))

    //add the transition functions for each node
    transitionFunction.forEach(({ start, end, symbol }) => {
      this.nodes
        .find(({ name }) => name === start)
        .addTransition(
          this.nodes.find(({ name }) => name === end),
          symbol
        )
    })
    this.startNode = startNode
    this.acceptNodes = this.nodes.filter(({ name }) =>
      acceptStates.includes(name)
    )
  }

  getNextStates (transitionSymbol, currNode) {
    const x = this.nodes
      .find(({name}) => name === currNode.name)
      .transition(transitionSymbol)
      for(let y in x) 
      return x
  }

  end (currNode)  {
    return this.acceptNodes.includes(currNode)
  }

  acceptString (str, currNode) {
    if (str.length === 0){
      return this.end(currNode)
    }

    if (!this.alphabet.includes(str[0])){
      throw {message:'Symbol not part of alphabet'}
    }

    const nextStates = this.getNextStates(str[0], currNode)
    if (!nextStates || nextStates.length === 0){ 
      return false
    }
    for (let state in nextStates) {
      if (this.acceptString(str.substring(1), nextStates[state])) 
        return true
    }
  }

  checkString (str) {
    const start = this.nodes.find(({name}) => name === this.startNode)
    //somehow, the false from accept string turns into undefined here
    return this.acceptString(str, start) === true
  }
}

export { NFA, node }
