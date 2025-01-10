// const mysql2 = require('mysql2');

// const options = {
//     user: 'root',
//     host: 'localhost',
//     port: 3306,
//     password: 'Neptune-915462',
//     database: 'testapi',
// };

// const connection = mysql2.createConnection(options);

<<<<<<< HEAD
function makeQuery(q) {
    return new Promise((resolve, reject) => {
        connection.query(q, (err, results, fields) => {
            if (err) {
                return reject(new Error(`Error executing query: ${err.message}`));
            }
            console.log('Query Results:', results);
            console.log('Query Fields:', fields);
            resolve(results);
        });
    });
}
=======
// function makeQuery(q) {
//     connection.query(q, (err, results, fields) => {
//         if (err) {
//             throw new Error(`Error executing query: ${err.message}`);
//         }
//         console.log('Query Results:', results);
//         console.log('Query Fields:', fields);
//     });
// }
>>>>>>> f1d028de3b61cd7217785f575926d4d55a7bf917

// module.exports = {
//     makeQuery: makeQuery
// };
