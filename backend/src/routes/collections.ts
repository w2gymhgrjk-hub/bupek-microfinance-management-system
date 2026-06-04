import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as collectionController from '../controllers/collectionController';

const router = Router();

router.use(authenticateToken);

router.post('/identify-overdue', collectionController.identifyOverdueLoans);
router.get('/overdue-loans', collectionController.getOverdueLoans);
router.post('/create', collectionController.createCollection);
router.post('/:collectionId/follow-up-notes', collectionController.addFollowUpNote);
router.get('/:collectionId/follow-up-notes', collectionController.getFollowUpNotes);
router.put('/follow-up-notes/:noteId/promise-status', collectionController.updatePromiseToPayStatus);

export default router;
