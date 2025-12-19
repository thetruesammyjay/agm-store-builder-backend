/**
 * AGM Store Builder - User Controller
 * HTTP request handlers for user management
 */

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';
import { errors } from '../middleware/errorHandler';

/**
 * GET /users/profile
 * Get user profile
 */
export const getProfile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const user = await userService.getUserProfile(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  }
);

/**
 * PUT /users/profile
 * Update user profile
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const user = await userService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  }
);

/**
 * PUT /users/password
 * Update password
 */
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const { current_password, new_password } = req.body;
    await userService.updatePassword(req.user.id, current_password, new_password);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  }
);

/**
 * DELETE /users/account
 * Deactivate account
 */
export const deactivateAccount = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    await userService.deactivateAccount(req.user.id);

    res.json({
      success: true,
      message: 'Account deactivated successfully',
    });
  }
);

/**
 * POST /users/avatar
 * Update avatar
 */
export const updateAvatar = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const { avatar_url } = req.body;

    if (!avatar_url) {
      throw errors.badRequest('avatar_url is required');
    }

    const user = await userService.updateAvatar(req.user.id, avatar_url);

    res.json({
      success: true,
      data: user,
      message: 'Avatar updated successfully',
    });
  }
);