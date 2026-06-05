import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'bupek-secret-key-change-in-production';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '30d';

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRATION,
  refreshExpiresIn: REFRESH_TOKEN_EXPIRATION,
};

export default jwtConfig;