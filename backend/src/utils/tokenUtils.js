import jwt from 'jsonwebtoken';
import logger from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '90d';

export const generateAccessToken = (userId, email, tier) => {
  try {
    const token = jwt.sign(
      {
        sub: userId,
        email,
        tier,
        type: 'access',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
    return token;
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw error;
  }
};

export const generateRefreshToken = (userId) => {
  try {
    const token = jwt.sign(
      {
        sub: userId,
        type: 'refresh',
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRE }
    );
    return token;
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw error;
  }
};

export const generateTokenPair = (userId, email, tier) => {
  const accessToken = generateAccessToken(userId, email, tier);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.error('Error verifying access token:', error.message);
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    logger.error('Error verifying refresh token:', error.message);
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};
