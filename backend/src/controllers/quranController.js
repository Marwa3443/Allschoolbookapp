import Surah from '../models/Surah.js';
import Verse from '../models/Verse.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

export const getAllSurahs = async (req, res) => {
  try {
    const surahs = await Surah.findAll({
      order: [['surah_order', 'ASC']],
    });

    sendSuccess(res, 'Surahs fetched successfully', surahs);
  } catch (error) {
    logger.error('Get surahs error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getSurahById = async (req, res) => {
  try {
    const { surahId } = req.params;

    const surah = await Surah.findByPk(surahId);
    if (!surah) {
      return sendError(res, 'Surah not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Surah fetched successfully', surah);
  } catch (error) {
    logger.error('Get surah error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getSurahVerses = async (req, res) => {
  try {
    const { surahId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const surah = await Surah.findByPk(surahId);
    if (!surah) {
      return sendError(res, 'Surah not found', HTTP_STATUS.NOT_FOUND);
    }

    const { count, rows: verses } = await Verse.findAndCountAll({
      where: { surah_id: surahId },
      order: [['verse_number', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Verses fetched successfully', {
      surah,
      verses,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get surah verses error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getVerseById = async (req, res) => {
  try {
    const { verseId } = req.params;

    const verse = await Verse.findByPk(verseId, {
      include: [{ model: Surah, attributes: { exclude: ['id', 'created_at', 'updated_at'] } }],
    });

    if (!verse) {
      return sendError(res, 'Verse not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Verse fetched successfully', verse);
  } catch (error) {
    logger.error('Get verse error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const searchVerses = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
    }

    const offset = (page - 1) * limit;
    const searchTerm = `%${q}%`;

    const { count, rows: verses } = await Verse.findAndCountAll({
      where: {
        [Op.or]: [
          { arabic_text: { [Op.iLike]: searchTerm } },
          { transliteration: { [Op.iLike]: searchTerm } },
        ],
      },
      include: [{ model: Surah, attributes: { exclude: ['id', 'created_at', 'updated_at'] } }],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Search results', {
      verses,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Search verses error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getRandomVerse = async (req, res) => {
  try {
    const count = await Verse.count();
    if (count === 0) {
      return sendError(res, 'No verses found', HTTP_STATUS.NOT_FOUND);
    }

    const randomOffset = Math.floor(Math.random() * count);
    const verse = await Verse.findOne({
      offset: randomOffset,
      include: [{ model: Surah, attributes: { exclude: ['id', 'created_at', 'updated_at'] } }],
    });

    sendSuccess(res, 'Random verse fetched', verse);
  } catch (error) {
    logger.error('Get random verse error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const searchSurahs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
    }

    const searchTerm = `%${q}%`;
    const surahs = await Surah.findAll({
      where: {
        [Op.or]: [
          { arabic_name: { [Op.iLike]: searchTerm } },
          { english_name: { [Op.iLike]: searchTerm } },
        ],
      },
      order: [['surah_order', 'ASC']],
    });

    sendSuccess(res, 'Surah search results', surahs);
  } catch (error) {
    logger.error('Search surahs error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
