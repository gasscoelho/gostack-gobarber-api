import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  config: {
    aws: {
      bucket: process.env.AWS_BUCKET,
    },
    disk: {},
  },
  driver: process.env.STORAGE_DRIVER,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(res, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),
} as IUploadConfig;
