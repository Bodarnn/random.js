```JS
// Create an RNG instance

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}
```
```JS
// Progress an RNG instance

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.next();

console.log(result); // 3830378609
console.log(random); // {state: 3830378609}

```
```JS
// Generate a random number in [0, 1)

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.float();

console.log(result); // 0.8918295169714838
console.log(random); // {state: 3830378609}
```
```JS
// Generate a random integer in [0, upper)

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.integer(256);

console.log(result); // 113
console.log(random); // {state: 3830378609}
```
```JS
// Randomly shuffle an array

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const items = ['bat', 'rat', 'cat'];
random.shuffle(items);

console.log(items); // ['cat', 'rat', 'bat']
console.log(random); // {state: 2287627626}
```
```JS
// Randomly sample k items without replacement

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const items = ['bat', 'rat', 'cat'];
const result = random.sample(items, 2);

console.log(result); // ['cat', 'rat']
console.log(items); // ['bat', 'rat', 'cat']
console.log(random); // {state: 2287627626}
```
```JS
// Randomly sample k items with replacement

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const items = ['bat', 'rat', 'cat'];
const result = random.resample(items, 3);

console.log(result); // ['cat', 'cat', 'bat']
console.log(items); // ['bat', 'rat', 'cat']
console.log(random); // {state: 2287627626}
```
```JS
// Clone an RNG instance

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const clone = random.clone();

console.log(clone); // {state: 8675309}
console.log(random); // {state: 8675309}
console.log(clone == random); // false
```
```JS
// Progress an RNG instance n times

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.skip(3);

console.log(result); // 2287627626
console.log(random); // {state: 2287627626}
```
```JS
// Generate a random boolean

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.boolean();

console.log(result); // true
console.log(random); // {state: 3830378609}
```
```JS
// Return true with probability p

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.chance(0.25);

console.log(result); // false
console.log(random); // {state: 3830378609}
```
```JS
// Generate a random integer in [lower, upper)

const seed = 8675309;
const random = new RNG(seed);

console.log(random); // {state: 8675309}

const result = random.between(1, 7);

console.log(result); // 6
console.log(random); // {state: 3830378609}
```
