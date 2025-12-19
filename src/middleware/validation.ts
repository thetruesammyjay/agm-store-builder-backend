/**
 * AGM Store Builder - Validation Middleware
 * Validates request body against Joi schemas
 */

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { errors } from './errorHandler';

/**
 * Validate request body against a Joi schema
 */
export function validateBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(
        errors.badRequest('Validation failed', details)
      );
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
}

/**
 * Validate request query parameters against a Joi schema
 */
export function validateQuery(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(
        errors.badRequest('Query validation failed', details)
      );
    }

    req.query = value;
    next();
  };
}

/**
 * Validate request params against a Joi schema
 */
export function validateParams(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(
        errors.badRequest('Params validation failed', details)
      );
    }

    req.params = value;
    next();
  };
}