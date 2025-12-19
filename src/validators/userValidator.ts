/**
 * AGM Store Builder - User Validators
 * Joi validation schemas for user endpoints
 */

import Joi from 'joi';

/**
 * Update profile validation schema
 */
export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().pattern(/^\+234[0-9]{10}$/).optional(),
  avatar_url: Joi.string().uri().optional().allow(null, ''),
}).min(1);

/**
 * Update password validation schema
 */
export const updatePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  new_password: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters long',
    'any.required': 'New password is required',
  }),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required',
  }),
});

/**
 * Update avatar validation schema
 */
export const updateAvatarSchema = Joi.object({
  avatar_url: Joi.string().uri().required().messages({
    'string.uri': 'Invalid avatar URL',
    'any.required': 'Avatar URL is required',
  }),
});