import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as borrowerController from '../controllers/borrowerController';

const router = Router();

router.use(authenticateToken);

router.post('/', borrowerController.createBorrower);
router.get('/', borrowerController.getAllBorrowers);
router.get('/:id', borrowerController.getBorrower);
router.put('/:id', borrowerController.updateBorrower);
router.post('/:id/kyc-verify', borrowerController.verifyKYC);

// Guarantors
router.post('/:borrowerId/guarantors', borrowerController.addGuarantor);
router.get('/:borrowerId/guarantors', borrowerController.getGuarantors);

export default router;
