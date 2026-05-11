import express from 'express';
import * as quranController from '../controllers/quranController.js';

const router = express.Router();

// Surah endpoints
router.get('/surahs', quranController.getAllSurahs);
router.get('/surahs/search', quranController.searchSurahs);
router.get('/surahs/:surahId', quranController.getSurahById);
router.get('/surahs/:surahId/verses', quranController.getSurahVerses);

// Verse endpoints
router.get('/verses/:verseId', quranController.getVerseById);
router.get('/verses/search', quranController.searchVerses);

// Random verse
router.get('/random-verse', quranController.getRandomVerse);

export default router;
