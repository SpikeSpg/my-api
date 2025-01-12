const mysql2 = require('mysql2');

const options = {
    user: 'root',
    host: 'localhost',
    port: 3306,
    password: 'Neptune-915462',
    database: 'testapi',
};

const connection = mysql2.createConnection(options);

connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_bin'", (err, results) => {
    if (err) throw err;
    console.log('Collation set for connection to utf8mb4_bin');
});

connection.query("SHOW VARIABLES LIKE 'collation%';", (err, results) => {
    if (err) throw err;
    console.log(results);
});

function makeQuery(q) {
    return new Promise((resolve, reject) => {
        connection.query(q, (err, results, fields) => {
            if (err) {
                reject(new Error(`Error executing query: ${err.message}`));
            }
            console.log('Query Results:', results);
            console.log('Query Fields:', fields);
            resolve(results);
        });
    });
}

module.exports = {
    makeQuery: makeQuery
};
