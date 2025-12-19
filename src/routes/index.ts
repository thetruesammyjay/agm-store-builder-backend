/**
 * AGM Store Builder - Main Route Aggregator
 * Combines all API routes into a single router
 */

import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import storeRoutes from './stores';
import productRoutes from './products';
import orderRoutes from './orders';
import paymentRoutes from './payments';
import uploadRoutes from './upload';
import analyticsRoutes from './analytics';
import webhookRoutes from './webhooks';
import healthRoutes from './health';

const router = Router();

/**
 * API Routes
 * Base: /api/v1
 */

// Health check (no rate limiting)
router.use('/health', healthRoutes);

// Webhooks (must come before other routes to avoid auth middleware)
router.use('/webhooks', webhookRoutes);

// Authentication
router.use('/auth', authRoutes);

// Users
router.use('/users', userRoutes);

// Stores
router.use('/stores', storeRoutes);

// Products
router.use('/products', productRoutes);

// Orders
router.use('/orders', orderRoutes);

// Payments
router.use('/payments', paymentRoutes);

// File upload
router.use('/upload', uploadRoutes);

// Analytics
router.use('/analytics', analyticsRoutes);

// API info endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'AGM Store Builder API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      users: '/users',
      stores: '/stores',
      products: '/products',
      orders: '/orders',
      payments: '/payments',
      upload: '/upload',
      analytics: '/analytics',
      webhooks: '/webhooks',
    },
    documentation: 'https://docs.shopwithagm.com',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
router.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested endpoint does not exist',
    },
  });
});

export default router;