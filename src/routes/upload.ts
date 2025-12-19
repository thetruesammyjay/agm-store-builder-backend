/**
 * AGM Store Builder - Upload Routes
 * File upload endpoints
 */

import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { uploadSingle, uploadMultiple, validateUpload } from '../middleware/upload';
import { uploadRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /upload/image
 * Upload single image (protected)
 */
router.post(
  '/image',
  authenticate,
  uploadRateLimiter,
  uploadSingle('image'),
  validateUpload,
  uploadController.uploadImage
);

/**
 * POST /upload/images
 * Upload multiple images (protected)
 */
router.post(
  '/images',
  authenticate,
  uploadRateLimiter,
  uploadMultiple('images', 5),
  validateUpload,
  uploadController.uploadMultipleImages
);

/**
 * DELETE /upload/image
 * Delete image from Cloudinary (protected)
 */
router.delete(
  '/image',
  authenticate,
  uploadRateLimiter,
  uploadController.deleteImage
);

export default router;