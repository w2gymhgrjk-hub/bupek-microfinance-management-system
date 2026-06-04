/**
 * Standard response formatting utilities
 */

import { Response } from 'express';
import { IApiResponse, IPaginatedResponse } from '../types';

/**
 * Send successful response
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message: string = 'Success',
  data?: T
) => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200,
  message: string = 'Success'
) => {
  const response: IPaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    timestamp: new Date(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  statusCode: number = 400,
  message: string = 'Error',
  error?: string
) => {
  const response = {
    success: false,
    message,
    error: error || message,
    statusCode,
    timestamp: new Date(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: Record<string, string> | string
) => {
  const response = {
    success: false,
    message: 'Validation failed',
    errors: typeof errors === 'string' ? { general: errors } : errors,
    statusCode: 422,
    timestamp: new Date(),
  };
  return res.status(422).json(response);
};
