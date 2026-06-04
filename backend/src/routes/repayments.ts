import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as repaymentController from '../controllers/repaymentController';

const router = Router();

router.use(authenticateToken);

router.post('/', repaymentController.recordRepayment);
router.get('/:id', repaymentController.getRepayment);
router.get('/loan/:loanId', repaymentController.getRepaymentHistory);
router.get('/collection/summary', repaymentController.getDailyCollectionSummary);

export default router;
