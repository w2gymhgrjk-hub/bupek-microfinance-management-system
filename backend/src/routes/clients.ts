/**
 * Client Management Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for clients
 */
router.get('/', requirePermission('VIEW_CLIENTS'), (req, res) => {
  sendSuccess(res, 200, 'Clients endpoint - to be implemented');
});

export default router;
