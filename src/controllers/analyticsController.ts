/**
 * AGM Store Builder - Analytics Controller
 * HTTP request handlers for analytics and reporting
 */

import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analyticsService';
import { asyncHandler, errors } from '../middleware/errorHandler';
import { validateParam } from '../utils/validators';

/**
 * GET /analytics/dashboard
 * Get dashboard analytics
 */
export const getDashboardAnalytics = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const filters = req.query;
    const analytics = await analyticsService.getDashboardAnalytics(req.user.id, filters);

    res.json({
      success: true,
      data: analytics,
    });
  }
);

/**
 * GET /analytics/revenue
 * Get revenue statistics
 */
export const getRevenueStats = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const filters = req.query;
    const stats = await analyticsService.getRevenueStats(req.user.id, filters);

    res.json({
      success: true,
      data: stats,
    });
  }
);

/**
 * GET /analytics/stores/:storeId
 * Get store-specific analytics
 */
export const getStoreAnalytics = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    const filters = req.query;

    const analytics = await analyticsService.getStoreAnalytics(storeId, req.user.id, filters);

    res.json({
      success: true,
      data: analytics,
    });
  }
);

/**
 * GET /analytics/customers
 * Get customer analytics
 */
export const getCustomerAnalytics = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const analytics = await analyticsService.getCustomerAnalytics(req.user.id);

    res.json({
      success: true,
      data: analytics,
    });
  }
);

/**
 * GET /analytics/products/top
 * Get top-selling products
 */
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const { limit = 10, storeId } = req.query;

    const products = await analyticsService.getTopProducts(
      req.user.id,
      Number(limit),
      storeId as string
    );

    res.json({
      success: true,
      data: products,
    });
  }
);