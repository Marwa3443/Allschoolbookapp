import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findAll({
      order: [['requirement_value', 'ASC']],
    });

    sendSuccess(res, 'Achievements fetched successfully', achievements);
  } catch (error) {
    logger.error('Get achievements error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const { achievementId } = req.params;

    const achievement = await Achievement.findByPk(achievementId);
    if (!achievement) {
      return sendError(res, 'Achievement not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Achievement fetched successfully', achievement);
  } catch (error) {
    logger.error('Get achievement error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const achievements = await UserAchievement.findAll({
      where: { user_id: userId },
      include: [{ model: Achievement }],
      order: [['unlocked_at', 'DESC']],
    });

    sendSuccess(res, 'User achievements fetched successfully', achievements);
  } catch (error) {
    logger.error('Get user achievements error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const unlockAchievement = async (req, res) => {
  try {
    const { userId, achievementId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const achievement = await Achievement.findByPk(achievementId);
    if (!achievement) {
      return sendError(res, 'Achievement not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check if already unlocked
    const existing = await UserAchievement.findOne({
      where: { user_id: userId, achievement_id: achievementId },
    });

    if (existing) {
      return sendSuccess(res, 'Achievement already unlocked', existing);
    }

    const userAchievement = await UserAchievement.create({
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date(),
    });

    logger.info(`Achievement ${achievementId} unlocked for user ${userId}`);

    sendSuccess(res, 'Achievement unlocked successfully', userAchievement, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error('Unlock achievement error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const checkAndUnlockAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const achievements = await Achievement.findAll();
    const unlockedAchievements = [];

    for (const achievement of achievements) {
      // Get user progress count based on requirement type
      let count = 0;

      if (achievement.requirement_type === 'verses_memorized') {
        const result = await UserProgress.count({
          where: { user_id: userId, status: 'memorized' },
        });
        count = result;
      } else if (achievement.requirement_type === 'verses_learning') {
        const result = await UserProgress.count({
          where: { user_id: userId, status: 'learning' },
        });
        count = result;
      }

      // Check if requirement is met
      if (count >= achievement.requirement_value) {
        const existing = await UserAchievement.findOne({
          where: { user_id: userId, achievement_id: achievement.id },
        });

        if (!existing) {
          const userAchievement = await UserAchievement.create({
            user_id: userId,
            achievement_id: achievement.id,
            unlocked_at: new Date(),
          });
          unlockedAchievements.push(userAchievement);
          logger.info(`Auto-unlocked achievement ${achievement.id} for user ${userId}`);
        }
      }
    }

    sendSuccess(res, 'Achievement check completed', {
      newly_unlocked: unlockedAchievements,
      message: unlockedAchievements.length > 0 ? 'New achievements unlocked!' : 'No new achievements',
    });
  } catch (error) {
    logger.error('Check and unlock achievements error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getAchievementProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const achievements = await Achievement.findAll();
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: userId },
      attributes: ['achievement_id'],
      raw: true,
    });

    const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));

    const memorizedCount = await UserProgress.count({
      where: { user_id: userId, status: 'memorized' },
    });

    const learningCount = await UserProgress.count({
      where: { user_id: userId, status: 'learning' },
    });

    const progressData = achievements.map((achievement) => {
      let currentProgress = 0;

      if (achievement.requirement_type === 'verses_memorized') {
        currentProgress = memorizedCount;
      } else if (achievement.requirement_type === 'verses_learning') {
        currentProgress = learningCount;
      }

      const progress = Math.min(100, (currentProgress / achievement.requirement_value) * 100);

      return {
        achievement,
        unlocked: unlockedIds.has(achievement.id),
        current_progress: currentProgress,
        required: achievement.requirement_value,
        progress_percentage: Math.round(progress),
      };
    });

    sendSuccess(res, 'Achievement progress fetched', progressData);
  } catch (error) {
    logger.error('Get achievement progress error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
