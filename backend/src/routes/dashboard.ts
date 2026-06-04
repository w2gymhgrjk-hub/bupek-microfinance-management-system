/**
 * Dashboard Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for dashboard
 */
router.get('/', requirePermission('VIEW_DASHBOARD'), (req, res) => {
  sendSuccess(res, 200, 'Dashboard endpoint - to be implemented');
});

export default router;
