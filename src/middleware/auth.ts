/**
 * AGM Store Builder - Authentication Middleware
 * JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { findUserById, User } from '../models/User';
import { errors } from './errorHandler';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Support "Bearer TOKEN" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Support raw token
  return authHeader;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token
    const token = extractToken(req);

    if (!token) {
      throw errors.unauthorized('No authentication token provided');
    }

    // Verify token
    let payload: JwtPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw errors.unauthorized('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw errors.unauthorized('Invalid token');
      }
      throw errors.unauthorized('Authentication failed');
    }

    // Get user from database
    const user = await findUserById(payload.userId);

    if (!user) {
      throw errors.unauthorized('User not found');
    }

    if (!user.is_active) {
      throw errors.unauthorized('Account is inactive');
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const user = await findUserById(payload.userId);

        if (user && user.is_active) {
          req.user = user;
          req.userId = user.id;
        }
      } catch {
        // Ignore errors in optional authentication
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require email verification middleware
 */
export function requireEmailVerification(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(errors.unauthorized('Authentication required'));
  }

  if (!req.user.email_verified) {
    return next(errors.forbidden('Email verification required'));
  }

  next();
}

/**
 * Require phone verification middleware
 */
export function requirePhoneVerification(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(errors.unauthorized('Authentication required'));
  }

  if (!req.user.phone_verified) {
    return next(errors.forbidden('Phone verification required'));
  }

  next();
}

/**
 * Require both email and phone verification
 */
export function requireFullVerification(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(errors.unauthorized('Authentication required'));
  }

  if (!req.user.email_verified || !req.user.phone_verified) {
    return next(errors.forbidden('Full account verification required'));
  }

  next();
}