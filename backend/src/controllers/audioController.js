import Reciter from '../models/Reciter.js';
import AudioFile from '../models/AudioFile.js';
import Surah from '../models/Surah.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

export const getAllReciters = async (req, res) => {
  try {
    const { sortBy = 'rating', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const validSortColumns = ['rating', 'popularity_score', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'rating';

    const { count, rows: reciters } = await Reciter.findAndCountAll({
      where: { verified: true },
      order: [[sortColumn, 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Reciters fetched successfully', {
      reciters,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get reciters error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getReciterById = async (req, res) => {
  try {
    const { reciterId } = req.params;

    const reciter = await Reciter.findByPk(reciterId, {
      include: [
        {
          model: AudioFile,
          include: [{ model: Surah, attributes: ['id', 'arabic_name', 'english_name'] }],
          attributes: { exclude: ['reciter_id'] },
        },
      ],
    });

    if (!reciter) {
      return sendError(res, 'Reciter not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Reciter fetched successfully', reciter);
  } catch (error) {
    logger.error('Get reciter error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getReciterAudio = async (req, res) => {
  try {
    const { reciterId } = req.params;
    const { surahId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const reciter = await Reciter.findByPk(reciterId);
    if (!reciter) {
      return sendError(res, 'Reciter not found', HTTP_STATUS.NOT_FOUND);
    }

    const where = { reciter_id: reciterId };
    if (surahId) where.surah_id = surahId;

    const { count, rows: audioFiles } = await AudioFile.findAndCountAll({
      where,
      include: [{ model: Surah, attributes: { exclude: ['id', 'created_at', 'updated_at'] } }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    sendSuccess(res, 'Reciter audio files fetched', {
      reciter,
      audioFiles,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get reciter audio error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getAudioFile = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audioFile = await AudioFile.findByPk(audioId, {
      include: [
        { model: Reciter, attributes: { exclude: ['id', 'created_at', 'updated_at'] } },
        { model: Surah, attributes: { exclude: ['id', 'created_at', 'updated_at'] } },
      ],
    });

    if (!audioFile) {
      return sendError(res, 'Audio file not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Audio file fetched successfully', audioFile);
  } catch (error) {
    logger.error('Get audio file error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getSurahAudio = async (req, res) => {
  try {
    const { surahId } = req.params;

    const surah = await Surah.findByPk(surahId);
    if (!surah) {
      return sendError(res, 'Surah not found', HTTP_STATUS.NOT_FOUND);
    }

    const audioFiles = await AudioFile.findAll({
      where: { surah_id: surahId },
      include: [{ model: Reciter, attributes: { exclude: ['id', 'created_at', 'updated_at'] } }],
      order: [['created_at', 'DESC']],
    });

    sendSuccess(res, 'Surah audio files fetched', { surah, audioFiles });
  } catch (error) {
    logger.error('Get surah audio error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const searchReciters = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
    }

    const searchTerm = `%${q}%`;
    const reciters = await Reciter.findAll({
      where: {
        verified: true,
        [Op.or]: [
          { arabic_name: { [Op.iLike]: searchTerm } },
          { english_name: { [Op.iLike]: searchTerm } },
        ],
      },
      order: [['rating', 'DESC']],
    });

    sendSuccess(res, 'Reciter search results', reciters);
  } catch (error) {
    logger.error('Search reciters error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const rateReciter = async (req, res) => {
  try {
    const { reciterId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST);
    }

    const reciter = await Reciter.findByPk(reciterId);
    if (!reciter) {
      return sendError(res, 'Reciter not found', HTTP_STATUS.NOT_FOUND);
    }

    // Simple averaging (in production, use weighted average or separate ratings table)
    const newRating = (reciter.rating + rating) / 2;
    await reciter.update({ rating: newRating });

    sendSuccess(res, 'Rating submitted successfully', { rating: newRating });
  } catch (error) {
    logger.error('Rate reciter error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
