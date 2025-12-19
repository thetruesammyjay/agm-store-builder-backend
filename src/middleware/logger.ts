import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Logger middleware to log request and response details
 */
export const logRequests = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request details
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);

  // Listen for the response to log when it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};