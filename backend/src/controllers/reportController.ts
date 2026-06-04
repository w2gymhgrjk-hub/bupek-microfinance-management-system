import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ReportService } from '../services/reportService';
import { HTTP_STATUS } from '../constants/errors';

const reportService = new ReportService();

export const getPARReport = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const branchId = req.user.branch_id;

  const report = await reportService.getPARReport(branchId, date ? new Date(date as string) : undefined);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});

export const getDailyCollectionReport = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const branchId = req.user.branch_id;

  const report = await reportService.getDailyCollectionReport(branchId, date ? new Date(date as string) : undefined);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});

export const getBranchPerformanceReport = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.user.branch_id;
  const report = await reportService.getBranchPerformanceReport(branchId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});

export const getLoanOfficerPerformanceReport = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.user.branch_id;
  const report = await reportService.getLoanOfficerPerformanceReport(branchId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});

export const getRecoveryReport = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const branchId = req.user.branch_id;

  const report = await reportService.getRecoveryReport(branchId, status as string);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: report,
  });
});
