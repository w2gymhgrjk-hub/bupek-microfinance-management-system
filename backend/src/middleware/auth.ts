/**
 * Authentication and authorization middleware
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { sendError } from '../utils/responses';
import { IJWTPayload } from '../types';
import logger from '../config/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload & { id?: number; userId?: number };
      token?: string;
    }
  }
}

/**
 * Verify JWT token from Authorization header
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('[Auth] Missing or invalid authorization header', {
        ip: req.ip,
        path: req.path,
      });
      return sendError(res, 401, 'Unauthorized', 'Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      logger.warn('[Auth] Invalid token', {
        ip: req.ip,
        path: req.path,
      });
      return sendError(res, 401, 'Unauthorized', 'Invalid or expired token');
    }

    // Attach user info to request
    req.user = {
      ...decoded,
      id: decoded.userId,
    };
    req.token = token;

    logger.debug('[Auth] Token verified', {
      userId: decoded.userId,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('[Auth] Authentication error:', error);
    return sendError(res, 500, 'Internal server error');
  }
};

/**
 * Authorization middleware - check user role
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      const userRole = req.user.roleId?.toString();

      if (!userRole || !requiredRoles.includes(userRole)) {
        logger.warn('[Auth] Insufficient permissions', {
          userId: req.user.userId,
          requiredRoles,
          userRole,
        });
        return sendError(res, 403, 'Forbidden', 'Insufficient permissions');
      }

      next();
    } catch (error) {
      logger.error('[Auth] Authorization error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  };
};

/**
 * Permission check middleware
 */
export const requirePermission = (permission: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const requiredPermissions = Array.isArray(permission) ? permission : [permission];
      const userPermissions = req.user.permissions || [];

      const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

      if (!hasPermission) {
        logger.warn('[Auth] Permission denied', {
          userId: req.user.userId,
          requiredPermissions,
        });
        return sendError(res, 403, 'Forbidden', 'Permission denied');
      }

      next();
    } catch (error) {
      logger.error('[Auth] Permission check error:', error);
      return sendError(res, 500, 'Internal server error');
    }
  };
};

/**
 * Optional auth middleware - doesn't require token but attaches user if present
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      if (decoded) {
        req.user = {
          ...decoded,
          id: decoded.userId,
        };
        req.token = token;
      }
    }

    next();
  } catch (error) {
    logger.error('[Auth] Optional auth error:', error);
    next(); // Continue even if auth fails
  }
};
