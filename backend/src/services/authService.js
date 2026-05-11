import User from '../models/User.js';
import UserSettings from '../models/UserSettings.js';
import { hashPassword, verifyPassword, validateEmail, validatePassword } from '../utils/hashUtils.js';
import { generateTokenPair } from '../utils/tokenUtils.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

export const registerUser = async (userData) => {
  try {
    const { email, password, full_name } = userData;

    // Validation
    if (!email || !password || !full_name) {
      throw new Error('Email, password, and full name are required');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password_hash,
      full_name,
    });

    // Create default settings for user
    await UserSettings.create({
      user_id: user.id,
    });

    logger.info(`New user registered: ${user.email}`);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.tier
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        tier: user.tier,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Update last login
    await user.update({ last_login: new Date() });

    logger.info(`User logged in: ${user.email}`);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.tier
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        tier: user.tier,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: UserSettings,
          attributes: { exclude: ['user_id', 'id'] },
        },
      ],
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  } catch (error) {
    logger.error('Get user error:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const allowedFields = ['full_name', 'avatar_url', 'birth_date', 'country', 'phone'];
    const updateData = {};

    for (const field of allowedFields) {
      if (userData[field] !== undefined) {
        updateData[field] = userData[field];
      }
    }

    await user.update(updateData);
    logger.info(`User profile updated: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      birth_date: user.birth_date,
      country: user.country,
      phone: user.phone,
    };
  } catch (error) {
    logger.error('Update profile error:', error);
    throw error;
  }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Verify old password
    const isPasswordValid = await verifyPassword(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    // Hash new password
    const password_hash = await hashPassword(newPassword);
    await user.update({ password_hash });

    logger.info(`Password changed for user: ${user.email}`);

    return { message: 'Password changed successfully' };
  } catch (error) {
    logger.error('Change password error:', error);
    throw error;
  }
};
