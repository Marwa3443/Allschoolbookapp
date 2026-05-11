import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return sendError(
        res,
        'Email, password, and full name are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await authService.registerUser({ email, password, full_name });
    sendSuccess(res, 'User registered successfully', result, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error('Register controller error:', error);

    if (error.message.includes(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)) {
      return sendError(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    if (error.message.includes('Invalid email') || error.message.includes('6 characters')) {
      return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }

    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(
        res,
        'Email and password are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await authService.loginUser(email, password);
    sendSuccess(res, 'Login successful', result, HTTP_STATUS.OK);
  } catch (error) {
    logger.error('Login controller error:', error);

    if (error.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
      return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(
        res,
        'Refresh token is required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.sub);

      if (!user) {
        return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
        user.id,
        user.email,
        user.tier
      );

      sendSuccess(res, 'Token refreshed', { accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      return sendError(res, ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }
  } catch (error) {
    logger.error('Refresh token controller error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    sendSuccess(res, 'User fetched successfully', user);
  } catch (error) {
    logger.error('Get current user error:', error);

    if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user.id, req.body);
    sendSuccess(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    logger.error('Update profile error:', error);

    if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return sendError(
        res,
        'Old password and new password are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
    sendSuccess(res, 'Password changed successfully', result);
  } catch (error) {
    logger.error('Change password error:', error);

    if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (error.message.includes('incorrect') || error.message.includes('characters')) {
      return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }

    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const logout = async (req, res) => {
  try {
    // في تطبيق حقيقي، قد تحتاج إلى حذف refresh token من قاعدة البيانات
    // أو إضافته إلى blacklist
    sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
