/**
 * AGM Store Builder - Product Routes
 * Product management endpoints
 */

import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
} from '../validators/productValidator';

const router = Router();

/**
 * POST /stores/:storeId/products
 * Create a new product (protected)
 */
router.post(
  '/stores/:storeId/products',
  authenticate,
  rateLimiter,
  validateBody(createProductSchema),
  productController.createProduct
);

/**
 * GET /stores/:username/products
 * List products for a store (public with optional filters)
 */
router.get(
  '/stores/:username/products',
  rateLimiter,
  validateQuery(productFiltersSchema),
  productController.listProducts
);

/**
 * GET /stores/:username/products/:productId
 * Get single product (public)
 */
router.get(
  '/stores/:username/products/:productId',
  rateLimiter,
  productController.getProduct
);

/**
 * GET /products/:productId
 * Get product by ID (for dashboard)
 */
router.get(
  '/:productId',
  optionalAuthenticate,
  rateLimiter,
  productController.getProductById
);

/**
 * PUT /products/:productId
 * Update product (protected)
 */
router.put(
  '/:productId',
  authenticate,
  rateLimiter,
  validateBody(updateProductSchema),
  productController.updateProduct
);

/**
 * DELETE /products/:productId
 * Delete product (protected)
 */
router.delete(
  '/:productId',
  authenticate,
  rateLimiter,
  productController.deleteProduct
);

/**
 * PATCH /products/:productId/stock
 * Update stock quantity (protected)
 */
router.patch(
  '/:productId/stock',
  authenticate,
  rateLimiter,
  productController.updateStock
);

export default router;