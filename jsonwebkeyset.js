const { getModExp } = require('./getModExp');

function jsonwebkeyset() {
    console.log('---------hi im jwks---------------');
    const gme = getModExp();

    const e = gme.exp;
    const n = gme.mod;

    const jwksObj = {
        "keys": [
            {
                "kid": 'bkbipdv1',
                "kty": "RSA",
                "n": n,
                "e": e,
                "alg": "RS256",
            }
        ]
    };

    console.log(jwksObj);
    console.log('---------------------------------------------');
    return jwksObj;
}

module.exports = {
    jsonwebkeyset: jsonwebkeyset,
};
