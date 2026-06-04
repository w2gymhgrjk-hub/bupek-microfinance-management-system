import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;
