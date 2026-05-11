import express from 'express';
import * as progressController from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All progress routes require authentication
router.get('/:userId', authenticateToken, progressController.getUserProgress);
router.get('/:userId/stats', authenticateToken, progressController.getProgressStats);
router.get('/:userId/verse/:verseId', authenticateToken, progressController.getProgressByVerse);
router.post('/:userId/verse/:verseId', authenticateToken, progressController.updateProgress);
router.delete('/:userId/verse/:verseId', authenticateToken, progressController.deleteProgress);

export default router;
