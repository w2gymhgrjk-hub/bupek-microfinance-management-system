import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { LoanService } from '../services/loanService';
import { HTTP_STATUS } from '../constants/errors';

const loanService = new LoanService();

export const createLoan = asyncHandler(async (req: Request, res: Response) => {
  const loanData = {
    ...req.body,
    branch_id: req.user.branch_id,
    created_by: req.user.id,
  };

  const loan = await loanService.createLoan(loanData);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Loan application created successfully',
    data: loan,
  });
});

export const getLoan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const loan = await loanService.getLoanById(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: loan,
  });
});

export const getAllLoans = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const branchId = req.user.branch_id;

  const loans = await loanService.getAllLoans(status as string, branchId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: loans,
  });
});

export const getLoansByBorrower = asyncHandler(async (req: Request, res: Response) => {
  const { borrowerId } = req.params;
  const loans = await loanService.getLoansByBorrower(parseInt(borrowerId));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: loans,
  });
});

export const approveLoan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approvedAmount, approvalComments } = req.body;

  const loan = await loanService.approveLoan(
    parseInt(id),
    approvedAmount,
    approvalComments,
    req.user.id
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Loan approved successfully',
    data: loan,
  });
});

export const disburseLoan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { disbursementDate } = req.body;

  const loan = await loanService.disburseLoan(
    parseInt(id),
    new Date(disbursementDate),
    req.user.id
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Loan disbursed successfully',
    data: loan,
  });
});

export const getLoanSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { loanId } = req.params;
  const schedule = await loanService.getLoanSchedule(parseInt(loanId));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: schedule,
  });
});
