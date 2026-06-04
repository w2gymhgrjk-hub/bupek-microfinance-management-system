/**
 * Authentication Routes
 */

import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { validateBody } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/responses';
import { query, queryOne } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt';
import { hashPassword, comparePassword } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';

const router = Router();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required(),
});

/**
 * Login endpoint
 * POST /api/auth/login
 */
router.post('/login', validateBody(loginSchema), asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await queryOne(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1 AND u.is_active = true`,
      [email]
    );

    if (!user) {
      logger.warn('[Auth] Login failed - user not found', { email });
      return sendError(res, 401, 'Invalid credentials');
    }

    // Verify password
    const passwordMatch = await comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('[Auth] Login failed - invalid password', { email });
      return sendError(res, 401, 'Invalid credentials');
    }

    // Get user permissions
    const permissions = await query(
      `SELECT p.name FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`,
      [user.role_id]
    );

    const permissionNames = permissions.map((p: any) => p.name);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      branchId: user.branch_id,
      permissions: permissionNames,
    });

    const refreshToken = generateRefreshToken(user.id);

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'LOGIN', 'User logged in', req.ip]
    );

    logger.info('[Auth] User logged in successfully', { userId: user.id, email });

    return sendSuccess(res, 200, 'Login successful', {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role_name,
        branch_id: user.branch_id,
      },
    });
  } catch (error) {
    logger.error('[Auth] Login error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Refresh token endpoint
 * POST /api/auth/refresh
 */
router.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  try {
    const decoded = verifyRefreshToken(refresh_token);

    if (!decoded) {
      logger.warn('[Auth] Refresh token verification failed');
      return sendError(res, 401, 'Invalid refresh token');
    }

    // Fetch user
    const user = await queryOne(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (!user) {
      logger.warn('[Auth] User not found for refresh token');
      return sendError(res, 401, 'User not found');
    }

    // Get permissions
    const permissions = await query(
      `SELECT p.name FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`,
      [user.role_id]
    );

    const permissionNames = permissions.map((p: any) => p.name);

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      branchId: user.branch_id,
      permissions: permissionNames,
    });

    logger.info('[Auth] Token refreshed successfully', { userId: user.id });

    return sendSuccess(res, 200, 'Token refreshed', {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role_name,
      },
    });
  } catch (error) {
    logger.error('[Auth] Refresh token error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Get current user endpoint
 * GET /api/auth/me
 */
router.get('/me', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.userId || (req.user as any)?.id;

    const user = await queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role_id, u.branch_id, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [userId]
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'Current user retrieved', user);
  } catch (error) {
    logger.error('[Auth] Get current user error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Change password endpoint
 * POST /api/auth/change-password
 */
router.post('/change-password', authMiddleware, validateBody(changePasswordSchema), asyncHandler(async (req: Request, res: Response) => {
  const { current_password, new_password } = req.body;
  const userId = (req.user as any)?.userId || (req.user as any)?.id;

  try {
    // Get user
    const user = await queryOne(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Verify current password
    const passwordMatch = await comparePassword(current_password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('[Auth] Password change failed - invalid current password', { userId });
      return sendError(res, 400, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(new_password);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description) 
       VALUES ($1, $2, $3)`,
      [userId, 'CHANGE_PASSWORD', 'User changed password']
    );

    logger.info('[Auth] Password changed successfully', { userId });

    return sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    logger.error('[Auth] Change password error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

export default router;
