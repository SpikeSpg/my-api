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
console.log(typeof (myJson1));

const modulusHex = '00:ae:e5:84:ce:3d:60:e2:de:94:55:03:ff:9f:c9:e8:a8:c9:5f:5c:99:ef:fb:dd:5a:14:34:f8:58:d3:dc:7d:45:4c:f7:9a:a8:da:c6:ac:f9:14:35:71:2b:7a:6d:c3:5a:64:58:76:1d:b2:66:48:d8:67:8d:59:dd:02:c4:a6:58:e3:91:bd:79:f1:6a:d2:cc:f6:97:10:5d:97:04:7a:ae:c3:41:db:aa:df:a0:8e:a5:13:47:49:c6:98:11:f6:0a:81:f7:d8:4f:1e:c2:ae:36:28:2e:bd:ce:88:ab:ae:72:4d:c7:a3:4f:22:fa:8e:c7:4d:9c:9c:3f:da:b5:d4:af:ac:5b:ee:a4:ce:c6:61:9f:bd:2c:1a:50:6e:c2:ed:03:17:ee:7c:c8:a7:55:8e:cc:3d:20:f7:fc:57:68:87:47:13:11:d2:2b:a2:96:56:0c:ef:31:c3:a9:ba:0d:8b:cb:8c:06:48:0f:9f:0d:e1:78:16:59:49:0f:41:7f:f8:c1:bd:dc:92:0d:a0:04:af:9b:1d:51:83:21:b1:ac:9e:bf:37:30:86:62:cf:d2:94:f2:66:28:19:54:16:f5:89:ff:96:de:39:17:d1:48:7e:7f:87:5d:e1:56:ef:ae:5c:f6:2e:69:64:1f:9c:06:09:cb:0f:84:ba:d8:82:41:c2:6d';

const modulusBuffer = Buffer.from(modulusHex.replace(/:/g, ""), "hex");

const base64EncodedModulus = modulusBuffer.toString("base64");

console.log(base64EncodedModulus);

const base64urlEncodedModulus = base64EncodedModulus
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

console.log(base64urlEncodedModulus);

const exponent = Buffer.from([0x01, 0x00, 0x01]);
const base64EncodedExponent = exponent.toString("base64");
console.log(base64EncodedExponent);

const base64urlEncodedExponent = base64EncodedExponent
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

console.log("Base64url Encoded Exponent:", base64urlEncodedExponent);

const jwks = {
    keys: [
        {
            kty: "RSA",
            n: "AK7lhM49YOLelFUD_5_J6KjJX1yZ7_vdWhQ0-FjT3H1FTPeaqNrGrPkUNXErem3DWmRYdh2yZkjYZ41Z3QLEpljjkb158WrSzPaXEF2XBHquw0Hbqt-gjqUTR0nGmBH2CoH32E8ewq42KC69zoirrnJNx6NPIvqOx02cnD_atdSvrFvupM7GYZ-9LBpQbsLtAxfufMinVY7MPSD3_Fdoh0cTEdIropZWDO8xw6m6DYvLjAZID58N4XgWWUkPQX_4wb3ckg2gBK-bHVGDIbGsnr83MIZiz9KU8mYoGVQW9Yn_lt45F9FIfn-HXeFW765c9i5pZB-cBgnLD4S62IJBwm0", 
            e: "AQAB", 
            alg: "RS256",
            kid: "your-key-id"
        }
    ]
};

console.log(typeof(jwks));
console.log(jwks);

const kid = crypto.createHash('sha256').update(modulusBuffer).digest('hex');

jwks.keys[0].kid = kid;

console.log(jwks);

const timestamp = new Date().toISOString().split('T')[0];
console.log(timestamp);
