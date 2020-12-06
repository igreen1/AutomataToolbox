const lambda = '/'

class node {
  //Give the node a name :)
  constructor(name) {
    this.name = name
    this.transitionFunction = []
  }

  //Add an edge to the graph
  addTransition(nextNode, symbol) {
    const newTransition = { symbol: symbol, nextNode: nextNode }
    if(!(newTransition.nextNode === this && newTransition.symbol === lambda))
      this.transitionFunction.push(newTransition)
    else
      console.warn(`A self referential lambda-move edge was found at ${this.name}. It was automatically removed`)
  }

  removeSelfreferentialNodes(){
    this.transitionFunction = this.transitionFunction.filter(({nextNode, symbol}) => !(nextNode === this && symbol === lambda))
  }

  //Return a array of node (names)
  transition(transitionSymbol) {
    return this.transitionFunction
      .filter(({ symbol }) => symbol === transitionSymbol || symbol === lambda)
  }
}

class NFA {
  //Creates the 'graph' of the automata
  constructor(transitionFunction, acceptStates, startNode) {

    if(transitionFunction === null || acceptStates === null || startNode === null){
      throw {message:'Null arguments not accepted'}
    }

    if(typeof startNode === 'object'){
      try{
        startNode = startNode[0]
        if(startNode == undefined){
          throw {message:'Start node datatype is invalid; unable to recover'}
        }
      }catch(err){
        throw {message:'Start node datatype is invalid; unable to recover'}
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
    this.validateNFA();

  }

  validateNFA(){
    //check for lambda cycles
    //check for single-edge lambda cycles
    //a lambda transition pointing to the same ndoe
    //this is done in the node construction so a little redundant ha
    this.nodes.forEach((node)=>node.removeSelfreferentialNodes());

    //check for double-edge lambda cycles
    //two nodes that each are a lambda move from each other
    //these nodes are equivalent, combine them

    this.nodes.forEach((currNode)=>{
      currNode.transition(lambda)
      .forEach(({nextNode}) =>{
        if(nextNode.transition(lambda).map(({nextNode})=>nextNode).includes(currNode)){
          this.combineNodes(nextNode, currNode)
          console.warn(`Poorly defined NFA. Nodes ${currNode.name} and ${nextNode.name} must be combined. This will be done`)
        }
      })
    })

  }

  combineNodes(n1, n2){
    //make n1 have all the transitions of n2
    n1.transitionFunction.push(...n2.transitionFunction)
    //make everything that ponts to n2 point to n1
    this.nodes.forEach((node)=>{
      node.transitionFunction.forEach((transition)=>{
        if(transition.nextNode === n2) transition.nextNode=n1
      })
    })
    //erase self-referential calls
    n1.removeSelfreferentialNodes()
    //remove n2
    this.nodes = this.nodes.filter((node) => node !== n2)
  }

  //
  findLambdaCycles(){

  }

  getNextStates (transitionSymbol, currNode) {
    return this.nodes
      .find(({name}) => name === currNode.name)
      .transition(transitionSymbol)
  }

  end (currNode)  {
    const isAccept = this.acceptNodes.includes(currNode)
    if(!isAccept){
      //check lambda-adjacent nodes 
      const nextStates = this.getNextStates(lambda, currNode)
        for(let state in nextStates){
          if(this.end(nextStates[state].nextNode))
            return true
        }
    }
    return isAccept
  }

  acceptString (str, currNode) {
    if (str.length === 0){
      return this.end(currNode);
    }

    if (!this.alphabet.includes(str[0])){
      throw {message:'Symbol not part of alphabet'}
    }
    const nextStates = this.getNextStates(str[0], currNode)

    if (!nextStates || nextStates.length === 0){ 
      return false
    }
    for (let state in nextStates) {
      if(nextStates[state].symbol === lambda){
        if(this.acceptString(str, nextStates[state].nextNode))
          return true
      }
      else if(this.acceptString(str.substring(1), nextStates[state].nextNode)) 
        return true
    }
    return false
  }

  checkString (str) {
    const start = this.nodes.find(({name}) => name === this.startNode)
    //somehow, the false from accept string turns into undefined here
    return this.acceptString(str, start) === true
  }
}

export { NFA, node }
