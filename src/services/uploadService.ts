/**
 * AGM Store Builder - Upload Service
 * Image upload to Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import { errors } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

/**
 * Upload single image
 */
export async function uploadImage(
  file: Express.Multer.File,
  userId: string
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `agm-store/${userId}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error: any) {
    logger.error('Image upload failed', error);
    throw errors.internalServer('Failed to upload image');
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: Express.Multer.File[],
  userId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, userId));
  return await Promise.all(uploadPromises);
}

/**
 * Delete image
 */
export async function deleteImage(publicIdOrUrl: string): Promise<void> {
  try {
    let publicId = publicIdOrUrl;

    // Extract public_id from URL if full URL is provided
    if (publicIdOrUrl.includes('cloudinary.com')) {
      const matches = publicIdOrUrl.match(/\/v\d+\/(.+)\.\w+$/);
      if (matches && matches[1]) {
        publicId = matches[1];
      }
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    logger.error('Image deletion failed', error);
    throw errors.internalServer('Failed to delete image');
  }
}

/**
 * Get image details
 */
export async function getImageDetails(publicId: string): Promise<any> {
  try {
    return await cloudinary.api.resource(publicId);
  } catch (error: any) {
    logger.error('Failed to get image details', error);
    throw errors.notFound('Image');
  }
}