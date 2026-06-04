/**
 * Reports Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for reports
 */
router.get('/', requirePermission('VIEW_REPORTS'), (req, res) => {
  sendSuccess(res, 200, 'Reports endpoint - to be implemented');
});

export default router;
