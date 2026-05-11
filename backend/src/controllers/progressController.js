import UserProgress from '../models/UserProgress.js';
import Verse from '../models/Verse.js';
import User from '../models/User.js';
import DailyStatistics from '../models/DailyStatistics.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const where = { user_id: userId };
    if (status && ['learning', 'memorized', 'revised'].includes(status)) {
      where.status = status;
    }

    const offset = (page - 1) * limit;
    const { count, rows: progress } = await UserProgress.findAndCountAll({
      where,
      include: [{ model: Verse, attributes: { exclude: ['created_at', 'updated_at'] } }],
      order: [['updated_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'User progress fetched', {
      progress,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get user progress error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getProgressByVerse = async (req, res) => {
  try {
    const { userId, verseId } = req.params;

    const progress = await UserProgress.findOne({
      where: { user_id: userId, verse_id: verseId },
      include: [{ model: Verse, attributes: { exclude: ['created_at', 'updated_at'] } }],
    });

    if (!progress) {
      return sendError(res, 'Progress not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Progress fetched', progress);
  } catch (error) {
    logger.error('Get progress by verse error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { userId, verseId } = req.params;
    const { status, accuracy_percentage, times_reviewed } = req.body;

    if (!status || !['learning', 'memorized', 'revised'].includes(status)) {
      return sendError(res, 'Invalid status', HTTP_STATUS.BAD_REQUEST);
    }

    if (accuracy_percentage !== undefined && (accuracy_percentage < 0 || accuracy_percentage > 100)) {
      return sendError(res, 'Accuracy percentage must be between 0 and 100', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const verse = await Verse.findByPk(verseId);
    if (!verse) {
      return sendError(res, 'Verse not found', HTTP_STATUS.NOT_FOUND);
    }

    let progress = await UserProgress.findOne({
      where: { user_id: userId, verse_id: verseId },
    });

    if (!progress) {
      progress = await UserProgress.create({
        user_id: userId,
        verse_id: verseId,
        status,
        accuracy_percentage: accuracy_percentage || 0,
        times_reviewed: times_reviewed || 1,
      });
    } else {
      await progress.update({
        status,
        accuracy_percentage: accuracy_percentage !== undefined ? accuracy_percentage : progress.accuracy_percentage,
        times_reviewed: times_reviewed !== undefined ? times_reviewed : progress.times_reviewed + 1,
      });
    }

    // Update daily statistics
    const today = new Date().toISOString().split('T')[0];
    let dailyStats = await DailyStatistics.findOne({
      where: { user_id: userId, date: today },
    });

    if (!dailyStats) {
      dailyStats = await DailyStatistics.create({
        user_id: userId,
        date: today,
        verses_memorized: status === 'memorized' ? 1 : 0,
        study_minutes: 0,
        streak_count: 1,
      });
    } else if (status === 'memorized') {
      await dailyStats.increment('verses_memorized');
    }

    logger.info(`Progress updated for user ${userId}, verse ${verseId}: ${status}`);

    sendSuccess(res, 'Progress updated successfully', {
      progress: await progress.reload({ include: [{ model: Verse }] }),
      dailyStats,
    });
  } catch (error) {
    logger.error('Update progress error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { userId, verseId } = req.params;

    const progress = await UserProgress.findOne({
      where: { user_id: userId, verse_id: verseId },
    });

    if (!progress) {
      return sendError(res, 'Progress not found', HTTP_STATUS.NOT_FOUND);
    }

    await progress.destroy();
    logger.info(`Progress deleted for user ${userId}, verse ${verseId}`);

    sendSuccess(res, 'Progress deleted successfully');
  } catch (error) {
    logger.error('Delete progress error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getProgressStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const totalProgress = await UserProgress.findAll({
      where: { user_id: userId },
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const stats = {
      learning: 0,
      memorized: 0,
      revised: 0,
    };

    totalProgress.forEach((item) => {
      stats[item.status] = parseInt(item.count);
    });

    const averageAccuracy = await UserProgress.findOne({
      where: { user_id: userId },
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('accuracy_percentage')), 'avg_accuracy']],
      raw: true,
    });

    sendSuccess(res, 'Progress statistics fetched', {
      stats,
      average_accuracy: averageAccuracy?.avg_accuracy ? parseFloat(averageAccuracy.avg_accuracy).toFixed(2) : 0,
      total: stats.learning + stats.memorized + stats.revised,
    });
  } catch (error) {
    logger.error('Get progress stats error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
