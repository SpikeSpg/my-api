const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function registration(data, endpoint) {
    let k = `INSERT INTO ${endpoint} (`;
    let v = `VALUES (`;
    const length = Object.keys(data).length - 1;

    const results = await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(value, saltRounds);
                return { key, value: `'${hashedPassword}'` };
            } else if (key === 'profile_picture') {
                const filePath = path.join(__dirname, 'static_assets', value).replace(/\\/g, '\\\\');
                return { key, value: `'${filePath}'` };
            } else {
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
    return sql;
}

module.exports = {
    registration: registration,
};
