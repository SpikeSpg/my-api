// const { makeQuery } = require('./auth');
const { createServer } = require('node:http');
const { responseHeader } = require('./responseHeader');
const { crud } = require('./crud');
const { bodyData } = require('./bodyData');
const { stripedCT } = require('./stripedCT');
const { formData } = require('./formData');

// public (anyone can access)
// const host = '0.0.0.0';
const port = process.env.PORT || 10000;

// for the lan(wifi) only
const host = '192.168.0.137';

// private (localhost)
// const port = 3000;
// const host = '127.0.0.1';

const httpServer = createServer(async (request, response) => {
    const rqEndpoint = request.url;
    const rqMethod = request.method;
    const rqHeader = request.headers;

    console.log(JSON.stringify(request.headers));

    if (rqEndpoint === '/favicon.ico') {
        response.writeHead(204);
        response.end('No icon to be displayed here.');
        return null;
    }

    let contentType = rqHeader.contentType;
    console.log(rqEndpoint);
    let data = null;

    // Not all the post has to have data, some just wanna send sensitive data
    if (rqMethod === 'POST') {
        contentType = stripedCT(rqHeader);
        if (contentType === 'multipart/form-data') {
            data = await formData(request, response);
        }
        else {
            data = bodyData(request);
        }
    }
    console.log(contentType);

    try {
        responseHeader(rqHeader, response);
        console.log(data);
        console.log(response.statusCode);

        const body = await crud(rqMethod, rqEndpoint, response, rqHeader, contentType, data);
        console.log('----main----',typeof(body));
        console.log(body);
        // never ever !! convert body types!
        response.end(body);
    } catch (error) {
        console.log('Main log error.');
        response.end(error);
    }

});

httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
