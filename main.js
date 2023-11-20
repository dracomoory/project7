"use strict";

const f = x => Promise.resolve(x);

let pArr = [1,2,3].map(x => f(x));
let sum = r => r.reduce((x, y) => x + y, 0);
let sumP = r => r.reduce((acc, e) => acc.then(a => a + e), Promise.resolve(0));

Promise.all(pArr).then(sumP).then(console.log);

Promise.all(pArr).then(sum).then(console.log);

(async() => console.log(sum(await Promise.all(pArr))))();

console.log(sum(await Promise.all(pArr)));

