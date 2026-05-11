import express from 'express';
import multer from 'multer';
import path from 'path';
import * as recordingController from '../controllers/recordingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/recordings/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'recording-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp3'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Protected routes - all require authentication
router.get('/:userId', authenticateToken, recordingController.getUserRecordings);
router.get('/:userId/stats', authenticateToken, recordingController.getRecordingStats);
router.post('/:userId/upload', authenticateToken, upload.single('audio'), recordingController.uploadRecording);

router.get('/detail/:recordingId', authenticateToken, recordingController.getRecordingById);
router.post('/:recordingId/analyze', authenticateToken, recordingController.analyzeRecording);
router.put('/:recordingId', authenticateToken, recordingController.updateRecording);
router.delete('/:recordingId', authenticateToken, recordingController.deleteRecording);

export default router;
