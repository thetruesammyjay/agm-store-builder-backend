/**
 * AGM Store Builder - Auth Controller
 * HTTP request handlers for authentication
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      data: result.user,
      message: result.message,
    });
  }
);

/**
 * POST /api/v1/auth/login
 * Login user
 */
export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      },
    });
  }
);

/**
 * POST /api/v1/auth/verify-otp
 * Verify email or phone OTP
 */
export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, phone, code, type } = req.body;

    let result;
    if (type === 'email' && email) {
      result = await authService.verifyEmail(email, code);
    } else if (type === 'phone' && phone) {
      result = await authService.verifyPhone(phone, code);
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid verification type or missing email/phone',
        },
      });
      return;
    }

    res.json({
      success: result.verified,
      message: result.message,
    });
  }
);

/**
 * POST /api/v1/auth/resend-otp
 * Resend OTP
 */
export const resendOtp = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, phone, type } = req.body;

    let result;
    if (type === 'email' && email) {
      result = await authService.resendEmailOtp(email);
    } else if (type === 'phone' && phone) {
      result = await authService.resendPhoneOtp(phone);
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid type or missing email/phone',
        },
      });
      return;
    }

    res.json({
      success: true,
      message: result.message,
    });
  }
);

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
export const getMe = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
        },
      });
      return;
    }

    const user = await authService.getMe(req.userId);

    res.json({
      success: true,
      data: user,
    });
  }
);

/**
 * POST /api/v1/auth/logout
 * Logout user (client-side token removal)
 */
export const logout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    // In a JWT system, logout is typically handled client-side
    // by removing the token. We can add token blacklisting later if needed.

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);