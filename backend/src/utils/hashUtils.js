import bcrypt from 'bcryptjs';
import logger from './logger.js';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw error;
  }
};

export const verifyPassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    logger.error('Error verifying password:', error);
    throw error;
  }
};

export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters' };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
