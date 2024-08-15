const b = [
  {
    Body: {
      Records: [
        {
          eventVersion: '2.1',
          eventSource: 'aws:s3',
          awsRegion: 'ap-south-1',
          eventTime: '2024-08-08T04:30:11.730Z',
          eventName: 'ObjectCreated:Put',
          userIdentity: { principalId: 'AWS:AIDAQE3ROOSPVXY5QDA74' },
          requestParameters: { sourceIPAddress: '13.229.16.157' },
          responseElements: { 'x-amz-request-id': 'X9T6HVCXKYH1RA7H', 'x-amz-id-2': 'Vl+dOjB+3xwn9PXoNGgs1mJzc7cztlD5vXKqXnNpl8qOd9QP7lm15iiShpSkHw9ePQDZFU0p8nJG6p261Np6rtLwBYtZUjtn' },
          s3: {
            s3SchemaVersion: '1.0',
            configurationId: 'NewFileUploaded',
            bucket: { name: 'pirates-of-gril-v1', ownerIdentity: { principalId: 'A2KTGLW4KN8RZ4' }, arn: 'arn:aws:s3:::pirates-of-gril-v1' },
            object: { key: 'PetPoojaData_35531//35531_20240807.json', size: 453314, eTag: '0230b8f816fb604aadc515ec8a8327a0', sequencer: '0066B449D3A9EBE6CC' },
          },
        },
      ],
    },
    MD5OfBody: '45f08196d4a6bb5e3fcd85dd072f7177',
    MessageId: '443199e7-3aef-431f-a0b6-3fbc87cea347',
    ReceiptHandle:
      'AQEBrWcqJccuwOTQQvYxWKZkkDsNU/wonkGmBz+e8sA9ZDOUM8zhJt7Zo1SEsRqrfXsX6YtK0aDBH0a1eX5DQvDSxcmmBceFbE4Y/waeURG6lhV1TwL8Beqgjdj7gSIeuUamNbwKgliv82CB+O/c+Hp8A+IT70iWDK8tIBvMkdpOwVHuMR8meL1NdpBJWPTQ9Z2s3S36kHxVt/xrgP24UO7nANUTlOrh6i7aZboMhdt0S89DzPvTHXUm4DfOwB/LtEp5v/sRmcvRCi+ChCKwaipYHNi6q7QzDJROo837dDCRHzTjaypw0+m0C8jZvQ55Br8CPgnhTINnZBAJIPskKlhq1Rqblcc85c7VIkT8Ptw3soTF0iiPIOIIkfm2nV5E64NSWIXPMi0HxIavxzRLa9jCRAa/cUzKgaKjreVXoB6vDGg=',
  },
];
console.log('🚀 ~ a:', b);
