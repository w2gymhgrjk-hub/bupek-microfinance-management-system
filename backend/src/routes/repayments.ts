/**
 * Repayment Management Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for repayments
 */
router.get('/', requirePermission('VIEW_REPAYMENTS'), (req, res) => {
  sendSuccess(res, 200, 'Repayments endpoint - to be implemented');
});

export default router;
