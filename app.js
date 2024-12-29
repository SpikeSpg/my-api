const http = require('node:http');
const https = require('node:https');
const { makeQuery } = require('./auth.js');
// const fs = require('node:fs');

const host = '0.0.0.0';
const port = process.env.PORT || 4000;

function metadata(request, response, code) {
    // Check the code to determine what the response should be
    // If the code is alright, we give them what they want
    // If not, we throw error at them

    const goodStatus = [200, 201, 202, 204, 304];
    const badStatus = [400, 401, 403, 404, 500, 502, 503];
    console.log(code);

    if (goodStatus.includes(code)) {
        // Force JSON if user-agent is any of these browsers
        const toServeJson = ['Google Chrome', 'Chromium', 'Microsoft Edge'];
        const header = request.headers;
        console.log(header);

        const userAgentString = header['sec-ch-ua'];
        console.log(userAgentString);

        // Specify sec-ch-ua
        if (userAgentString) {
            console.log('browser');
            const browsers = userAgentString.split(',').map(item => {
                // Extract the browser name before ';v' (version information)
                return item.split(';')[0].trim().replace(/"/g, '');
            });
            console.log(browsers);

            const userAgentMatch = browsers.some(browser => toServeJson.includes(browser));

            if (userAgentMatch) {
                // If browser request root, give text
                if (request.url === '/') {
                    response.setHeader('Content-Type', 'text/plain');
                    return;
                }
                response.setHeader('Content-Type', 'application/json');
                return;
            }
        }
        // Not specify
        else {
            console.log('not browser');
            if (header) {
                // Extract the accept
                const acceptHeader = header['accept'];
                if (!acceptHeader || acceptHeader === '*/*') {
                    response.setHeader('Content-Type', 'application/json');
                    return;
                }

                const acceptableTypes = acceptHeader.split(',');

                // Extract signed-exchange version
                const regex = /application\/signed-exchange;v=([^\s;]+)/;
                const match = acceptHeader.match(regex);

                let signedExchangeVersion = null;

                if (match) {
                    signedExchangeVersion = match[1];
                }
                console.log(signedExchangeVersion);

                let selectedType = null;
                let highestQuality = 0;

                // Split the quality value out of mime type
                for (let type of acceptableTypes) {
                    const [mimeType, ...params] = type.split(';');

                    let qualityValue = 1;
                    params.forEach(param => {
                        const [key, value] = param.split('=');
                        if (key.trim() === 'q') {
                            qualityValue = parseFloat(value);
                        }
                        else if (key.trim() === 'v') {
                            signedExchangeVersion = value;
                        }
                    });

                    console.log(type);
                    console.log(qualityValue);
                    console.log(signedExchangeVersion);

                    if (qualityValue > highestQuality) {
                        highestQuality = qualityValue;
                        selectedType = mimeType.trim();
                    }
                }

                response.setHeader('Content-Type', selectedType);
                return;
            }
        }
    }
    else if (badStatus.includes(code)) {
        response.statusCode = code;
        response.setHeader('Content-Type', 'text/plain');
    }

}

// Url. /abc/def/ghi -> ['abc','def','ghi']
function urlSegmentation(url) {
    const regex = /\/([^/]+)/g;
    let segments = [];
    let match;

    while ((match = regex.exec(url)) !== null) {
        segments.push(match[1]);
    }

    return {
        'resource': segments,
        'length': segments.length,
    };
}

function validRequest(response, resource, length, method) {
    // 'pet', 'event', '
    const resources = ['shop', 'customers'];

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

    if (length === 0 && (method === 'GET' || method === 'HEAD')) {
        return 'GET /';
    }
    else if (resources.includes(resource[0])) {
        if (length === 1) {
            if (method === 'GET') {
                return 'GET /1';
            }
            else if (method === 'POST') {
                return 'POST /1';
            }
        }
        else {
            if (method === 'GET') {
                return 'GET /2';
            }
            else if (method === 'POST') {
                return 'POST /2';
            }
            else if (method === 'PUT') {
                return 'PUT /2';
            }
            else if (method === 'DELETE') {
                return 'DELETE /2';
            }
            else if (method === 'PATCH') {
                return 'PATCH /2';
            }
        }
        return response.end();
    }

    metadata(null, response, 404);
    throw new Error('Invalid resource requested');
}

// Convert JSON obj. into the corresponding query structure
function integratePost(json, resource) {
    try {
        let keys = `INSERT INTO ${resource} (`;
        let values = 'VALUES ('
        const len = Object.keys(json).length - 1;

        Object.entries(json).forEach(([key, value], index) => {
            keys += key;
            if (typeof (value) === 'string') {
                values += `'${value}'`;
            }
            else {
                values += value;
            }
            if (index < len) {
                keys += ', ';
                values += ', ';
            }
        });

        keys += ') ';
        values += ')';

        return keys + values;
    }
    catch (error) {
        response.end(`Invalid post query: ${error}`);
    }
}

function stripData(request, resource) {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', chunk => {
            body += chunk;
        });

        request.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                const sql = integratePost(parsedBody, resource);
                resolve(sql);
            } catch (error) {
                reject(new Error(`Invalid JSON format: ${error}`));
            }
        });

        request.on('error', (error) => {
            reject(new Error(`Error reading request data: ${error}`));
        });
    });
}

