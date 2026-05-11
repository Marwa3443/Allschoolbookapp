import express from 'express';
import * as communityController from '../controllers/communityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', communityController.getAllPosts);
router.get('/search', communityController.searchPosts);
router.get('/:postId', communityController.getPostById);
router.get('/user/:userId', communityController.getUserPosts);

// Protected routes
router.post('/user/:userId', authenticateToken, communityController.createPost);
router.put('/:postId', authenticateToken, communityController.updatePost);
router.delete('/:postId', authenticateToken, communityController.deletePost);
router.post('/:postId/like', authenticateToken, communityController.likePost);
router.post('/:postId/unlike', authenticateToken, communityController.unlikePost);

export default router;
