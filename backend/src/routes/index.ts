import { Router } from 'express';
import authRoutes from './auth';
import borrowerRoutes from './borrowers';
import loanRoutes from './loans';
import repaymentRoutes from './repayments';
import collectionRoutes from './collections';
import reportRoutes from './reports';

const router = Router();

router.use('/auth', authRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/loans', loanRoutes);
router.use('/repayments', repaymentRoutes);
router.use('/collections', collectionRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BUPEK API is running' });
});

export default router;
