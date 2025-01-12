// This module is only concern with content type of the response header
function responseHeader(h, rs) {
    console.log('....................begin of responseHeader log....................');
    console.log(h);
    const accept = h['accept'];

    if (accept === '*/*' || accept === undefined) {
        rs.setHeader('Content-Type', 'application/json');
        return null;
    }
    console.log(typeof (accept));
    // [1, 1, 0.9, 1, 1, 1, 0.8, 0.7]
    const parts = accept.split(',');
    console.log(parts);
    console.log(typeof (parts));
    console.log(parts[0]);
    // parts[0] = 'application/json';

    const result = parts.reduce((acc, item) => {
        const match = item.match(/;q=([\d.]+)/);
        acc[item] = match ? parseFloat(match[1]) : 1;
        return acc;
    }, {});

    console.log(result);

    const maxEntry = Object.entries(result).reduce((max, [key, value]) => {
        return value > max.value ? { key, value } : max;
    }, { key: '', value: -Infinity });

    let maxKey = maxEntry.key;

    if (maxEntry.value !== 1) {
        maxKey = maxKey.replace(/;q=.*$/, '');  // Remove anything after ';q='
    }
    console.log(maxKey);
    console.log(typeof (maxKey));

    rs.setHeader('Content-Type', maxKey);
    console.log('..............................................................');
    return null;
}

module.exports = {
    responseHeader: responseHeader,
};