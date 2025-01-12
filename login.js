const bcrypt = require('bcrypt');
const { makeQuery } = require('./auth');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const { status } = require('./status');
const { stat } = require('node:fs');

function endLog() {
    console.log('..............................................................');
}

async function login(data, endpoint, rs) {
    console.log('....................login....................');
    console.log(data);

    // Fetch the user from the database
    const s = `SELECT * FROM ${endpoint} WHERE username = '${data.username}' OR email = '${data.email}'`;
    console.log(s);
    
    const uniqueUser = await makeQuery(s);
    console.log('uniqueUser.length : ', uniqueUser.length);

    if (uniqueUser.length !== 0) {
        console.log(uniqueUser[0]);
        console.log(data.password);
        console.log(uniqueUser[0].password);

        const validPassword = await bcrypt.compare(data.password, uniqueUser[0].password);

        if (validPassword) {
            const pkByte = crypto.randomBytes(32);
            const pk = pkByte.toString('base64');
            const token = jwt.sign(uniqueUser[0], pk);
            console.log(typeof(token));

            const ret = status(201, 'Successfully get the jwt.', rs, token);
            console.log(ret);
            endLog();
            return ret;
        } else {
            console.log('Invalid password');
            const ret = status(401, 'Invalid password', rs);
            endLog();
            return ret;
        }
    }

    console.log('User not found');
    const ret = status(404, 'User not found', rs);
    endLog();
    return ret;
}

module.exports = {
    login: login,
};
