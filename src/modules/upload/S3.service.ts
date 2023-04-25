import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { S3 } from 'aws-sdk/clients/all';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new S3({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImageUploadService {

  async fileupload(@Req() req, @Res() res, folder: string):Promise<string>{
    return new Promise((resolve, reject) => {
    this.upload(folder)(req, res, async function(error) {
      if (error) {
        console.log(error);
        reject(`Failed to upload image file: ${error}`);
      } else {
        const encryptedKey = CryptoJS.AES.encrypt(req.files[0].key, process.env.ENCRYPTION_KEY)
        resolve(encryptedKey.toString());
      }
    });
  });
  }
  upload = (folder: string) => multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${folder}/${Date.now().toString()} - ${file.originalname}`);
      },
      metadata: function(request, file, cb) {
        cb(null, {contentType: file.mimetype});
      }
    }),
  }).array('file', 1);

  async retrieveImage(key: string) {
    var decryptedKey = CryptoJS.AES.decrypt(key, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    try {
      const object = await s3.getObject({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: decryptedKey,
      }).promise();
      
      return object;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to retrieve image file: ${error}`);
    }
  }
}