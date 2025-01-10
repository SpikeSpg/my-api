// this module is only concern with status code
function status(code, msg, rs) {
    rs.statusCode = code;
    const responseObject = {
        success: code >= 200 && code < 300,
        message: msg,
    };
    rs.write(JSON.stringify(responseObject));
    // rs.end();
}

module.exports = {
    status: status,
};