import User from '../models/User.js';
import UserSettings from '../models/UserSettings.js';
import UserAchievement from '../models/UserAchievement.js';
import Achievement from '../models/Achievement.js';
import UserProgress from '../models/UserProgress.js';
import DailyStatistics from '../models/DailyStatistics.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: UserSettings, attributes: { exclude: ['user_id', 'id'] } },
      ],
    });

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'User profile fetched', user);
  } catch (error) {
    logger.error('Get user profile error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, avatar_url, birth_date, country, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (full_name) user.full_name = full_name;
    if (avatar_url) user.avatar_url = avatar_url;
    if (birth_date) user.birth_date = birth_date;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();
    logger.info(`User profile updated: ${user.email}`);

    sendSuccess(res, 'Profile updated successfully', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      birth_date: user.birth_date,
      country: user.country,
      phone: user.phone,
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await UserSettings.findOne({ where: { user_id: userId } });
    if (!settings) {
      return sendError(res, 'Settings not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'User settings fetched', settings);
  } catch (error) {
    logger.error('Get user settings error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dark_mode, font_size, notifications_enabled, email_notifications, daily_reminder_time, language } = req.body;

    const settings = await UserSettings.findOne({ where: { user_id: userId } });
    if (!settings) {
      return sendError(res, 'Settings not found', HTTP_STATUS.NOT_FOUND);
    }

    if (dark_mode !== undefined) settings.dark_mode = dark_mode;
    if (font_size) settings.font_size = font_size;
    if (notifications_enabled !== undefined) settings.notifications_enabled = notifications_enabled;
    if (email_notifications !== undefined) settings.email_notifications = email_notifications;
    if (daily_reminder_time) settings.daily_reminder_time = daily_reminder_time;
    if (language) settings.language = language;

    await settings.save();
    logger.info(`User settings updated: ${userId}`);

    sendSuccess(res, 'Settings updated successfully', settings);
  } catch (error) {
    logger.error('Update user settings error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    const achievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [{ model: Achievement, attributes: { exclude: ['id'] } }],
      attributes: { exclude: ['id', 'user_id'] },
    });

    sendSuccess(res, 'User achievements fetched', achievements);
  } catch (error) {
    logger.error('Get user achievements error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalProgress = await UserProgress.findAll({
      where: { user_id: userId },
      attributes: ['status'],
    });

    const memorized = totalProgress.filter(p => p.status === 'memorized').length;
    const learning = totalProgress.filter(p => p.status === 'learning').length;

    const today = new Date().toISOString().split('T')[0];
    const todayStats = await DailyStatistics.findOne({
      where: { user_id: userId, date: today },
    });

    const allStats = await DailyStatistics.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
      limit: 30, // Last 30 days
    });

    sendSuccess(res, 'User statistics fetched', {
      total_verses_memorized: memorized,
      total_verses_learning: learning,
      today_statistics: todayStats,
      last_30_days: allStats,
    });
  } catch (error) {
    logger.error('Get user statistics error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // In production, verify password before deleting
    // const isPasswordValid = await verifyPassword(password, user.password_hash);
    // if (!isPasswordValid) return sendError(res, 'Invalid password', HTTP_STATUS.UNAUTHORIZED);

    await user.destroy();
    logger.info(`User account deleted: ${user.email}`);

    sendSuccess(res, 'Account deleted successfully');
  } catch (error) {
    logger.error('Delete account error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