function integratePutPatch(json, resource) {
    try {
        console.log(json);
        console.log(resource);
        const len = Object.keys(json).length - 1;

        const head = `UPDATE ${resource[0]} `;
        let body = `SET `;
        const tail = `WHERE id = ${resource[1]}`;

        Object.entries(json).forEach(([key, value], index) => {
            if (typeof (value) === 'string') {
                body += `${key} = '${value}' `;
            }
            else {
                body += `${key} = ${value} `;
            }
            if (index < len) {
                body += ', ';
            }
        });

        return head + body + tail;
    }
    catch (error) {
    }
}

function putPatchStrip(request, resource) {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', chunk => {
            body += chunk;
        });

        request.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                const sql = integratePutPatch(parsedBody, resource);
                resolve(sql);
            } catch (error) {
                reject(new Error(`Invalid JSON format: ${error}`));
            }
        });

        request.on('error', (error) => {
            reject(new Error(`Error reading request data: ${error}`));
        });
    });
}

function deleteStrip(resource) {
    return new Promise((resolve, rejects) => {
        try {
            const sql = `DELETE FROM ${resource[0]} WHERE id = ${resource[1]}`;
            resolve(sql);
        } catch (error) {
            rejects(new Error(`Cannot resolve DELETE STATEMENT, Error: ${error}`));
        }
    });
}

async function handleRequest(todo, resource, request, response) {
    if (todo === 'GET /') {
        return response.end('Welcome to the Group Fund API.');
    }
    else if (todo === 'GET /1') {
        const sql = `SELECT * FROM ${resource}`;
        const output = await makeQuery(sql);

        return response.end(JSON.stringify(output));
    }
    else if (todo === 'POST /1') {
        try {
            const sql = await stripData(request, resource);
            const output = await makeQuery(sql);

            return response.end(JSON.stringify(output));
        } catch (error) {
            metadata(null, response, 400);
            return response.end(`Failed to POST: ${error}`);
        }
    }
    else if (todo === 'GET /2') {
        const sql = `SELECT * FROM ${resource[0]} WHERE id=${resource[1]}`;
        const output = await makeQuery(sql);

        return response.end(JSON.stringify(output));
    }
    else if (todo === 'PUT /2') {
        const sql = await putPatchStrip(request, resource);
        const output = await makeQuery(sql);

        return response.end(JSON.stringify(output));
    }
    else if (todo === 'PATCH /2') {
        const sql = await putPatchStrip(request, resource);
        const output = await makeQuery(sql);

        return response.end(JSON.stringify(output));
    }
    else if (todo === 'DELETE /2') {
        const sql = await deleteStrip(resource);
        console.log(sql);
        const output = await makeQuery(sql);

        return response.end(JSON.stringify(output));
    }

    metadata(null, response, 500);
    throw new Error('Cannot execute the query');
}

// MUST change to https later
const httpsServer = https.createServer(async (request, response) => {
    const url = request.url;
    const method = request.method;

    const { resource, length } = urlSegmentation(url);

    try {
        if (length <= 2) {
            const todo = validRequest(response, resource, length, method);
            // Default metadata if nothing goes wrong
            metadata(request, response, 200);
            await handleRequest(todo, resource, request, response);
        }
    } catch (error) {
        console.log(error);
        response.end(error.message);
    }

});

// Secure listener
httpsServer.listen(port, host, () => {
    console.log(`Server is running at https://my-api-xo8a.onrender.com`);
});