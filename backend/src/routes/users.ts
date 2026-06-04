/**
 * User Management Routes
 */

import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/responses';
import { query, queryOne } from '../config/database';
import { hashPassword } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation schemas
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string(),
  role_id: Joi.number().required(),
  branch_id: Joi.number(),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  phone: Joi.string(),
  role_id: Joi.number(),
  branch_id: Joi.number(),
  is_active: Joi.boolean(),
});

const paginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  search: Joi.string(),
  role_id: Joi.number(),
});

/**
 * Get all users
 * GET /api/users
 */
router.get('/', requirePermission('VIEW_USERS'), validateQuery(paginationSchema), asyncHandler(async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, role_id } = req.query as any;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ` AND (u.email ILIKE $${params.length + 1} OR u.first_name ILIKE $${params.length + 2})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role_id) {
      whereClause += ` AND u.role_id = $${params.length + 1}`;
      params.push(role_id);
    }

    // Get total count
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM users u WHERE ${whereClause}`,
      params
    ) as any;
    const total = countResult?.total || 0;

    // Get paginated results
    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role_id, u.branch_id, 
              u.is_active, u.last_login, u.created_at, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    logger.info('[Users] Retrieved user list', { page, limit, total });

    return sendPaginatedSuccess(res, users, page, limit, total, 200, 'Users retrieved successfully');
  } catch (error) {
    logger.error('[Users] Get users error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Get user by ID
 * GET /api/users/:id
 */
router.get('/:id', requirePermission('VIEW_USERS'), asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role_id, u.branch_id,
              u.is_active, u.last_login, u.created_at, u.updated_at, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    logger.error('[Users] Get user error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Create new user
 * POST /api/users
 */
router.post('/', requirePermission('CREATE_USER'), validateBody(createUserSchema), asyncHandler(async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, phone, role_id, branch_id } = req.body;
  const currentUserId = (req.user as any)?.userId || (req.user as any)?.id;

  try {
    // Check if email already exists
    const existingUser = await queryOne('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser) {
      return sendError(res, 400, 'Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await queryOne(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, branch_id, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
       RETURNING id, email, first_name, last_name, phone, role_id, branch_id, is_active, created_at`,
      [email, hashedPassword, first_name, last_name, phone || null, role_id, branch_id || null, currentUserId]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [currentUserId, 'CREATE_USER', `Created user ${email}`, 'USER', (result as any).id]
    );

    logger.info('[Users] User created successfully', { userId: (result as any).id, email });

    return sendSuccess(res, 201, 'User created successfully', result);
  } catch (error) {
    logger.error('[Users] Create user error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Update user
 * PUT /api/users/:id
 */
router.put('/:id', requirePermission('EDIT_USER'), validateBody(updateUserSchema), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = (req.user as any)?.userId || (req.user as any)?.id;

  try {
    // Check if user exists
    const user = await queryOne('SELECT id FROM users WHERE id = $1', [id]);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Update user
    const result = await queryOne(
      `UPDATE users 
       SET email = COALESCE($1, email),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           phone = COALESCE($4, phone),
           role_id = COALESCE($5, role_id),
           branch_id = COALESCE($6, branch_id),
           is_active = COALESCE($7, is_active),
           updated_by = $8,
           updated_at = NOW()
       WHERE id = $9
       RETURNING id, email, first_name, last_name, phone, role_id, branch_id, is_active, updated_at`,
      [
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.phone,
        req.body.role_id,
        req.body.branch_id,
        req.body.is_active,
        currentUserId,
        id,
      ]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [currentUserId, 'EDIT_USER', `Updated user ${id}`, 'USER', id]
    );

    logger.info('[Users] User updated successfully', { userId: id });

    return sendSuccess(res, 200, 'User updated successfully', result);
  } catch (error) {
    logger.error('[Users] Update user error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

export default router;
