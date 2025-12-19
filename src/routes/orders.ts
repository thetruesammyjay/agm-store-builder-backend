/**
 * AGM Store Builder - Order Routes
 * Order management endpoints
 */

import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderFiltersSchema,
} from '../validators/orderValidator';

const router = Router();

/**
 * POST /stores/:username/orders
 * Create order / Guest checkout (public)
 */
router.post(
  '/stores/:username/orders',
  rateLimiter,
  validateBody(createOrderSchema),
  orderController.createOrder
);

/**
 * GET /orders/track/:orderNumber
 * Track order by order number (public)
 */
router.get(
  '/track/:orderNumber',
  rateLimiter,
  orderController.trackOrder
);

/**
 * GET /orders/:orderId
 * Get order details (public with order number or protected)
 */
router.get(
  '/:orderId',
  optionalAuthenticate,
  rateLimiter,
  orderController.getOrder
);

/**
 * GET /dashboard/orders
 * List orders for seller (protected)
 */
router.get(
  '/dashboard/orders',
  authenticate,
  rateLimiter,
  validateQuery(orderFiltersSchema),
  orderController.listOrders
);

/**
 * GET /stores/:storeId/orders
 * List orders for specific store (protected)
 */
router.get(
  '/stores/:storeId/orders',
  authenticate,
  rateLimiter,
  validateQuery(orderFiltersSchema),
  orderController.listStoreOrders
);

/**
 * PATCH /orders/:orderId/status
 * Update order status (protected)
 */
router.patch(
  '/:orderId/status',
  authenticate,
  rateLimiter,
  validateBody(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

/**
 * GET /stores/:storeId/orders/stats
 * Get order statistics (protected)
 */
router.get(
  '/stores/:storeId/orders/stats',
  authenticate,
  rateLimiter,
  orderController.getOrderStats
);

export default router;