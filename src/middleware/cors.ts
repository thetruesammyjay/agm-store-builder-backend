/**
 * AGM Store Builder - CORS Configuration
 * Handles Cross-Origin Resource Sharing
 */

import cors from 'cors';
import { config } from '../config/env';

/**
 * CORS configuration
 */
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    const isAllowed = config.allowedOrigins.some((allowedOrigin) => {
      // Support wildcard subdomains
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp(
          allowedOrigin.replace(/\./g, '\\.').replace(/\*/g, '.*')
        );
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24 hours
};

export const corsMiddleware = cors(corsOptions);