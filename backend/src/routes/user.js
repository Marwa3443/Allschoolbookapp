import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all require authentication
router.get('/:userId', authenticateToken, userController.getUserProfile);
router.put('/:userId', authenticateToken, userController.updateUserProfile);
router.delete('/:userId', authenticateToken, userController.deleteUserAccount);

// User settings
router.get('/:userId/settings', authenticateToken, userController.getUserSettings);
router.put('/:userId/settings', authenticateToken, userController.updateUserSettings);

// User achievements
router.get('/:userId/achievements', authenticateToken, userController.getUserAchievements);

// User statistics
router.get('/:userId/statistics', authenticateToken, userController.getUserStatistics);

export default router;
