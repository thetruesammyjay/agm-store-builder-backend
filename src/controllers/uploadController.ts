/**
 * AGM Store Builder - Upload Controller
 * HTTP request handlers for file uploads
 */

import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/uploadService';
import { asyncHandler } from '../middleware/errorHandler';
import { errors } from '../middleware/errorHandler';

/**
 * POST /upload/image
 * Upload single image
 */
export const uploadImage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    if (!req.file) {
      throw errors.badRequest('No file uploaded');
    }

    const result = await uploadService.uploadImage(req.file, req.user.id);

    res.json({
      success: true,
      data: result,
      message: 'Image uploaded successfully',
    });
  }
);

/**
 * POST /upload/images
 * Upload multiple images
 */
export const uploadMultipleImages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw errors.badRequest('No files uploaded');
    }

    const results = await uploadService.uploadMultipleImages(req.files, req.user.id);

    res.json({
      success: true,
      data: results,
      message: `${results.length} images uploaded successfully`,
    });
  }
);

/**
 * DELETE /upload/image
 * Delete image from Cloudinary
 */
export const deleteImage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const { public_id, url } = req.body;

    if (!public_id && !url) {
      throw errors.badRequest('public_id or url is required');
    }

    await uploadService.deleteImage(public_id || url);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  }
);