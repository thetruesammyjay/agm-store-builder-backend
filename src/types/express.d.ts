/**
 * AGM Store Builder - Express Type Extensions
 * Extend Express Request with custom properties
 */

import { UserPublic } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name: string;
        phone: string;
      };
      userId?: string;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};