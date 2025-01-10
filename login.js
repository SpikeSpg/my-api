const bcrypt = require('bcrypt');
const { makeQuery } = require('./auth');

async function login(data, endpoint) {
    console.log('login');
    console.log(data);
    let sql = `SELECT * FROM ${endpoint} WHERE `;
    let kv = '';

    const length = Object.keys(data).length - 1;

    Object.entries(data).forEach(([key, value], index) => {
        console.log(`${key}: ${value}`);
        kv += `${key} = '${value}'`;
        if (index < length) {
            kv += ' AND ';
        }
    });
    sql += kv;
    console.log(sql);

    const q = await makeQuery(sql);
    if (q) {
        console.log('query complete');
    }
    else {
        console.log('errorrr');
    }
}

module.exports = {
    login: login,
};