# AutomataToolbox
Final project for Theory of Computation


Feature List
NFA simulation
  Validates some portions of lambda (0,1 depth cycles)
    n-depth lambda cycles are still an issue :/ ~ see todo
NFA tools:
  Concat
  Or
  Star
  Deep copy
  some internal functions
DFA simulation
  DFA is an NFA with an additional validator
  removes lambda moves
DFA Tools
  nfa -> dfa
Regex to NFA
  Or, concat, and star accepted :)
  parentheses obviously (and annoyingly)

//TODO
update this readme
add lambda-cycle detection to NFA.js
rename nfa.js functions (bc checkString is unintuitive)
  --> or adds funci