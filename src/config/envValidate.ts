import dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';
dotenv.config();

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  DIRECT_URL: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  QUEUE_URL: str(),
  PORT: num(),
});
