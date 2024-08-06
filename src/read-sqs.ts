import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({ region: 'ap-south-1' });

// Create SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueURL = 'https://sqs.ap-south-1.amazonaws.com/010438472863/petPoojaFileMonitoringQueue';
const params = {
  QueueUrl: queueURL,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

const receiveMessage = () => {
  console.log('working');

  sqs.receiveMessage(params, (err, data) => {
    console.log('working 2 ');

    if (err) {
      console.log('Receive Error', err);
    } else if (data.Messages) {
      data.Messages.forEach(message => {
        console.log('Message received:', message);

        // Process the message here
      });
    }
  });
};

// Continuously poll for new messages
setInterval(receiveMessage, 5000); // Poll every 5 seconds
