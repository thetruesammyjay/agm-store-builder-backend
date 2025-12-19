/**
 * AGM Store Builder - Health Controller
 * HTTP request handlers for health checks
 */

import { Request, Response } from 'express';
import { db } from '../database/connection';

/**
 * GET /health
 * Health check endpoint
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await db.query('SELECT 1');

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /health/ready
 * Readiness check (for K8s/Railway)
 */
export const readinessCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
};

/**
 * GET /health/live
 * Liveness check (for K8s/Railway)
 */
export const livenessCheck = (_req: Request, res: Response): void => {
  res.status(200).json({ alive: true });
};