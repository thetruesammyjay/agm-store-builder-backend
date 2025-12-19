/**
 * AGM Store Builder - Auth Validators
 * Joi validation schemas for authentication endpoints
 */

import Joi from 'joi';

/**
 * Signup validation schema
 */
export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  full_name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name must not exceed 255 characters',
    'any.required': 'Full name is required',
  }),
  phone: Joi.string()
    .pattern(/^\+234[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid Nigerian number (+234...)',
      'any.required': 'Phone number is required',
    }),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

/**
 * Verify OTP validation schema
 */
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().when('phone', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  phone: Joi.string().pattern(/^\+234[0-9]{10}$/),
  code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'OTP code must be 6 digits',
    'string.pattern.base': 'OTP code must contain only numbers',
    'any.required': 'OTP code is required',
  }),
  type: Joi.string().valid('email', 'phone').required().messages({
    'any.only': 'Type must be either "email" or "phone"',
    'any.required': 'Type is required',
  }),
});

/**
 * Resend OTP validation schema
 */
export const resendOtpSchema = Joi.object({
  email: Joi.string().email().when('phone', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  phone: Joi.string().pattern(/^\+234[0-9]{10}$/),
  type: Joi.string().valid('email', 'phone').required(),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required',
  }),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters long',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required',
  }),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().pattern(/^\+234[0-9]{10}$/).optional(),
  avatar_url: Joi.string().uri().optional().allow(null),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});