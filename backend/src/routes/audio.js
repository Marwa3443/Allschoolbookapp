import express from 'express';
import * as audioController from '../controllers/audioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Reciter endpoints
router.get('/reciters', audioController.getAllReciters);
router.get('/reciters/search', audioController.searchReciters);
router.get('/reciters/:reciterId', audioController.getReciterById);
router.get('/reciters/:reciterId/audio', audioController.getReciterAudio);
router.post('/reciters/:reciterId/rate', authenticateToken, audioController.rateReciter);

// Audio file endpoints
router.get('/files/:audioId', audioController.getAudioFile);

// Surah audio
router.get('/surahs/:surahId/audio', audioController.getSurahAudio);

export default router;
