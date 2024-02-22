import AWS from 'aws-sdk';
import process from 'process';

export const s3Client = new AWS.S3({
  s3ForcePathStyle: false,
  endpoint: process.env.S3_ENDPOINT_URL,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});
