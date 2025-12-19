/**
 * AGM Store Builder - Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

import app from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = config.port || 4000;

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('✅ Database connected successfully');

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(` Server running on port ${PORT}`);
      logger.info(` Environment: ${config.nodeEnv}`);
      logger.info(` API Base URL: http://localhost:${PORT}/api/${config.apiVersion}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Close server
      server.close(async () => {
        logger.info(' HTTP server closed');

        // Close database connection
        await disconnectDatabase();
        logger.info(' Database connection closed');

        logger.info(' Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('  Forceful shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error(' Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      logger.error(' Unhandled Rejection:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  } catch (error) {
    logger.error(' Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
