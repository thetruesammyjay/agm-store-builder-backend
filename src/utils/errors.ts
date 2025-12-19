/**
 * AGM Store Builder - Custom Error Classes
 * Structured error handling
 */

import { HTTP_STATUS, ERROR_CODES } from './constants';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      message
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      message
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      message
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
      `${resource} not found`
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.CONFLICT,
      message
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message
    );
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      message
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database error') {
    super(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.DATABASE_ERROR,
      message
    );
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.PAYMENT_ERROR,
      message
    );
  }
}

export class UploadError extends AppError {
  constructor(message: string) {
    super(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.UPLOAD_ERROR,
      message
    );
  }
}