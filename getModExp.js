const base64url = require('base64url');
const fs = require('node:fs');
const forge = require('node-forge');

function getModExp() {
    console.log('--------------------getModExp------------------');
    const publicKeyBuffer = fs.readFileSync('./keys/public.pem');
    const publicKeyStr = publicKeyBuffer.toString('utf8');

    const publicKey = forge.pki.publicKeyFromPem(publicKeyStr);

    const modulus = publicKey.n;
    const exponent = publicKey.e.data[0];

    let exp64url = null;

    if (exponent === 65537) {
        const expBuffer = Buffer.from([0x01, 0x00, 0x01]);
        exp64url = base64url(expBuffer);
    }

    const modulusByteArray = modulus.toByteArray();
    const modulusBuffer = Buffer.from(modulusByteArray.reverse());

    const mod64url = base64url(modulusBuffer);
    const ret = {'exp': exp64url, 'mod': mod64url};

    console.log('--------------------------------------------------');
    return ret;
}

module.exports = {
    getModExp: getModExp,
};