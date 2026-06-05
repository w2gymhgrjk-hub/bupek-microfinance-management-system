import dotenv from 'dotenv';

dotenv.config();

export const smsConfig = {
  provider: process.env.SMS_PROVIDER || 'africastalking',
  apiKey: process.env.SMS_API_KEY || '',
  apiUrl: process.env.SMS_API_URL || 'https://api.sandbox.africastalking.com/version1/messaging',
  username: process.env.SMS_USERNAME || '',
  senderId: process.env.SMS_SENDER_ID || 'BUPEK',
  enabled: process.env.SMS_ENABLED === 'true',
};

export default smsConfig;