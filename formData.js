const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { status } = require('./status');

function formData(req, res) {
    console.log('....................begin of formData log....................');
    const busboy = Busboy({ headers: req.headers });
    const uploads = {};
    const fileWrites = [];
    const cm = {};

    return new Promise((resolve, reject) => {
        busboy.on('file', (fieldname, file, fileInfo, encoding, mimetype) => {
            console.log(fieldname, ': ', typeof (fieldname));
            console.log(file, ': ', typeof (file));
            console.log(fileInfo, ': ', typeof (fileInfo));
            console.log(typeof (encoding));
            console.log(typeof (mimetype));

            if (!fileInfo) {
                console.error('No valid filename received.');
                file.resume();
                return;
            }

            const originalFilename = fileInfo.filename;
            console.log(originalFilename);

            const randomString = crypto.randomBytes(16).toString('hex');
            const fileExtension = path.extname(originalFilename);
            const uniqueFilename = randomString + fileExtension;

            console.log(`Saving to: ${uniqueFilename}`);
            uploads[fieldname] = uniqueFilename;

            const saveTo = path.join(__dirname, 'static_assets', uniqueFilename);
            console.log(saveTo);

            const writeStream = fs.createWriteStream(saveTo);
            file.pipe(writeStream);

            const fileWritePromise = new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    console.log(`File [${uniqueFilename}] saved successfully.`);
                    resolve();
                });
                writeStream.on('error', (err) => {
                    console.error(`Error saving file [${uniqueFilename}]:`, err);
                    reject(err);
                });
            });

            fileWrites.push(fileWritePromise);
        });

        busboy.on('field', (fieldname, value) => {
            console.log(`Text field: ${fieldname}, Value: ${value}`);
            uploads[fieldname] = value;
        });

        busboy.on('finish', () => {
            console.log('Busboy finished parsing form.');
            Promise.all(fileWrites)
                .then(() => {
                    console.log('All files have been saved.');
                    console.log({ message: 'Upload complete', uploads });
                    cm['msg'] = 'Files uploaded successfully!';
                    cm['code'] = 201;
                    console.log(cm);

                    status(cm.code, cm.msg, res);
                    resolve(uploads);
                })
                .catch((err) => {
                    console.error('Error saving files:', err);
                    console.log({ message: 'Error saving files', error: err });

                    cm['msg'] = 'Unable to save the image.';
                    cm['code'] = 500;
                    console.log(cm);

                    status(cm.code, cm.msg, res);
                    reject(err);
                });
        });

        req.pipe(busboy);
        console.log('..............................................................');
    });
}

module.exports = {
    formData: formData,
};
