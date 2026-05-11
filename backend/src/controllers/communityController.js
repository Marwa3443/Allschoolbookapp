import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

export const getAllPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, sortBy = 'newest' } = req.query;

    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const validSortColumns = {
      newest: [['created_at', 'DESC']],
      oldest: [['created_at', 'ASC']],
      popular: [['likes_count', 'DESC']],
      trending: [['created_at', 'DESC']],
    };

    const order = validSortColumns[sortBy] || validSortColumns.newest;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Posts fetched successfully', {
      posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get posts error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findByPk(postId, {
      include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }],
    });

    if (!post) {
      return sendError(res, 'Post not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Post fetched successfully', post);
  } catch (error) {
    logger.error('Get post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const offset = (page - 1) * limit;
    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'User posts fetched successfully', {
      user,
      posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get user posts error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content, category } = req.body;

    if (!title || !content) {
      return sendError(res, 'Title and content are required', HTTP_STATUS.BAD_REQUEST);
    }

    if (title.length < 5 || title.length > 200) {
      return sendError(res, 'Title must be between 5 and 200 characters', HTTP_STATUS.BAD_REQUEST);
    }

    if (content.length < 10 || content.length > 5000) {
      return sendError(res, 'Content must be between 10 and 5000 characters', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const post = await CommunityPost.create({
      user_id: userId,
      title,
      content,
      category: category || 'general',
      likes_count: 0,
      comments_count: 0,
    });

    logger.info(`Post created by user ${userId}: ${post.id}`);

    const postWithUser = await post.reload({ include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }] });
    sendSuccess(res, 'Post created successfully', postWithUser, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error('Create post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, category } = req.body;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return sendError(res, 'Post not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization (only post creator can edit)
    if (post.user_id !== req.user.id) {
      return sendError(res, 'Unauthorized', HTTP_STATUS.FORBIDDEN);
    }

    if (title) {
      if (title.length < 5 || title.length > 200) {
        return sendError(res, 'Title must be between 5 and 200 characters', HTTP_STATUS.BAD_REQUEST);
      }
      post.title = title;
    }

    if (content) {
      if (content.length < 10 || content.length > 5000) {
        return sendError(res, 'Content must be between 10 and 5000 characters', HTTP_STATUS.BAD_REQUEST);
      }
      post.content = content;
    }

    if (category) post.category = category;

    await post.save();
    logger.info(`Post updated: ${post.id}`);

    const updatedPost = await post.reload({ include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }] });
    sendSuccess(res, 'Post updated successfully', updatedPost);
  } catch (error) {
    logger.error('Update post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return sendError(res, 'Post not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    if (post.user_id !== req.user.id) {
      return sendError(res, 'Unauthorized', HTTP_STATUS.FORBIDDEN);
    }

    await post.destroy();
    logger.info(`Post deleted: ${post.id}`);

    sendSuccess(res, 'Post deleted successfully');
  } catch (error) {
    logger.error('Delete post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return sendError(res, 'Post not found', HTTP_STATUS.NOT_FOUND);
    }

    await post.increment('likes_count');
    await post.reload();

    sendSuccess(res, 'Post liked', { likes_count: post.likes_count });
  } catch (error) {
    logger.error('Like post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return sendError(res, 'Post not found', HTTP_STATUS.NOT_FOUND);
    }

    if (post.likes_count > 0) {
      await post.decrement('likes_count');
      await post.reload();
    }

    sendSuccess(res, 'Post unliked', { likes_count: post.likes_count });
  } catch (error) {
    logger.error('Unlike post error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
    }

    const searchTerm = `%${q}%`;
    const offset = (page - 1) * limit;

    const { count, rows: posts } = await CommunityPost.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { content: { [Op.iLike]: searchTerm } },
        ],
      },
      include: [{ model: User, attributes: ['id', 'full_name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Search results', {
      posts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Search posts error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
