/**
 * AGM Store Builder - Webhook Routes
 * Webhook endpoints
 */

import { Router } from 'express';
import * as webhookController from '../controllers/webhookController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /webhooks/monnify
 * Monnify payment webhook
 * Note: No authentication - verified via signature
 */
router.post(
  '/monnify',
  rateLimiter,
  webhookController.handleMonnifyWebhook
);

/**
 * POST /webhooks/test
 * Test webhook endpoint (development only)
 */
if (process.env.NODE_ENV !== 'production') {
  router.post(
    '/test',
    webhookController.testWebhook
  );
}

export default router;