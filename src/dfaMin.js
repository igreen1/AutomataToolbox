import {DFA} from './dfa.js'
import { nfa2dfa, createEmptyDFA,} from './DFATools.js'

const dfaMin = function(dfa){

  if(!dfa.validateDFA())
    throw {message:`DFA validation failed. Can't minimize`}

  //Setup helper data structures and functions
  const minimizingGroups = []

  const findTerminalNodeOn = function(string, currNode){
    if(string == '') return currNode
    else if(currNode === undefined) return undefined //shouldn't happen in dfa :/
    else return findTerminalNodeOn(string.substring(1), dfa.getNextStates(string[0], currNode))
  }

  const nodeGrouping = {
    constructor(nodesList){
      this.nodeList = nodesList
    },

    pointsToGroupOn(string){
      if(string === '')
        return this;
      else{
        nextNode = 
      }

    },

    isEmpty(){
      return this.nodeList.length === 0;
    },

    pop(node){
      this.nodeList = this.nodeList.filter((n) => n !== node)
      return node;
    },

    push(node){
      this.nodeList.push(node)
    },

  }

  const generateNextStringList = function(str){
    const results;
    dfa.alphabet.forEach(sym){
      results.push(str+sym)
    }
    return results;
  }


  //Begin actual algorithm
  minimizingGroups.push(dfa.acceptNodes) //group 1: accept states
  minimizingGroups.push(dfa.nodes.filter((node)=> !dfa.acceptNodes.includes(node))) //group 2: non-accept states



}

export {dfaMin}