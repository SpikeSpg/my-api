const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Neptune-915462',
    database: 'testapi',
});

function startConnection() {
    connection.connect((err) => {
        if (err) {
            console.log('Cannot connect to the mysql daemon...');
            console.log(err);
            return;
        }
        console.log('Successfully connected to the mysql daemon');
    });
}

function makeQuery(sql) {
    return new Promise((resolve, reject) => {
        startConnection();
        connection.query(sql, (err, result) => {
            if (err) {
                console.log(`Failed query: ${err.message}`);
                return reject(err.message);
            }
            console.log(`Success query:`);
            console.log(result);
            resolve(result);
        });
    });
}

module.exports = {
    // startConnection: startConnection,
    makeQuery: makeQuery
};