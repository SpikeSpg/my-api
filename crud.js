// This module concern with the likes of endpoint
const { status } = require('./status');
const { makeQuery } = require('./auth');
const { registration } = require('./registration');
const { login } = require('./login');

function endLog() {
    console.log('..............................................................');
}

async function crud(method, endpoint, rs, header, stripedCT, data) {
    console.log('....................begin of crud log....................');
    const legitEndpoints = ['users', 'restaurants', 'login'];

    console.log(method);
    console.log(endpoint);
    console.log(header);
    console.log(stripedCT);
    console.log(data);

    let count = 0;
    for (let char of endpoint) {
        if (char === '/') {
            count++;
        }
    }
    console.log(count);

    if (count > 2) {
        status(400, 'Invalid request format.', rs);
        endLog();
        return;
    }

    const enp = endpoint.slice(1);
    console.log(enp);

    if (endpoint.length === 1) {
        rs.write('Welcome to the Group Fund API.');
        endLog();
        return;
    }

    if (legitEndpoints.includes(enp)) {
        console.log(method + endpoint);

        /*
            HEAD /* - Head on all of them.
            GET / - Root page.
            GET /pet — Fetch a list of all pets.
            GET /pet/1 — Fetch a pet with ID 1.
            POST /pet — Create a new pet (e.g., { "name": "Niky", "owner": "Jake" }).
            PUT /pet/1 — Update the pet with ID 1 (e.g., { "name": "Niky", "owner": "Jake" }).
            DELETE /pet/1 — Delete the pet with ID 1.
            PATCH /pet/1 — Partially update the pet with ID 1 (e.g., change only the name).
        */

        if (count === 1) {
            if (method === 'GET') {
                endLog();
                return;
            }
            else if (method === 'POST') {
                if (stripedCT === 'multipart/form-data') {
                    if (enp === 'users') {
                        const sql = await registration(data, enp);
                        await makeQuery(sql);
                        endLog();
                        return;
                    }
                    else if (enp === 'login') {
                        login(data, 'users');
                        endLog();
                        return;
                    }
                }
            }
        }
        else if (count === 2) {
            if (method === 'GET') {
                endLog();
                return;
            }
            else if (method === 'PUT') {

            }
            else if (method === 'PATCH') {

            }
            else if (method === 'DELETE') {

            }
        }
    }

    status(404, 'Endpoint not found.', rs);
}

module.exports = {
    crud: crud,
};