/**
 * SMS Routes (Placeholder)
 */

import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

/**
 * Placeholder routes for SMS
 */
router.get('/', requirePermission('VIEW_SMS_LOGS'), (req, res) => {
  sendSuccess(res, 200, 'SMS endpoint - to be implemented');
});

export default router;
