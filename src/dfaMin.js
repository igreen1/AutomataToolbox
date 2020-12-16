import { createEmptyDFA,} from './DFATools.js'
import { enforceAutomataNaming_ } from './generalAutomataTools.js'
import { node } from './nfa.js'

const dfaMin = function(dfa){
  //This function uses the algorithm taught in class
  // but I changed the wording to make it easier to understand
  // it creates a network of groups
  //  where each group is a collection of the dfa nodes
  //  then shuffles the groups until 
  //    1. it is as complex as the dfa (return dfa - I can't help)
  //    2. increasing string length no longer creates changes

  enforceAutomataNaming_(dfa) //make my life easier

  const generateStrings = (str)=>{
    const result = [];
    dfa.alphabet.forEach((Symbol)=>{
      result.push(str+Symbol)
    })
    return result
  }

  let change = true
  let str = ['0', '1']
  const network = new groupNetwork(dfa)
  while(change){
    change = false
    str.forEach((str)=>{
      if(!change)
        change = network.checkString(str);
      else
        network.checkString(str)
    })
    str = str.flatMap((s)=>generateStrings(s))
    
  }

  printNetwork(network)
  return groupNetwork2DFA(dfa, network)

}

const printNetwork = function(net){
  console.log('----------------------------------------------------------')
  console.log("next step")
  
  net.groupList.forEach((group)=>{
    console.log(group)
  })
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}

const groupNetwork2DFA = function(initialDFA, groupNetwork){
  const result = createEmptyDFA()

  const acceptNodes = []
  let startNode
  const nodes = groupNetwork.groupList.map((group)=> {
    const name = group.map((node)=>node.name).toString()
    const newNode = new node(name)
    if(group.some((n)=>initialDFA.acceptNodes.includes(n)))
      acceptNodes.push(newNode)
    if(group.some((n)=>initialDFA.startNode === n))
      startNode = newNode
    return newNode
  })

  groupNetwork.groupList.forEach((group)=>{
    const currNode = nodes.find((node)=>node.name === group.map((node)=>node.name).toString())
    initialDFA.alphabet.forEach((s)=>{
      const nextNode = nodes.find((n)=> n.name === groupNetwork.findGroup(groupNetwork.stringTransition(group[0], s)).map((node)=>node.name).toString())
      currNode.addTransition(nextNode, s)
    })
  })

  result.nodes = nodes
  result.acceptNodes = acceptNodes
  result.startNode = startNode
  result.alphabet = [...initialDFA.alphabet]

  return result
}


class groupNetwork{
  constructor(dfa){
    this.groupList = []
    this.groupList.push([...dfa.acceptNodes])
    this.groupList.push([...dfa.nodes.filter((node)=> !dfa.acceptNodes.includes(node))])
  }

  checkString(str){
    let change  = false
    this.groupList = this.groupList.flatMap((group)=>{
      if(group.length <= 0) return undefined
      else if(group.length === 1) return [group]

      if(this.groupConsistent(group, str)){
        return [group]
      }else{
        change = true
        return this.breakupGroup(group, str)
      }

    }).filter((group)=>group!=undefined)
    return change
  }

  breakupGroup(group, str){
    let results = []
    group.forEach((node)=>{

      if(results.some(({nextGroup})=> nextGroup === this.findGroup(this.stringTransition(node, str)))){

        results.find(({nextGroup}) =>  nextGroup === this.findGroup(this.stringTransition(node, str)))
        .nodes.push(node)

      } else {
        results.push({nextGroup: this.findGroup(this.stringTransition(node, str)), nodes: [node]})
      }
    })
    

    results = results.map(({nodes}) => nodes)
    // this.groupList = this.groupList.filter((g)=>g !== group)
    // this.groupList.push(...results)
    return results
  }

  groupConsistent(group, str){
    const nextGroup = this.findGroup(this.stringTransition(group[0], str))
    return group.every((node)=>{
      return this.findGroup(this.stringTransition(node,str)) === nextGroup
    })
  }

  findGroup(node){
    return this.groupList.find((n)=> n.includes(node))
  }

  stringTransition(node, str){
    let curr = node
    while(str !== ''){
      curr = curr.transition(str[0])[0]
      str = str.substring(1)
    }
    return curr
  }

}


export {dfaMin}