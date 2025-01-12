const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function registration(data, endpoint) {
    console.log('....................registration....................');
    let k = `INSERT INTO ${endpoint} (`;
    let v = `VALUES (`;
    const length = Object.keys(data).length - 1;
    console.log(data);
    console.log(endpoint);

    const results = await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(value, saltRounds);
                console.log('aaaa');
                return { key, value: `'${hashedPassword}'` };
            } else if (key === 'profile_picture') {
                const filePath = path.join(__dirname, 'static_assets', value).replace(/\\/g, '\\\\');
                console.log('bbbbb');
                console.log(typeof(value));
                console.log(filePath);
                console.log(typeof(filePath));
                return { key, value: `'${filePath}'` };
            } else {
                console.log('ccccc');
                return { key, value: `'${value}'` };
            }
        })
    );

    results.forEach(({ key, value }, index) => {
        k += `${key}${index < length ? ', ' : ') '}`;
        v += `${value}${index < length ? ', ' : ') '}`;
    });

    const sql = k + v;
    console.log(sql);
    console.log('..............................................................');
    return sql;
}

module.exports = {
    registration: registration,
};
