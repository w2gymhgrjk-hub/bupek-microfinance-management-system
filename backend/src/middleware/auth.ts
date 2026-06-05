import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { TokenPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      token?: string;
    }
  }
}

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      req.user = decoded;
      req.token = token;
    } catch (error) {
      console.log('Optional auth token invalid:', error);
    }
  }

  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AuthenticationError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

export const generateToken = (payload: TokenPayload, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};