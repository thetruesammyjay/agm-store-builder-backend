/**
 * AGM Store Builder - Order Validators
 * Joi validation schemas for order endpoints
 */

import Joi from 'joi';

/**
 * Order item schema
 */
const orderItemSchema = Joi.object({
  product_id: Joi.string().uuid().required(),
  product_name: Joi.string().required(),
  product_image: Joi.string().uri().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required(),
  selected_variations: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
});

/**
 * Customer address schema
 */
const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().optional(),
});

/**
 * Create order validation schema
 */
export const createOrderSchema = Joi.object({
  customer_name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Customer name must be at least 2 characters long',
    'any.required': 'Customer name is required',
  }),
  customer_phone: Joi.string()
    .pattern(/^\+234[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid Nigerian number (+234...)',
      'any.required': 'Customer phone is required',
    }),
  customer_email: Joi.string().email().optional().allow(''),
  customer_address: addressSchema.optional(),
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': 'At least one item is required',
    'any.required': 'Order items are required',
  }),
  subtotal: Joi.number().positive().required(),
  agm_fee: Joi.number().min(0).required(),
  total: Joi.number().positive().required(),
});

/**
 * Update order status validation schema
 */
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'fulfilled', 'cancelled').required().messages({
    'any.only': 'Invalid order status',
    'any.required': 'Order status is required',
  }),
});

/**
 * Order filters validation schema
 */
export const orderFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('pending', 'confirmed', 'fulfilled', 'cancelled').optional(),
  payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  search: Joi.string().max(255).optional(),
});