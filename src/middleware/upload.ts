/**
 * AGM Store Builder - File Upload Middleware
 * Handles image uploads with Multer
 */

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { errors } from './errorHandler';

// File filter for image uploads
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = config.allowedImageTypes;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Configure multer for memory storage (we'll upload to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxFileSize, // Max file size from environment variable
  },
  fileFilter,
});

/**
 * Single file upload middleware
 */
export function uploadSingle(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            errors.badRequest(`File too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`)
          );
        }
        return next(errors.badRequest(`Upload error: ${err.message}`));
      }
      
      if (err) {
        return next(errors.badRequest(err.message));
      }
      
      next();
    });
  };
}

/**
 * Multiple file upload middleware
 */
export function uploadMultiple(fieldName: string, maxCount: number = 5) {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.array(fieldName, maxCount)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            errors.badRequest(`File too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`)
          );
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(
            errors.badRequest(`Too many files. Maximum is ${maxCount} files`)
          );
        }
        return next(errors.badRequest(`Upload error: ${err.message}`));
      }
      
      if (err) {
        return next(errors.badRequest(err.message));
      }
      
      next();
    });
  };
}

/**
 * Validate uploaded file
 */
export function validateUpload(req: Request, _res: Response, next: NextFunction): void {
  if (!req.file && !req.files) {
    return next(errors.badRequest('No file uploaded'));
  }

  next();
}

/**
 * Optional file upload (doesn't require file)
 */
export function optionalUpload(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            errors.badRequest(`File too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`)
          );
        }
        return next(errors.badRequest(`Upload error: ${err.message}`));
      }
      
      if (err) {
        return next(errors.badRequest(err.message));
      }
      
      // Continue even if no file was uploaded
      next();
    });
  };
}