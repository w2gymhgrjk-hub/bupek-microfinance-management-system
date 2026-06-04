/**
 * JWT configuration and utilities
 */

import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * Generate access token
 */
export const generateAccessToken = (payload: Omit<IJWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as IJWTPayload;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error);
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    return decoded as { userId: number };
  } catch (error) {
    console.error('[JWT] Refresh token verification failed:', error);
    return null;
  }
};

/**
 * Decode token without verification (for inspection)
 */
export const decodeToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.decode(token);
    return decoded as IJWTPayload;
  } catch (error) {
    return null;
  }
};
