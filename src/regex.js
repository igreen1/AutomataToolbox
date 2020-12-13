
import { concatNFA, starNFA, orNFA,createRegexNFA,} from './NFAtools.js'

//Custom built instead of via library so please excuse the inefficiencies
//I'm double majoring so not a ton of time to make super pretty :(

const regexToNFA = function(exp){
  while(exp.includes(' '))
    exp = exp.replace(' ', '').replace('.','');
  return parseRegex(exp)
}


const parseRegex = function(exp){
  if(exp.length === 1)
    return createRegexNFA(exp)

  if(exp[0] === '(' && exp[exp.length-1] === ')')
    exp = exp.substring(1,exp.length-1)

  return parseRegexOr(exp)
}

const parseKleeneRegex = function(exp){
  const preKleene = parseRegex(exp.substring(0,exp.length-1))
  return starNFA(preKleene)
}

const parseRegexOr = function(exp){
  let splitExp = parseOrHelper(exp, '+')
  //convert to nfas 
  splitExp = splitExp.map( (currExp) =>{
    if(currExp[0] === '(' && currExp[currExp.length-1] === ')')
      return parseRegex(currExp)
    else
      return parseRegexConcat(currExp)
  })
  //or all the nfas
  let result = splitExp[0]
  for(let i =1 ; i < splitExp.length; i++){
    result = orNFA(result, splitExp[i])
  }
  return result
}

const parseRegexConcat = function(exp){
  let splitExp = parseConcatHelper(exp)
  //convert to nfas
  splitExp = splitExp.map( (currExp) => {
    if(currExp[0] === '(' && currExp[currExp.length-1] === ')')
      return parseRegex(currExp)
    else if(currExp[currExp.length-1] === '*')
    {
      return parseKleeneRegex(currExp)
    }
    else
      return createRegexNFA(currExp)
  })

  //combine nfas
  let result = splitExp[0]
  for(let i =1 ; i < splitExp.length; i++){
    result = concatNFA(result, splitExp[i])
  }
  return result
}

const parseConcatHelper = function(exp) {

  const result=[] //strings split UNLESS parentheses
  let parenCount = 0
  let currSubset = ''

  for(let i =0; i < exp.length; i++){
    const currChar = exp[i]
    if(currChar === '(') parenCount++
    else if(currChar === ')') parenCount--
    
    currSubset += currChar

    if(parenCount===0)
    { 
      if(i+1 < exp.length && exp[i+1] === '*')
      {
        currSubset += exp[i+1]
        i++
      }
      result.push(currSubset)
      currSubset=''
    }
  }

  if(currSubset !== '')
    result.push(currSubset)

  return result

}
const parseOrHelper = function(exp, sym) {
  const result = [] //strings split on symbol, accounting for paranetheses
  let parenCount = 0
  let currSubset = ''

  for(let i = 0 ; i < exp.length; i++){
    const currChar = exp[i]
    if(currChar === '(') parenCount++
    else if(currChar === ')') parenCount--

    if(parenCount===0 && currChar === sym){
      if(i+1 < exp.length && exp[i+1] === '*')
      {
        currSubset += exp[i+1]
        i++
      }
      result.push(currSubset)
      currSubset = ''
    } else {
      currSubset += currChar
    }
  }

  if(currSubset !== '')
    result.push(currSubset)

  return result
}


export {
  regexToNFA
}