import UserRecording from '../models/UserRecording.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getUserRecordings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const offset = (page - 1) * limit;
    const { count, rows: recordings } = await UserRecording.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['audio_analysis'] },
    });

    sendSuccess(res, 'User recordings fetched successfully', {
      recordings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Get user recordings error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getRecordingById = async (req, res) => {
  try {
    const { recordingId } = req.params;

    const recording = await UserRecording.findByPk(recordingId);
    if (!recording) {
      return sendError(res, 'Recording not found', HTTP_STATUS.NOT_FOUND);
    }

    sendSuccess(res, 'Recording fetched successfully', recording);
  } catch (error) {
    logger.error('Get recording error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const uploadRecording = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verses_range, notes } = req.body;

    if (!req.file) {
      return sendError(res, 'Audio file is required', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Validate file type
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return sendError(res, 'Invalid audio format. Supported: MP3, WAV, WebM, OGG', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return sendError(res, 'File size exceeds 50MB limit', HTTP_STATUS.BAD_REQUEST);
    }

    const recording = await UserRecording.create({
      user_id: userId,
      recording_url: `/uploads/recordings/${req.file.filename}`,
      duration_seconds: 0,
      verses_range: verses_range || null,
      notes: notes || null,
      audio_analysis: {},
    });

    logger.info(`Recording uploaded by user ${userId}: ${recording.id}`);

    sendSuccess(res, 'Recording uploaded successfully', recording, HTTP_STATUS.CREATED);
  } catch (error) {
    logger.error('Upload recording error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const analyzeRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const { tajweed_score, accuracy_score, feedback } = req.body;

    const recording = await UserRecording.findByPk(recordingId);
    if (!recording) {
      return sendError(res, 'Recording not found', HTTP_STATUS.NOT_FOUND);
    }

    // Validate scores
    if (tajweed_score && (tajweed_score < 0 || tajweed_score > 100)) {
      return sendError(res, 'Tajweed score must be between 0 and 100', HTTP_STATUS.BAD_REQUEST);
    }

    if (accuracy_score && (accuracy_score < 0 || accuracy_score > 100)) {
      return sendError(res, 'Accuracy score must be between 0 and 100', HTTP_STATUS.BAD_REQUEST);
    }

    // Update analysis
    const analysis = {
      tajweed_score: tajweed_score || 0,
      accuracy_score: accuracy_score || 0,
      feedback: feedback || '',
      analyzed_at: new Date(),
    };

    await recording.update({ audio_analysis: analysis });
    logger.info(`Recording analyzed: ${recordingId}`);

    sendSuccess(res, 'Recording analyzed successfully', {
      id: recording.id,
      analysis,
    });
  } catch (error) {
    logger.error('Analyze recording error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const { notes, verses_range } = req.body;

    const recording = await UserRecording.findByPk(recordingId);
    if (!recording) {
      return sendError(res, 'Recording not found', HTTP_STATUS.NOT_FOUND);
    }

    if (notes !== undefined) recording.notes = notes;
    if (verses_range !== undefined) recording.verses_range = verses_range;

    await recording.save();
    logger.info(`Recording updated: ${recordingId}`);

    sendSuccess(res, 'Recording updated successfully', recording);
  } catch (error) {
    logger.error('Update recording error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deleteRecording = async (req, res) => {
  try {
    const { recordingId } = req.params;

    const recording = await UserRecording.findByPk(recordingId);
    if (!recording) {
      return sendError(res, 'Recording not found', HTTP_STATUS.NOT_FOUND);
    }

    await recording.destroy();
    logger.info(`Recording deleted: ${recordingId}`);

    sendSuccess(res, 'Recording deleted successfully');
  } catch (error) {
    logger.error('Delete recording error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getRecordingStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const totalRecordings = await UserRecording.count({
      where: { user_id: userId },
    });

    const analyzedRecordings = await UserRecording.count({
      where: {
        user_id: userId,
        audio_analysis: { [require('sequelize').Sequelize.Op.ne]: {} },
      },
    });

    // Calculate average scores
    const recordings = await UserRecording.findAll({
      where: { user_id: userId },
      attributes: ['audio_analysis'],
    });

    let avgTajweed = 0;
    let avgAccuracy = 0;
    let scoredCount = 0;

    recordings.forEach((r) => {
      if (r.audio_analysis && r.audio_analysis.tajweed_score) {
        avgTajweed += r.audio_analysis.tajweed_score;
        avgAccuracy += r.audio_analysis.accuracy_score || 0;
        scoredCount++;
      }
    });

    if (scoredCount > 0) {
      avgTajweed = (avgTajweed / scoredCount).toFixed(2);
      avgAccuracy = (avgAccuracy / scoredCount).toFixed(2);
    }

    sendSuccess(res, 'Recording statistics fetched', {
      total_recordings: totalRecordings,
      analyzed_recordings: analyzedRecordings,
      average_tajweed_score: parseFloat(avgTajweed),
      average_accuracy_score: parseFloat(avgAccuracy),
    });
  } catch (error) {
    logger.error('Get recording stats error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
