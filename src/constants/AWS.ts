import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';
import { env } from '../config/envValidate';
export const sqsClient = new SQSClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
export const queueURL = env.QUEUE_URL;

const config = {
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  region: env.AWS_REGION,
};

export const s3Client = new S3Client(config);

export async function getSignedFileUrl(fileName: string, bucket: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 36000 });
}
