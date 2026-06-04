/**
 * Server entry point
 */

import app from './app';
import { checkConnection, closePool } from './config/database';
import logger from './config/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000');
const NODE_ENV = process.env.NODE_ENV || 'development';

let server: any;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Check database connection
    logger.info('[Server] Checking database connection...');
    const dbConnected = await checkConnection();

    if (!dbConnected) {
      logger.error('[Server] Failed to connect to database');
      process.exit(1);
    }

    // Start Express server
    server = app.listen(PORT, () => {
      logger.info('[Server] Server started', {
        port: PORT,
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
      });

      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 BUPEK Microfinance Management System`);
      console.log(`${'='.repeat(60)}`);
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${NODE_ENV}`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    logger.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
const gracefulShutdown = async () => {
  logger.info('[Server] Received shutdown signal, closing gracefully...');

  if (server) {
    server.close(async () => {
      logger.info('[Server] Server closed');
      await closePool();
      logger.info('[Server] Database pool closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('[Server] Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  }
};

// Handle signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('[Server] Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('[Server] Unhandled rejection:', {
    reason,
    promise,
  });
  process.exit(1);
});

// Start the server
startServer();

export default server;
