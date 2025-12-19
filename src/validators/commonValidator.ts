/**
 * AGM Store Builder - Common Validators
 * Shared validation schemas
 */

import Joi from 'joi';

/**
 * Pagination validation schema
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

/**
 * ID parameter validation
 */
export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid ID format',
    'any.required': 'ID is required',
  }),
});

/**
 * Analytics filters validation
 */
export const analyticsFiltersSchema = Joi.object({
  storeId: Joi.string().uuid().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  period: Joi.string().valid('today', 'week', 'month', 'year').optional(),
}).and('startDate', 'endDate');

/**
 * Search and sort validation
 */
export const searchSortSchema = Joi.object({
  search: Joi.string().max(255).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});