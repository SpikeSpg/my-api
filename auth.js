const mysql2 = require('mysql2');
const fs = require('node:fs');
const path = require('path');

const caCert = fs.readFileSync(path.join(__dirname, 'ssl/ca.pem'));
console.log(caCert);

const connection = mysql2.createConnection({
    user: 'avnadmin',
    host: 'mysql-3b75a0be-thanakonp6-4cb9.g.aivencloud.com',
    port: 25688,
    password: 'AVNS_DuGU5bbvZaMlw91qqt3',
    database: 'testapi',
    ssl: {
        ca: caCert,
    }
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