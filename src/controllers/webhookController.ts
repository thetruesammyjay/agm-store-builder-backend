/**
 * AGM Store Builder - Webhook Controller
 * HTTP request handlers for webhooks
 */

import { Request, Response, NextFunction } from 'express';
import * as webhookService from '../services/webhookService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /webhooks/monnify
 * Handle Monnify payment webhook
 */
export const handleMonnifyWebhook = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const signature = req.headers['monnify-signature'] as string;
    const payload = req.body;

    logger.info('Received Monnify webhook', {
      signature,
      payload,
    });

    // Verify webhook signature
    const isValid = await webhookService.verifyMonnifyWebhook(signature, payload);

    if (!isValid) {
      logger.warn('Invalid Monnify webhook signature');
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid webhook signature',
        },
      });
      return;
    }

    // Process webhook
    await webhookService.processMonnifyWebhook(payload);

    // Return 200 to acknowledge receipt
    res.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  }
);

/**
 * POST /webhooks/test
 * Test webhook endpoint (development only)
 */
export const testWebhook = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        error: {
          message: 'Test endpoint not available in production',
        },
      });
      return;
    }

    const payload = req.body;
    logger.info('Test webhook received', payload);

    res.json({
      success: true,
      message: 'Test webhook received',
      data: payload,
    });
  }
);