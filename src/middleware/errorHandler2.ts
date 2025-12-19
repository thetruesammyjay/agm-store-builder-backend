/**
 * AGM Store Builder - Global Error Handler
 * Handles all errors and returns consistent error responses
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/env';

/**
 * Custom Error Class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
    stack?: string;
  };
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let code: string | undefined;
  let details: any;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Handle validation errors (Joi)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = (err as any).details;
  }

  // Handle MySQL errors
  if ((err as any).code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_ENTRY';
  }

  if ((err as any).code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced resource not found';
    code = 'FOREIGN_KEY_ERROR';
  }

  if ((err as any).code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection failed';
    code = 'DATABASE_ERROR';
  }

  // Handle multer errors (file upload)
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
    code = 'UPLOAD_ERROR';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn('Client Error:', {
      message,
      code,
      path: req.path,
      method: req.method,
    });
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details }),
      // Include stack trace only in development
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error handler
 */
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    404,
    true,
    'NOT_FOUND'
  );
  next(error);
};

/**
 * Common error creators
 */
export const errors = {
  badRequest: (message: string, details?: any) => 
    new AppError(message, 400, true, 'BAD_REQUEST', details),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new AppError(message, 401, true, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    new AppError(message, 403, true, 'FORBIDDEN'),
  
  notFound: (resource: string = 'Resource') => 
    new AppError(`${resource} not found`, 404, true, 'NOT_FOUND'),
  
  conflict: (message: string) => 
    new AppError(message, 409, true, 'CONFLICT'),
  
  unprocessable: (message: string, details?: any) => 
    new AppError(message, 422, true, 'UNPROCESSABLE_ENTITY', details),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new AppError(message, 429, true, 'TOO_MANY_REQUESTS'),
  
  internal: (message: string = 'Internal server error') => 
    new AppError(message, 500, false, 'INTERNAL_ERROR'),
  
  serviceUnavailable: (message: string = 'Service unavailable') => 
    new AppError(message, 503, false, 'SERVICE_UNAVAILABLE'),
};