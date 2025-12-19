/**
 * AGM Store Builder - Auth Routes
 * Authentication endpoints
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { authRateLimiter, otpRateLimiter } from '../middleware/rateLimiter';
import {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from '../validators/authValidator';

const router = Router();

/**
 * POST /signup
 * Register a new user
 */
router.post(
  '/signup',
  authRateLimiter,
  validateBody(signupSchema),
  authController.signup
);

/**
 * POST /login
 * Login user
 */
router.post(
  '/login',
  authRateLimiter,
  validateBody(loginSchema),
  authController.login
);

/**
 * POST /verify-otp
 * Verify email or phone OTP
 */
router.post(
  '/verify-otp',
  authRateLimiter,
  validateBody(verifyOtpSchema),
  authController.verifyOtp
);

/**
 * POST /resend-otp
 * Resend verification OTP
 */
router.post(
  '/resend-otp',
  otpRateLimiter,
  validateBody(resendOtpSchema),
  authController.resendOtp
);

/**
 * GET /me
 * Get current user profile (protected)
 */
router.get('/me', authenticate, authController.getMe);

/**
 * POST /logout
 * Logout user
 */
router.post('/logout', authController.logout);

export default router;