/**
 * AGM Store Builder - Product Validators
 * Joi validation schemas for product endpoints
 */

import Joi from 'joi';

/**
 * Product variation schema
 */
const variationSchema = Joi.object({
  name: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(1).required(),
});

/**
 * Create product validation schema
 */
export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name must not exceed 255 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().max(5000).optional().allow(''),
  price: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  compare_at_price: Joi.number().positive().precision(2).greater(Joi.ref('price')).optional().messages({
    'number.greater': 'Compare at price must be greater than price',
  }),
  images: Joi.array().items(Joi.string().uri()).min(1).max(10).required().messages({
    'array.min': 'At least one image is required',
    'array.max': 'Maximum 10 images allowed',
    'any.required': 'Product images are required',
  }),
  variations: Joi.array().items(variationSchema).optional(),
  stock_quantity: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
});

/**
 * Update product validation schema
 */
export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(5000).optional().allow(''),
  price: Joi.number().positive().precision(2).optional(),
  compare_at_price: Joi.number().positive().precision(2).optional(),
  images: Joi.array().items(Joi.string().uri()).min(1).max(10).optional(),
  variations: Joi.array().items(variationSchema).optional(),
  stock_quantity: Joi.number().integer().min(0).optional(),
  is_active: Joi.boolean().optional(),
}).min(1);

/**
 * Product filters validation schema
 */
export const productFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().max(255).optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().min(Joi.ref('minPrice')).optional(),
  inStock: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('price', 'name', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Update stock validation schema
 */
export const updateStockSchema = Joi.object({
  stock_quantity: Joi.number().integer().min(0).required().messages({
    'any.required': 'Stock quantity is required',
  }),
});