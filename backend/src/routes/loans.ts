import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as loanController from '../controllers/loanController';

const router = Router();

router.use(authenticateToken);

router.post('/', loanController.createLoan);
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoan);
router.post('/:id/approve', loanController.approveLoan);
router.post('/:id/disburse', loanController.disburseLoan);
router.get('/:loanId/schedule', loanController.getLoanSchedule);
router.get('/borrower/:borrowerId', loanController.getLoansByBorrower);

export default router;
