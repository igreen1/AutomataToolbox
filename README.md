# AutomataToolbox
Final project for Theory of Computation (Automata)

# Summary
This project focuses on basic automata operations learned in my CMSI 385 class. Specifically, it will simulate NFAs and DFAs. Moreover, it can parse simple Regex expressions into NFAs. Given an automata, it can combine them (OR, CONCAT, KLEENE STAR) and perform basic programming operations (deep copy, formattted output, check equality)

# NFA
NFAs are defined by a simple array of transitions, a start state, and an array of accept states. They are initially defined by their names to make cross-compatibility easier. A function enforceAutomataNaming_ is availble to rename automata if they must be used in such a manner
```javascript
const delta = [
    {start: 'q0', end: 'q1', symbol: '1'},
    {start: 'q1', end: 'q2', symbol: '1'},
]
const startState = 'q0'
const endStates = ['q2']
const nfa = new NFA(delta, startState, endStates)
```

Then, a string can be tested with 
```javascript
nfa.accepts(someString) //Returns true or false
```

Invalid NFA construction throws an error corresponding to its problem.

# DFA
The same as NFA except upon construction, a validator function is called that will throw an error if the DFA is not defined properly. It will also throw the same errors as the NFA is the definition has problems.

# Regex
Regex statements are custom-parsed. They can be turned into NFAs through a simple function call
```javascript
const nfa = regexToNFA('01+11')
```

The following operations are accepted
- '+': OR
- '.' : concatentaion
- '\*' | Kleene Star

Parantheses of course are allowed

# NFA to DFA
NFA can be converted to DFA by a simple function call
```javascript
const nfa = nfa2dfa(dfa)
```

This will remove lambda expressions and perform necessary operationst convert the NFA to DFA. 

# DFA minimizationm
DFA can be easily minimized by calling a simple function
```javascript
const smallDFA = minDFA(largeDFA)
```

# Conclusion
This project is not groundbreaking, but it was a fun project for a class. It is also (apparently from my research while debugging) one of the few programs in Javascript. I hope to continue this work when I have more time by creating similar tools in C++, which I think could be very fun.

If you are a future student or someone who wants to know more, feel free to reach out. I am happy to explain what is going on for anything here :)
