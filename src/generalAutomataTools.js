const printAutomata = function(automata){
  //I introduced automata names late in the cycle
  //so not required to be supported
  console.log(`Printing automata: ${automata?.name}`)

  console.log(`Automata has the following nodes`)
  console.log(`Note: Not all nodes get named. Automatic functions tend to not name`)
  automata.nodes.forEach((node)=>{
    console.log(node.name)
  })

  console.log(`Automata will start at ${automata.startNode.name}`)

  console.log(`These nodes have the following connections`)
  automata.nodes.forEach((node)=>{
    console.log(`${automata.startNode === node ? '->': ''}Node: ${node.name}`)
    node.transitionFunction.forEach(({symbol, nextNode}) =>{
      if(nextNode.name && nextNode.name !== '')
        console.log(`\tOn ${symbol} --> ${nextNode.name}`)
      else
        console.log(`\tOn ${symbol} --> [Unnamed node]`)
    })
  })

  console.log(`The following are accept state`)
  automata.acceptNodes.forEach((node)=>{
    console.log(`\tNode: ${node.name}`)
  })

}

const enforceAutomataNaming_ = function(automata){
  let counter = 0;
  automata.nodes.map((node)=>{
    node.name = `q${counter}`
    counter++
  })
  return automata //not technically necessary since automata is affected by map
}

const automataToTransitionTable = function(automata){
  
}

const nDepthEquivalent = function(automata0, automata1, n = 10){
  //basic checks
  if(!automata0.alphabet.every((symbol)=> automata1.alphabet.includes(symbol) ))
    return false

  return checkNDepthEquivalentHelper(automata0, automata1, n, '')

}

const checkNDepthEquivalentHelper = function(automata0, automata1, n, a){

  if(a.length > n) return true
  else if(automata0.checkString(a) !== automata1.checkString(a)) {return false}

  automata0.alphabet.forEach((symbol)=>{
    if(!checkNDepthEquivalentHelper(automata0, automata1, n, a+symbol))
      return false
  })

  return true

}


export { printAutomata, enforceAutomataNaming_,nDepthEquivalent}