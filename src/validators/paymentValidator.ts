/**
 * AGM Store Builder - Payment Validators
 * Joi validation schemas for payment endpoints
 */

import Joi from 'joi';

/**
 * Add bank account validation schema
 */
export const addBankAccountSchema = Joi.object({
  account_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'Account number must be 10 digits',
    'string.pattern.base': 'Account number must contain only numbers',
    'any.required': 'Account number is required',
  }),
  bank_code: Joi.string().required().messages({
    'any.required': 'Bank code is required',
  }),
  account_name: Joi.string().required().messages({
    'any.required': 'Account name is required',
  }),
  bank_name: Joi.string().required().messages({
    'any.required': 'Bank name is required',
  }),
});

/**
 * Verify payment validation schema
 */
export const verifyPaymentSchema = Joi.object({
  reference: Joi.string().required().messages({
    'any.required': 'Payment reference is required',
  }),
});

/**
 * Initiate payout validation schema
 */
export const initiatePayoutSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  bank_account_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid bank account ID format',
    'any.required': 'Bank account ID is required',
  }),
  narration: Joi.string().max(255).optional(),
});