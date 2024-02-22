import { s3Client } from './s3.uploader';
import process from 'process';
import { promisify } from 'util';
import * as fs from 'fs';
import path from 'path';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
export const uploader = async (
  file: Express.Multer.File,
  pathName: string,
  filename: string,
) => {
  if (process.env.STORAGE == 's3') {
    return await s3Client
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: pathName + filename,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise()
      .then((res) => {
        return `${process.env.S3_DOWNLOAD_URL}${res.Key}`;
      });
  } else {
    const fullDirectoryPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'storage',
      pathName,
    );

    await mkdirAsync(fullDirectoryPath, { recursive: true });

    await writeFileAsync(fullDirectoryPath + filename, file.buffer);
    return `${process.env.APP_URL}/user/profile/picture/${filename}`;
  }
};

export const getFileExtension = (file: Express.Multer.File): string => {
  return path.extname(file.originalname);
};

export const getContentType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    // Add more cases for other file types as needed
    default:
      return 'application/octet-stream'; // Default to binary if content type is unknown
  }
};
