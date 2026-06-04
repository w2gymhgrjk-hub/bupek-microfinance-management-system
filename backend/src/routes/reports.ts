import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as reportController from '../controllers/reportController';

const router = Router();

router.use(authenticateToken);

router.get('/par', reportController.getPARReport);
router.get('/daily-collection', reportController.getDailyCollectionReport);
router.get('/branch-performance', reportController.getBranchPerformanceReport);
router.get('/loan-officer-performance', reportController.getLoanOfficerPerformanceReport);
router.get('/recovery', reportController.getRecoveryReport);

export default router;
