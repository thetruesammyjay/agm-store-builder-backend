/**
 * AGM Store Builder - Analytics Routes
 * Analytics endpoints
 */

import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import { analyticsFiltersSchema } from '../validators/commonValidator';

const router = Router();

/**
 * GET /analytics/dashboard
 * Get dashboard analytics (protected)
 */
router.get(
  '/dashboard',
  authenticate,
  rateLimiter,
  validateQuery(analyticsFiltersSchema),
  analyticsController.getDashboardAnalytics
);

/**
 * GET /analytics/revenue
 * Get revenue stats (protected)
 */
router.get(
  '/revenue',
  authenticate,
  rateLimiter,
  validateQuery(analyticsFiltersSchema),
  analyticsController.getRevenueStats
);

/**
 * GET /analytics/stores/:storeId
 * Get store-specific analytics (protected)
 */
router.get(
  '/stores/:storeId',
  authenticate,
  rateLimiter,
  validateQuery(analyticsFiltersSchema),
  analyticsController.getStoreAnalytics
);

/**
 * GET /analytics/customers
 * Get customer list and stats (protected)
 */
router.get(
  '/customers',
  authenticate,
  rateLimiter,
  analyticsController.getCustomerAnalytics
);

/**
 * GET /analytics/products/top
 * Get top-selling products (protected)
 */
router.get(
  '/products/top',
  authenticate,
  rateLimiter,
  analyticsController.getTopProducts
);

export default router;