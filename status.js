// this module is only concern with status code
function status(code, msg, rs) {
    rs.statusCode = code;
    rs.write(msg);
}

module.exports = {
    status: status,
};