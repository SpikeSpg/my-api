function stripedCT(rqHead) {
    console.log('....................begin of stripedCT log....................');
    console.log(typeof (rqHead));
    const ct = rqHead['content-type'];
    console.log(ct);
    const stripedContentType = ct.split(';');
    console.log(stripedContentType);
    console.log(typeof (stripedContentType));
    console.log(stripedContentType[0]);
    console.log(typeof (stripedContentType[0]));

    console.log('..............................................................');
    return stripedContentType[0];
}

module.exports = {
    stripedCT: stripedCT,
};