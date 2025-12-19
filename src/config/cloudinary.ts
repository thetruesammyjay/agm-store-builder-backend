/**
 * AGM Store Builder - Cloudinary Configuration
 * Cloudinary image upload configuration
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from './env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const cloudinaryConfig = {
  cloudName: config.cloudinary.cloudName,
  apiKey: config.cloudinary.apiKey,
  apiSecret: config.cloudinary.apiSecret,

  // Upload presets
  folders: {
    users: 'agm-store/users',
    stores: 'agm-store/stores',
    products: 'agm-store/products',
    temp: 'agm-store/temp',
  },

  // Transformation presets
  transformations: {
    avatar: {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto:good',
      fetch_format: 'auto',
    },
    storeLogo: {
      width: 400,
      height: 400,
      crop: 'limit',
      quality: 'auto:good',
      fetch_format: 'auto',
    },
    productImage: {
      width: 1200,
      height: 1200,
      crop: 'limit',
      quality: 'auto:good',
      fetch_format: 'auto',
    },
    productThumbnail: {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto',
    },
  },

  // File restrictions
  maxFileSize: config.upload.maxFileSize,
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
};

/**
 * Get upload folder path
 */
export function getUploadFolder(type: keyof typeof cloudinaryConfig.folders, userId?: string): string {
  const baseFolder = cloudinaryConfig.folders[type];
  return userId ? `${baseFolder}/${userId}` : baseFolder;
}

/**
 * Validate Cloudinary configuration
 */
export function validateCloudinaryConfig(): boolean {
  return !!(
    cloudinaryConfig.cloudName &&
    cloudinaryConfig.apiKey &&
    cloudinaryConfig.apiSecret
  );
}

// Export configured cloudinary instance
export { cloudinary };