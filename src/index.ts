import express from 'express';
import { env } from './config/envValidate';

import { DeleteMessageCommand, ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import { error } from 'console';
import 'dotenv/config';
import fs from 'fs/promises';
import { getSignedFileUrl, queueURL, sqsClient } from './constants/AWS';
import { downloader } from './helper/downloader';
import { getDataFromFile } from './helper/getDataFromFile';
import { sendDataToDb } from './helper/sendDataToDB';
const app = express();

const receiveMessage = async () => {
  const params = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 500,
    WaitTimeSeconds: 0,
  };
  try {
    const command = new ReceiveMessageCommand(params);
    const data = await sqsClient.send(command);
    const Messages = data.Messages;
    if (Messages && Messages[0].Body) {
      const body = await JSON.parse(Messages[0].Body);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const MessageId = Messages[0].MessageId;
      const receiptHandle = Messages[0].ReceiptHandle;

      // const region = body.Records[0].awsRegion;
      const bucketName = body.Records[0].s3.bucket.name;
      const objectKey = body.Records[0].s3.object.key;

      // Fetch the URL
      // const URL = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;

      // Get Signed URL from S3
      const result = await getSignedFileUrl(objectKey, bucketName);

      // Download File from the URL
      const { filePath } = await downloader(result);
      // console.log('🚀 ~ receiveMessage ~ filePath, downloadStatus:', filePath, downloadStatus);
      if (!filePath) {
        throw error;
      }

      // From the filePath get all the data from the file into a variable
      // Download file's data will be converted in jSON and stored in a variable response
      const response = await getDataFromFile(filePath);
      if (!response) {
        throw error;
      }

      // Fetch important data from the object
      // Save the data in the database
      const fileProcessingStatus = await sendDataToDb(response);
      if (!fileProcessingStatus) {
        throw new Error('Failed to send data to database');
      }

      // Delete The notification
      const deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: receiptHandle,
      };
      const deleteCommand = new DeleteMessageCommand(deleteParams);
      await sqsClient.send(deleteCommand);
      console.log('Message deleted from the queue');

      // If the Notification is deleted then delete the file present in my local
      await fs.unlink(filePath);
      console.log('File deleted from local storage');

      // If file was completely downloaded, processed and delted then get the next notification in the queue and process that. and keep this server running
    }
  } catch (err) {
    console.log('Receive Error', err);
  } finally {
    // Call receiveMessage again to poll for the next message
    // setTimeout(receiveMessage, 10000);
  }
};
// Continuously poll for new messages
receiveMessage();

app.listen(env.PORT, () => {
  console.log('listening to port 500');
});
