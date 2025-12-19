/**
 * AGM Store Builder - Environment Configuration
 * Centralized environment variable management
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Configuration interface
 */
export interface Config {
  // App
  env: string;
  nodeEnv: string;
  port: number;
  apiVersion: string;
  appUrl: string;
  frontendUrl: string;
  storeBaseUrl: string;
  allowedOrigins: string[];
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;

  // Database
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    connectionLimit: number;
  };

  // JWT
  jwt: {
    secret: string;
    accessExpiry: string;
    refreshExpiry: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };

  // Monnify
  monnify: {
    baseUrl: string;
    apiKey: string;
    secretKey: string;
    contractCode: string;
    webhookSecret: string;
  };

  // Cloudinary
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder: string;
  };

  // SendGrid
  sendgrid: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
    from: string;
  };

  // Termii
  termii: {
    apiKey: string;
    senderId: string;
    baseUrl: string;
  };

  // Email (SMTP)
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    fromName: string;
    fromEmail: string;
  };

  // SMS
  sms: {
    provider: string;
    apiKey: string;
    senderId: string;
  };

  // Upload
  upload: {
    maxFileSize: number;
  };

  // Security
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;

  // AGM Settings
  agmFeePercentage: number;
  maxFileSize: number;
  allowedImageTypes: string[];
  otpExpiryMinutes: number;
  paymentExpiryMinutes: number;
}

/**
 * Parse DATABASE_URL if provided (Railway format)
 */
function parseDatabaseUrl(url?: string) {
  if (!url) {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || 'agm_store_builder',
    };
  }

  // Parse mysql://user:password@host:port/database
  const regex = /mysql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)/;
  const match = url.match(regex);

  if (match) {
    return {
      host: match[3] || 'localhost',
      port: parseInt(match[4] || '3306', 10),
      user: match[1] || 'root',
      password: match[2] || '',
      name: match[5] || 'agm_store_builder',
    };
  }

  throw new Error('Invalid DATABASE_URL format');
}

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate on load
validateEnv();

const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Export configuration object
 */
export const config: Config = {
  // App
  env: nodeEnv,
  nodeEnv: nodeEnv,
  port: parseInt(process.env.PORT || '5000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  storeBaseUrl: process.env.STORE_BASE_URL || 'http://localhost:3000',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',

  // Database
  database: {
    ...parseDatabaseUrl(process.env.DATABASE_URL),
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Monnify
  monnify: {
    baseUrl: process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com',
    apiKey: process.env.MONNIFY_API_KEY || '',
    secretKey: process.env.MONNIFY_SECRET_KEY || '',
    contractCode: process.env.MONNIFY_CONTRACT_CODE || '',
    webhookSecret: process.env.MONNIFY_WEBHOOK_SECRET || '',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'agm-store-builder',
  },

  // SendGrid
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@shopwithagm.com',
    fromName: process.env.SENDGRID_FROM_NAME || process.env.EMAIL_FROM_NAME || 'AGM Store Builder',
    from: process.env.EMAIL_FROM || 'noreply@shopwithagm.com',
  },

  // Termii
  termii: {
    apiKey: process.env.TERMII_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || 'AGM Store',
    baseUrl: process.env.TERMII_BASE_URL || 'https://api.ng.termii.com',
  },

  // Email (SMTP)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'AGM Store Builder',
    fromEmail: process.env.EMAIL_FROM || 'noreply@shopwithagm.com',
  },

  // SMS
  sms: {
    provider: process.env.SMS_PROVIDER || 'termii',
    apiKey: process.env.TERMII_API_KEY || process.env.SMS_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || process.env.SMS_SENDER_ID || 'AGM',
  },

  // Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  },

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // AGM Settings
  agmFeePercentage: parseFloat(process.env.AGM_FEE_PERCENTAGE || '2.5'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(','),
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
  paymentExpiryMinutes: parseInt(process.env.PAYMENT_EXPIRY_MINUTES || '30', 10),
};

/**
 * Helper to check if running in production
 */
export const isProduction = () => config.env === 'production';

/**
 * Helper to check if running in development
 */
export const isDevelopment = () => config.env === 'development';

/**
 * Helper to check if running in test
 */
export const isTest = () => config.env === 'test';