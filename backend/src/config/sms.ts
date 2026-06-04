export const smsConfig = {
  provider: process.env.SMS_PROVIDER || 'placeholder',
  apiKey: process.env.SMS_API_KEY || '',
  apiUrl: process.env.SMS_API_URL || '',
  senderId: process.env.SMS_SENDER_ID || 'BUPEK',
  enabled: process.env.SMS_ENABLED === 'true' || false,
};
