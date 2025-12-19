/**
 * AGM Store Builder - Environment Configuration
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration interface
 */
interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
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
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  
  // URLs
  frontendUrl: string;
  storeBaseUrl: string;
  allowedOrigins: string[];
  
  // Services
  monnify: {
    apiKey: string;
    secretKey: string;
    contractCode: string;
    baseUrl: string;
    webhookSecret: string;
  };
  
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder: string;
  };
  
  sendgrid: {
    apiKey: string;
    from: string;
    fromName: string;
  };
  
  termii: {
    apiKey: string;
    senderId: string;
    baseUrl: string;
  };
  
  // Email Configuration (SMTP)
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    fromName: string;
    fromEmail: string;
  };
  
  // SMS Configuration
  sms: {
    provider: string;
    apiKey: string;
    senderId: string;
  };
  
  // Upload Configuration
  upload: {
    maxFileSize: number;
  };
  
  // Security
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // App
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
 * Configuration object
 */
export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  
  database: {
    ...parseDatabaseUrl(process.env.DATABASE_URL),
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  storeBaseUrl: process.env.STORE_BASE_URL || 'http://localhost:3000',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  
  monnify: {
    apiKey: process.env.MONNIFY_API_KEY || '',
    secretKey: process.env.MONNIFY_SECRET_KEY || '',
    contractCode: process.env.MONNIFY_CONTRACT_CODE || '',
    baseUrl: process.env.MONNIFY_BASE_URL || 'https://api.monnify.com',
    webhookSecret: process.env.MONNIFY_WEBHOOK_SECRET || '',
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'agm-store-builder',
  },
  
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    from: process.env.EMAIL_FROM || 'noreply@shopwithagm.com',
    fromName: process.env.EMAIL_FROM_NAME || 'AGM Store Builder',
  },
  
  termii: {
    apiKey: process.env.TERMII_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || 'AGM',
    baseUrl: process.env.TERMII_BASE_URL || 'https://api.ng.termii.com',
  },
  
  // Email Configuration (SMTP for nodemailer)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'AGM Store Builder',
    fromEmail: process.env.EMAIL_FROM || 'noreply@shopwithagm.com',
  },
  
  // SMS Configuration
  sms: {
    provider: process.env.SMS_PROVIDER || 'termii',
    apiKey: process.env.TERMII_API_KEY || process.env.SMS_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || process.env.SMS_SENDER_ID || 'AGM',
  },
  
  // Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  },
  
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  agmFeePercentage: parseFloat(process.env.AGM_FEE_PERCENTAGE || '0.01'), // 1%
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(','),
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
  paymentExpiryMinutes: parseInt(process.env.PAYMENT_EXPIRY_MINUTES || '30', 10),
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  const missing: string[] = [];
  
  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }
  
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    missing.push('DATABASE_URL or DB_HOST');
  }
  
  if (config.nodeEnv === 'production') {
    // Additional production checks
    if (!process.env.MONNIFY_API_KEY) {
      missing.push('MONNIFY_API_KEY');
    }
    
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      missing.push('CLOUDINARY_CLOUD_NAME');
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Validate on import
validateConfig();