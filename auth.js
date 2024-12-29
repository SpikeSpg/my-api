require('dotenv').config();

const mysql2 = require('mysql2');
const fs = require('node:fs');
const path = require('path');

const caCert = fs.readFileSync(path.join(__dirname, 'ssl/ca.pem'));

const connection = mysql2.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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