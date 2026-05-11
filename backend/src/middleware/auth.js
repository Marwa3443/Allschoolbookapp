import { verifyAccessToken } from '../utils/tokenUtils.js';
import { sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendError(
        res,
        'No token provided',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        tier: decoded.tier,
      };
      next();
    } catch (error) {
      if (error.message.includes('expired')) {
        return sendError(
          res,
          ERROR_MESSAGES.TOKEN_EXPIRED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      return sendError(
        res,
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return sendError(
      res,
      ERROR_MESSAGES.SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          tier: decoded.tier,
        };
      } catch (error) {
        // Token is invalid, but we don't fail - just continue as anonymous
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

export const requirePremium = (req, res, next) => {
  if (!req.user || req.user.tier !== 'premium') {
    return sendError(
      res,
      'Premium membership required',
      HTTP_STATUS.FORBIDDEN
    );
  }
  next();
};
