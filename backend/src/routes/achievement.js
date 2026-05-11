import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', achievementController.getAllAchievements);
router.get('/:achievementId', achievementController.getAchievementById);

// Protected routes
router.get('/:userId/achievements', authenticateToken, achievementController.getUserAchievements);
router.post('/:userId/unlock/:achievementId', authenticateToken, achievementController.unlockAchievement);
router.post('/:userId/check-and-unlock', authenticateToken, achievementController.checkAndUnlockAchievements);
router.get('/:userId/progress', authenticateToken, achievementController.getAchievementProgress);

export default router;
