import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import 'express-async-errors';

import sequelize from './config/database.js';
import logger from './utils/logger.js';
import { sendError } from './utils/responseHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from './config/constants.js';

// Import Routes
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));

app.use(express.json({ limit: process.env.MAX_UPLOAD_SIZE || '100mb' }));
app.use(express.urlencoded({ limit: process.env.MAX_UPLOAD_SIZE || '100mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/quran', quranRoutes);
// app.use('/api/audio', audioRoutes);
// etc.

// 404 Handler
app.use((req, res) => {
  sendError(res, 'الـ Endpoint المطلوب غير موجود', HTTP_STATUS.NOT_FOUND);
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  sendError(res, message, statusCode, err.details);
});

// Database Sync and Server Start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('✓ Database connection successful');

    // Sync models with database
    await sequelize.sync({ alter: false });
    logger.info('✓ Database synced');

    // Start server
    app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`);
      logger.info(`✓ API Health: http://localhost:${PORT}/api/health`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

export default app;
