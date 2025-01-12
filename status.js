// this module is only concern with status code
function status(code, msg, rs, token = null) {
    rs.statusCode = code;
    const responseObject = {
        success: code >= 200 && code < 300,
        message: msg,
        token: token,
    };
    const body = JSON.stringify(responseObject);
    return body;
    // rs.end();
}

module.exports = {
    status: status,
};