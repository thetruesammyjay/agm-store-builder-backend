/**
 * AGM Store Builder - Order Controller
 * HTTP request handlers for order management
 */

import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';
import { asyncHandler, errors } from '../middleware/errorHandler';
import { validateParam } from '../utils/validators';

/**
 * POST /stores/:username/orders
 * Create order / Guest checkout
 */
export const createOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username = validateParam(req.params.username, 'Username');
    const orderData = req.body;
    
    const result = await orderService.createOrder(username, orderData);

    res.status(201).json({
      success: true,
      data: {
        order: result.order,
        payment: result.payment,
      },
      message: 'Order created successfully',
    });
  }
);

/**
 * GET /orders/track/:orderNumber
 * Track order by order number (public)
 */
export const trackOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const orderNumber = validateParam(req.params.orderNumber, 'Order number');
    const order = await orderService.trackOrder(orderNumber);

    if (!order) {
      throw errors.notFound('Order');
    }

    res.json({
      success: true,
      data: order,
    });
  }
);

/**
 * GET /orders/:orderId
 * Get order by ID
 */
export const getOrder = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const orderId = validateParam(req.params.orderId, 'Order ID');
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw errors.notFound('Order');
    }

    // Verify ownership if user is authenticated
    if (req.user) {
      await orderService.verifyOrderOwnership(orderId, req.user.id);
    }

    res.json({
      success: true,
      data: order,
    });
  }
);

/**
 * GET /orders
 * List orders for current user
 */
export const listOrders = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const filters = req.query;
    const result = await orderService.listAllOrders(req.user.id, filters);

    res.json({
      success: true,
      data: result.orders,
      pagination: {
        page: parseInt(filters.page as string) || 1,
        limit: parseInt(filters.limit as string) || 10,
        total: result.total,
      },
    });
  }
);

/**
 * GET /stores/:storeId/orders
 * List orders for specific store
 */
export const listStoreOrders = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    const filters = req.query;

    const result = await orderService.listStoreOrders(storeId, req.user.id, filters);

    res.json({
      success: true,
      data: result.orders,
      pagination: {
        page: parseInt(filters.page as string) || 1,
        limit: parseInt(filters.limit as string) || 10,
        total: result.total,
      },
    });
  }
);

/**
 * PUT /orders/:orderId/status
 * Update order status
 */
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const orderId = validateParam(req.params.orderId, 'Order ID');
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, req.user.id, status);

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  }
);

/**
 * GET /stores/:storeId/orders/stats
 * Get order statistics
 */
export const getOrderStats = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    const stats = await orderService.getOrderStats(storeId, req.user.id);

    res.json({
      success: true,
      data: stats,
    });
  }
);