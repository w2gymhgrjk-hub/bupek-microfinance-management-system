/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { sendError } from '../utils/responses';

interface CustomError extends Error {
  statusCode?: number;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('[Error] Unhandled error', {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Don't expose error details in production
  const errorMessage = process.env.NODE_ENV === 'production' ? 'Internal server error' : message;

  return sendError(res, statusCode, errorMessage);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('[404] Not found', {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  return sendError(res, 404, 'Not found', `Route ${req.path} not found`);
};

/**
 * Async error wrapper to catch Promise rejections
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
