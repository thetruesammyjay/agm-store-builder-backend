/**
 * AGM Store Builder - Store Validators
 * Joi validation schemas for store endpoints
 */

import Joi from 'joi';

/**
 * Create store validation schema
 */
export const createStoreSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'string.pattern.base': 'Username can only contain lowercase letters, numbers, and hyphens',
      'any.required': 'Username is required',
    }),
  display_name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Display name must be at least 2 characters long',
    'string.max': 'Display name must not exceed 255 characters',
    'any.required': 'Display name is required',
  }),
  description: Joi.string().max(1000).optional().allow(''),
  logo_url: Joi.string().uri().optional().allow(null, ''),
  template_id: Joi.string().valid('products', 'bookings', 'portfolio').default('products'),
  custom_colors: Joi.object({
    primary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    accent: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
  custom_fonts: Joi.object({
    heading: Joi.string().optional(),
    body: Joi.string().optional(),
  }).optional(),
});

/**
 * Update store validation schema
 */
export const updateStoreSchema = Joi.object({
  display_name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  logo_url: Joi.string().uri().optional().allow(null, ''),
  template_id: Joi.string().valid('products', 'bookings', 'portfolio').optional(),
  custom_colors: Joi.object({
    primary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    accent: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
  custom_fonts: Joi.object({
    heading: Joi.string().optional(),
    body: Joi.string().optional(),
  }).optional(),
  is_active: Joi.boolean().optional(),
}).min(1);

/**
 * Username parameter validation
 */
export const usernameSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9-]+$/)
    .required(),
});