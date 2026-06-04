import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { CollectionService } from '../services/collectionService';
import { HTTP_STATUS } from '../constants/errors';

const collectionService = new CollectionService();

export const identifyOverdueLoans = asyncHandler(async (req: Request, res: Response) => {
  await collectionService.identifyOverdueLoans();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Overdue loans identified',
  });
});

export const getOverdueLoans = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.user.branch_id;
  const overdueLoans = await collectionService.getOverdueLoans(branchId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: overdueLoans,
  });
});

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  const collectionData = {
    ...req.body,
    collection_officer_id: req.user.id,
  };

  const collection = await collectionService.createCollection(collectionData);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Collection record created',
    data: collection,
  });
});

export const addFollowUpNote = asyncHandler(async (req: Request, res: Response) => {
  const noteData = {
    ...req.body,
    collection_officer_id: req.user.id,
  };

  const note = await collectionService.addFollowUpNote(noteData);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Follow-up note added',
    data: note,
  });
});

export const getFollowUpNotes = asyncHandler(async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  const notes = await collectionService.getFollowUpNotes(parseInt(collectionId));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notes,
  });
});

export const updatePromiseToPayStatus = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { isKept } = req.body;

  await collectionService.updatePromiseToPayStatus(parseInt(noteId), isKept);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Promise-to-pay status updated',
  });
});
