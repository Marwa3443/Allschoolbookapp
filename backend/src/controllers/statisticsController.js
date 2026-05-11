import DailyStatistics from '../models/DailyStatistics.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

export const getUserDailyStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30, page = 1, limit = 30 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const startDateStr = startDate.toISOString().split('T')[0];

    const offset = (page - 1) * limit;
    const { count, rows: stats } = await DailyStatistics.findAndCountAll({
      where: {
        user_id: userId,
        date: { [Op.gte]: startDateStr },
      },
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Daily statistics fetched', {
      user_id: userId,
      stats,
      days: parseInt(days),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get user daily stats error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getTodayStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const today = new Date().toISOString().split('T')[0];
    let stats = await DailyStatistics.findOne({
      where: { user_id: userId, date: today },
    });

    if (!stats) {
      stats = await DailyStatistics.create({
        user_id: userId,
        date: today,
        verses_memorized: 0,
        study_minutes: 0,
        streak_count: 0,
      });
    }

    sendSuccess(res, "Today's statistics fetched", stats);
  } catch (error) {
    logger.error("Get today's stats error:", error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getOverallStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Total verses memorized
    const memorized = await UserProgress.count({
      where: { user_id: userId, status: 'memorized' },
    });

    // Total verses learning
    const learning = await UserProgress.count({
      where: { user_id: userId, status: 'learning' },
    });

    // Total verses revised
    const revised = await UserProgress.count({
      where: { user_id: userId, status: 'revised' },
    });

    // Total study time
    const dailyStats = await DailyStatistics.findAll({
      where: { user_id: userId },
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('study_minutes')), 'total_minutes'],
        [require('sequelize').fn('SUM', require('sequelize').col('verses_memorized')), 'total_verses'],
      ],
      raw: true,
    });

    const totalStudyMinutes = dailyStats[0]?.total_minutes || 0;
    const totalVersesFromStats = dailyStats[0]?.total_verses || 0;

    // Average accuracy
    const accuracy = await UserProgress.findOne({
      where: { user_id: userId },
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('accuracy_percentage')), 'avg_accuracy']],
      raw: true,
    });

    // Current streak
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await DailyStatistics.findOne({
      where: { user_id: userId, date: today },
    });

    const currentStreak = todayStats?.streak_count || 0;

    sendSuccess(res, 'Overall statistics fetched', {
      user_id: userId,
      verses_memorized: memorized,
      verses_learning: learning,
      verses_revised: revised,
      total_verses: memorized + learning + revised,
      total_study_minutes: Math.round(totalStudyMinutes),
      average_accuracy: accuracy?.avg_accuracy ? parseFloat(accuracy.avg_accuracy).toFixed(2) : 0,
      current_streak: currentStreak,
      membership_tier: user.tier,
      joined_date: user.created_at,
    });
  } catch (error) {
    logger.error('Get overall stats error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { metric = 'memorized', limit = 20 } = req.query;

    const validMetrics = ['memorized', 'study_minutes', 'posts'];
    if (!validMetrics.includes(metric)) {
      return sendError(res, 'Invalid metric', HTTP_STATUS.BAD_REQUEST);
    }

    let leaderboard = [];

    if (metric === 'memorized' || metric === 'study_minutes') {
      // Get users by verses memorized or study minutes
      const aggregateField = metric === 'memorized' ? 'COUNT(*)' : 'SUM(study_minutes)';

      leaderboard = await User.findAll({
        attributes: [
          'id',
          'full_name',
          'avatar_url',
          [require('sequelize').fn(metric === 'memorized' ? 'COUNT' : 'SUM',
            metric === 'memorized' ? require('sequelize').col('UserProgresses.id') : require('sequelize').col('DailyStatistics.study_minutes')),
            'score'],
        ],
        include: [
          {
            model: metric === 'memorized' ? UserProgress : DailyStatistics,
            where: metric === 'memorized' ? { status: 'memorized' } : {},
            attributes: [],
          },
        ],
        group: ['User.id'],
        order: [[require('sequelize').literal('score'), 'DESC']],
        limit: parseInt(limit),
        subQuery: false,
        raw: true,
      });
    } else if (metric === 'posts') {
      // Get users by community posts
      leaderboard = await User.findAll({
        attributes: [
          'id',
          'full_name',
          'avatar_url',
          [require('sequelize').fn('COUNT', require('sequelize').col('CommunityPosts.id')), 'score'],
        ],
        include: [
          {
            model: CommunityPost,
            attributes: [],
          },
        ],
        group: ['User.id'],
        order: [[require('sequelize').literal('score'), 'DESC']],
        limit: parseInt(limit),
        subQuery: false,
        raw: true,
      });
    }

    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      user_id: user.id,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      score: parseInt(user.score) || 0,
    }));

    sendSuccess(res, 'Leaderboard fetched', {
      metric,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    logger.error('Get leaderboard error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateDailyStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { study_minutes, streak_count } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const today = new Date().toISOString().split('T')[0];
    let stats = await DailyStatistics.findOne({
      where: { user_id: userId, date: today },
    });

    if (!stats) {
      stats = await DailyStatistics.create({
        user_id: userId,
        date: today,
        verses_memorized: 0,
        study_minutes: study_minutes || 0,
        streak_count: streak_count || 0,
      });
    } else {
      if (study_minutes !== undefined) {
        await stats.increment('study_minutes', { by: study_minutes });
      }
      if (streak_count !== undefined) {
        stats.streak_count = streak_count;
        await stats.save();
      }
    }

    await stats.reload();
    sendSuccess(res, 'Daily statistics updated', stats);
  } catch (error) {
    logger.error('Update daily stats error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
