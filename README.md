# simple-math-parser
A Simple Math Parser in javascript

# Install
Not yet functionnal (not published on npm)

# Usage
```
const Smp = require('simple-math-parser')

const calc = new Smp('3 + (3 * (3 - 42)) / 42');
console.log(JSON.stringify(calc.getJsonTree(), null, ' '));
console.log(calc.parse());
```


Copyright (c) 2016 Pierre Monge
