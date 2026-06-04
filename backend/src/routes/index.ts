/**
 * API Routes setup
 */

import { Router } from 'express';

import authRoutes from './auth';
import userRoutes from './users';
import branchRoutes from './branches';
import clientRoutes from './clients';
import loanRoutes from './loans';
import repaymentRoutes from './repayments';
import collectionRoutes from './collections';
import reportRoutes from './reports';
import dashboardRoutes from './dashboard';
import smsRoutes from './sms';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', userRoutes);
router.use('/branches', branchRoutes);
router.use('/clients', clientRoutes);
router.use('/loans', loanRoutes);
router.use('/repayments', repaymentRoutes);
router.use('/collections', collectionRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/sms', smsRoutes);

export default router;
