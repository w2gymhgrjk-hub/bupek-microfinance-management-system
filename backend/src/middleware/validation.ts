/**
 * Request validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendValidationError } from '../utils/responses';
import logger from '../config/logger';

/**
 * Validate request body against schema
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        errors[detail.path.join('.')] = detail.message;
      });

      logger.warn('[Validation] Body validation failed', {
        path: req.path,
        errors,
      });

      return sendValidationError(res, errors);
    }

    // Replace body with validated value
    req.body = value;
    next();
  };
};

/**
 * Validate request query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        errors[detail.path.join('.')] = detail.message;
      });

      logger.warn('[Validation] Query validation failed', {
        path: req.path,
        errors,
      });

      return sendValidationError(res, errors);
    }

    // Replace query with validated value
    req.query = value as any;
    next();
  };
};

/**
 * Validate request parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        errors[detail.path.join('.')] = detail.message;
      });

      logger.warn('[Validation] Params validation failed', {
        path: req.path,
        errors,
      });

      return sendValidationError(res, errors);
    }

    // Replace params with validated value
    req.params = value as any;
    next();
  };
};
