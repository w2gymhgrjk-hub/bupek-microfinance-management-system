/**
 * Branches Management Routes
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess, sendError, sendPaginatedSuccess } from '../utils/responses';
import { query, queryOne } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../config/logger';
import Joi from 'joi';
import { validateBody, validateQuery } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

const createBranchSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string(),
  city: Joi.string(),
  province: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  branch_manager_id: Joi.number(),
});

const paginationSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  search: Joi.string(),
});

/**
 * Get all branches
 * GET /api/branches
 */
router.get('/', requirePermission('VIEW_BRANCHES'), validateQuery(paginationSchema), asyncHandler(async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'is_active = true';
    const params: any[] = [];

    if (search) {
      whereClause += ` AND (name ILIKE $${params.length + 1} OR code ILIKE $${params.length + 2})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM branches WHERE ${whereClause}`,
      params
    ) as any;
    const total = countResult?.total || 0;

    const branches = await query(
      `SELECT b.*, u.first_name, u.last_name
       FROM branches b
       LEFT JOIN users u ON b.branch_manager_id = u.id
       WHERE ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    logger.info('[Branches] Retrieved branch list', { page, limit, total });

    return sendPaginatedSuccess(res, branches, page, limit, total, 200, 'Branches retrieved successfully');
  } catch (error) {
    logger.error('[Branches] Get branches error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Get branch by ID
 * GET /api/branches/:id
 */
router.get('/:id', requirePermission('VIEW_BRANCHES'), asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const branch = await queryOne(
      `SELECT b.*, u.first_name, u.last_name
       FROM branches b
       LEFT JOIN users u ON b.branch_manager_id = u.id
       WHERE b.id = $1`,
      [id]
    );

    if (!branch) {
      return sendError(res, 404, 'Branch not found');
    }

    return sendSuccess(res, 200, 'Branch retrieved successfully', branch);
  } catch (error) {
    logger.error('[Branches] Get branch error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

/**
 * Create branch
 * POST /api/branches
 */
router.post('/', requirePermission('CREATE_BRANCH'), validateBody(createBranchSchema), asyncHandler(async (req: any, res: any) => {
  const { name, code, address, city, province, phone, email, branch_manager_id } = req.body;
  const currentUserId = req.user.userId || req.user.id;

  try {
    const existingBranch = await queryOne('SELECT id FROM branches WHERE code = $1', [code]);
    if (existingBranch) {
      return sendError(res, 400, 'Branch code already exists');
    }

    const result = await queryOne(
      `INSERT INTO branches (name, code, address, city, province, phone, email, branch_manager_id, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
       RETURNING *`,
      [name, code, address, city, province, phone, email, branch_manager_id, currentUserId]
    );

    await query(
      `INSERT INTO activity_logs (user_id, action, description, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [currentUserId, 'CREATE_BRANCH', `Created branch ${name}`, 'BRANCH', (result as any).id]
    );

    logger.info('[Branches] Branch created successfully', { branchId: (result as any).id, code });

    return sendSuccess(res, 201, 'Branch created successfully', result);
  } catch (error) {
    logger.error('[Branches] Create branch error:', error);
    return sendError(res, 500, 'Internal server error');
  }
}));

export default router;
