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

const httpServer = createServer(async (request, response) => {
    const rqEndpoint = request.url;
    const rqMethod = request.method;
    const rqHeader = request.headers;

    console.log(JSON.stringify(request.headers));

    if (rqEndpoint === '/favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
    }

    let contentType = null;
    if (rqMethod === 'POST') {
        contentType = stripedCT(rqHeader);
    }
    console.log(contentType);

    try {
        responseHeader(rqHeader, response);
        let data = null;
        if (contentType === 'multipart/form-data') {
            data = await formData(request, response);
        }
        console.log(data);
        console.log(response.statusCode);

        crud(rqMethod, rqEndpoint, response, rqHeader, contentType, data);
        response.end();
    } catch (error) {
        response.end(error);
    }

});

httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
