/**
 * AGM Store Builder - User Routes
 * User management endpoints
 */

import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  updateProfileSchema,
  updatePasswordSchema,
} from '../validators/userValidator';

const router = Router();

/**
 * GET /users/profile
 * Get user profile (protected)
 */
router.get(
  '/profile',
  authenticate,
  rateLimiter,
  userController.getProfile
);

/**
 * PUT /users/profile
 * Update user profile (protected)
 */
router.put(
  '/profile',
  authenticate,
  rateLimiter,
  validateBody(updateProfileSchema),
  userController.updateProfile
);

/**
 * PUT /users/password
 * Update password (protected)
 */
router.put(
  '/password',
  authenticate,
  rateLimiter,
  validateBody(updatePasswordSchema),
  userController.updatePassword
);

/**
 * DELETE /users/account
 * Deactivate account (protected)
 */
router.delete(
  '/account',
  authenticate,
  rateLimiter,
  userController.deactivateAccount
);

/**
 * POST /users/avatar
 * Update avatar (protected)
 */
router.post(
  '/avatar',
  authenticate,
  rateLimiter,
  userController.updateAvatar
);

export default router;