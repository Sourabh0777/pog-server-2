interface SQSMessage extends AWS.SQS.Message {
  Body: string;
}

export interface SQSMessage {
  Body: string | undefined;
  MD5OfBody: string | undefined;
  MessageId: string | undefined;
  ReceiptHandle: string | undefined;
}
