/**
 * Express application setup and configuration
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv';

import { morganMiddleware, requestLogger } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { optionalAuth } from './middleware/auth';
import routes from './routes';
import logger from './config/logger';

dotenv.config();

const app: Express = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// REQUEST PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(compression());

// ============================================
// LOGGING MIDDLEWARE
// ============================================

app.use(morganMiddleware);
app.use(requestLogger);

// ============================================
// OPTIONAL AUTHENTICATION MIDDLEWARE
// ============================================

app.use(optionalAuth);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ============================================
// VERSION ENDPOINT
// ============================================

app.get('/api/version', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    version: '1.0.0',
    name: 'BUPEK Microfinance Management System',
    api_version: 'v1',
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api', routes);

// ============================================
// 404 HANDLER
// ============================================

app.use(notFoundHandler);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

export default app;
