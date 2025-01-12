const a = undefined;

console.log(a);

if (a === undefined) {
    console.log('kyo');
}

const crypto = require('node:crypto');

const myObj1 = {
    name: 'i pipe',
    pass: '1234',
};

const b = crypto.randomBytes(2);
console.log(b);
const c = Array.from(b);
console.log(c);
const pk = crypto.randomBytes(32);
console.log(pk);
const pkStr = pk.toString('base64');
console.log(pkStr);

const jwt = require('jsonwebtoken');
const token = jwt.sign(myObj1, pkStr, { algorithm: 'HS384' });
console.log(token);

function aaa() {
    return null;
}

function bbb() {

}

function ccc() {
    return;
}

console.log(aaa());
console.log(bbb());
console.log(ccc());

const stringObj1 = JSON.stringify(myObj1);
console.log(stringObj1);
const myJson1 = JSON.parse(stringObj1);
console.log(myJson1);
console.log(typeof(myJson1));