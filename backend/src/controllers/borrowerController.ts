import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { BorrowerService } from '../services/borrowerService';
import { HTTP_STATUS } from '../constants/errors';

const borrowerService = new BorrowerService();

export const createBorrower = asyncHandler(async (req: Request, res: Response) => {
  const borrowerData = {
    ...req.body,
    branch_id: req.user.branch_id,
    created_by: req.user.id,
  };

  const borrower = await borrowerService.createBorrower(borrowerData);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Borrower created successfully',
    data: borrower,
  });
});

export const getBorrower = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const borrower = await borrowerService.getBorrowerById(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: borrower,
  });
});

export const getAllBorrowers = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;
  const branchId = req.user.branch_id;

  const borrowers = await borrowerService.getAllBorrowers(
    branchId,
    parseInt(limit as string),
    parseInt(offset as string)
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: borrowers,
  });
});

export const updateBorrower = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_by: req.user.id,
  };

  const borrower = await borrowerService.updateBorrower(parseInt(id), updates);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Borrower updated successfully',
    data: borrower,
  });
});

export const addGuarantor = asyncHandler(async (req: Request, res: Response) => {
  const guarantor = await borrowerService.addGuarantor(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Guarantor added successfully',
    data: guarantor,
  });
});

export const getGuarantors = asyncHandler(async (req: Request, res: Response) => {
  const { borrowerId } = req.params;
  const guarantors = await borrowerService.getGuarantors(parseInt(borrowerId));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: guarantors,
  });
});

export const verifyKYC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const borrower = await borrowerService.verifyKYC(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'KYC verified successfully',
    data: borrower,
  });
});
