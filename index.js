// const { makeQuery } = require('./auth');
const { createServer } = require('node:http');
const { responseHeader } = require('./responseHeader');
const { crud } = require('./crud');
const { bodyData } = require('./bodyData');
const { stripedCT } = require('./stripedCT');
const { formData } = require('./formData');

const host = '0.0.0.0';
const port = process.env.PORT || 10000;

// const port = 3000;
// const host = '127.0.0.1';

const httpServer = createServer((request, response) => {
    const rqEndpoint = request.url;
    const rqMethod = request.method;
    const rqHeader = request.headers;
    let contentType = null;
    if (rqMethod === 'POST') {
        contentType = stripedCT(rqHeader);
    }
    console.log(contentType);

    if (contentType === 'multipart/form-data') {
        formData(request, response);
    }

    if (rqEndpoint === '/favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
    }

    try {
        responseHeader(rqHeader, response);
        // crud(rqMethod, rqEndpoint, response, rqHeader);
        response.end();
    } catch (error) {
        response.end(error);
    }

});

httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
