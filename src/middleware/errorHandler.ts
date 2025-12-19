/**
 * AGM Store Builder - Error Handler Middleware
 * Centralized error handling
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error creators
 */
export const errors = {
  badRequest: (message: string, details?: any) => 
    new AppError(400, message, true, details),

  unauthorized: (message = 'Unauthorized access') => 
    new AppError(401, message),

  forbidden: (message = 'Access forbidden') => 
    new AppError(403, message),

  notFound: (resource = 'Resource') => 
    new AppError(404, `${resource} not found`),

  conflict: (message: string) => 
    new AppError(409, message),

  unprocessableEntity: (message: string, details?: any) => 
    new AppError(422, message, true, details),

  tooManyRequests: (message = 'Too many requests') => 
    new AppError(429, message),

  internalServer: (message = 'Internal server error') => 
    new AppError(500, message, false),

  externalService: (message = 'External service error') => 
    new AppError(502, message, false),

  notImplemented: (message = 'Feature not implemented') => 
    new AppError(501, message),
};

/**
 * Error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;
  let details: any = undefined;

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    details = err.details;
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }
  // Handle validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation error';
    isOperational = true;
    details = err.message;
  }

  // Log error
  if (!isOperational || statusCode >= 500) {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: (req as any).user?.id,
    });
  } else {
    logger.warn('Operational error', {
      error: err.message,
      url: req.url,
      method: req.method,
      statusCode,
    });
  }

  // Send error response
  const response: any = {
    success: false,
    message,
    statusCode,
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
    if (details) {
      response.details = details;
    }
  } else if (details && isOperational) {
    // Include details for operational errors in production
    response.details = details;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    statusCode: 404,
  });
};

/**
 * Async handler wrapper
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};