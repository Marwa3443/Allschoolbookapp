import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', statisticsController.getLeaderboard);

// Protected routes
router.get('/:userId/daily', authenticateToken, statisticsController.getUserDailyStats);
router.get('/:userId/today', authenticateToken, statisticsController.getTodayStats);
router.get('/:userId/overall', authenticateToken, statisticsController.getOverallStats);
router.put('/:userId/daily', authenticateToken, statisticsController.updateDailyStats);

export default router;
