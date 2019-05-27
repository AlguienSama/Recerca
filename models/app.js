const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

const Schema = mongoose.Schema;


const path = require('path');

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/BaseM',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex');
        const fileInfo = {
          filename: filename,
          bucketName: 'uploadApp'
        };
        resolve(fileInfo);
      });
    });
  }
});

const Upload = multer({ storage });

module.exports = Upload;
