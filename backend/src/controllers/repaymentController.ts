import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { RepaymentService } from '../services/repaymentService';
import { HTTP_STATUS } from '../constants/errors';

const repaymentService = new RepaymentService();

export const recordRepayment = asyncHandler(async (req: Request, res: Response) => {
  const repaymentData = {
    ...req.body,
    created_by: req.user.id,
  };

  const repayment = await repaymentService.recordRepayment(repaymentData);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Repayment recorded successfully',
    data: repayment,
  });
});

export const getRepaymentHistory = asyncHandler(async (req: Request, res: Response) => {
  const { loanId } = req.params;
  const repayments = await repaymentService.getRepaymentHistory(parseInt(loanId));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: repayments,
  });
});

export const getRepayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const repayment = await repaymentService.getRepaymentById(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: repayment,
  });
});

export const getDailyCollectionSummary = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const branchId = req.user.branch_id;

  const summary = await repaymentService.getDailyCollectionSummary(
    branchId,
    new Date(date as string)
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: summary,
  });
});
