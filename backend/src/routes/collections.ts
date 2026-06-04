/**
 * Collections Management Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for collections
 */
router.get('/', requirePermission('VIEW_OVERDUE'), (req, res) => {
  sendSuccess(res, 200, 'Collections endpoint - to be implemented');
});

export default router;
