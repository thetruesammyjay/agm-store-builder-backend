import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { errors } from './errorHandler';

/**
 * Verify webhook signature middleware
 * Ensures that incoming webhook requests are from trusted sources
 */
export function verifyWebhookSignature(req: Request, _res: Response, next: NextFunction): void {
  const signature = req.headers['x-signature'] as string;
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET; // Ensure this is set in your environment variables

  if (!signature || !secret) {
    return next(errors.unauthorized('Missing signature or secret'));
  }

  const hash = crypto.createHmac('sha256', secret)
                     .update(payload)
                     .digest('hex');

  if (hash !== signature) {
    return next(errors.unauthorized('Invalid signature'));
  }

  next();
}