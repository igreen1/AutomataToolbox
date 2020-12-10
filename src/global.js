const lambda = '/'

const printAutomata = function(automata){
  //I introduced automata names late in the cycle
  //so not required to be supported
  console.log(`Printing automata: ${automata?.name}`)

  console.log(`Automata has the following nodes`)
  console.log(`Note: Not all nodes get named. Automatic functions tend to not name`)
  automata.nodes.forEach((node)=>{
    console.log(node.name)
  })

  console.log(`These nodes have the following connections`)
  automata.nodes.forEach((node)=>{
    console.log(`Node: ${node.name}`)
    node.transitionFunction.forEach(({symbol, nextNode}) =>{
      if(nextNode.name && nextNode.name !== '')
        console.log(`\tOn ${symbol} --> ${nextNode.name}`)
      else
        console.log(`\tOn ${symbol} --> [Unnamed node]`)
    })
  })
  

}

export {lambda, printAutomata}