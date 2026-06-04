/**
 * Loan Management Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for loans
 */
router.get('/', requirePermission('VIEW_LOANS'), (req, res) => {
  sendSuccess(res, 200, 'Loans endpoint - to be implemented');
});

export default router;
