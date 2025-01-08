// This module is only concern with extract body data out (not design for a type multipart)
const { formData } = require('./formData');

function bodyData(rq) {
    console.log('....................begin of bodyData log....................');
    let body = '';
    let count = 0;
    // let jsonData = {};

    rq.on('data', chunk => {
        count++;
        console.log(chunk);
        console.log(typeof (chunk));
        body += chunk;
    });

    rq.on('end', () => {
        console.log(count);
        console.log(typeof (body));
        console.log(body);
        // jsonData = JSON.parse(body);
        // console.log(jsonData);
        // console.log(typeof(jsonData));
        return body;
    });
    console.log('..............................................................');
}

module.exports = {
    bodyData: bodyData,
};