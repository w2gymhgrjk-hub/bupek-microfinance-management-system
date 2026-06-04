/**
 * Request/Response logging middleware
 */

import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger from '../config/logger';

/**
 * Morgan token for including user info
 */
morgan.token('user', (req: any) => {
  return req.user?.userId || 'anonymous';
});

/**
 * Custom morgan format
 */
const morganFormat = ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

/**
 * Create morgan middleware with Winston logger
 */
export const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

/**
 * Custom request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.debug('[Request]', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: (req as any).user?.userId || 'anonymous',
  });

  // Log response when it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug('[Response]', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
