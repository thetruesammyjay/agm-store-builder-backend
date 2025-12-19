/**
 * AGM Store Builder - Webhook Service
 * Handles webhook processing from payment providers
 */

import crypto from 'crypto';
import { config } from '../config/env';
import { 
  findPaymentByMonnifyReference, 
  updatePaymentStatus, 
  PaymentStatus 
} from '../models/Payment';
import { updateOrderPaymentStatus } from '../models/Order';
import { logger } from '../utils/logger';

/**
 * Verify Monnify webhook signature
 */
export function verifyMonnifyWebhook(signature: string, payload: any): boolean {
  if (!signature) {
    logger.warn('Missing webhook signature');
    return false;
  }

  try {
    const hash = crypto
      .createHmac('sha512', config.monnify.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  } catch (error) {
    logger.error('Error verifying webhook signature', error);
    return false;
  }
}

/**
 * Process Monnify payment webhook
 */
export async function processMonnifyWebhook(payload: any): Promise<void> {
  const { 
    transactionReference, 
    paymentReference,
    paymentStatus, 
    amountPaid,
    paidOn 
  } = payload;

  logger.info('Processing Monnify webhook', {
    reference: transactionReference || paymentReference,
    status: paymentStatus,
    amount: amountPaid,
  });

  // Find payment by Monnify reference or payment reference
  let payment = await findPaymentByMonnifyReference(transactionReference);
  
  if (!payment && paymentReference) {
    payment = await findPaymentByMonnifyReference(paymentReference);
  }

  if (!payment) {
    logger.warn('Payment not found for webhook', { 
      transactionReference, 
      paymentReference 
    });
    return;
  }

  // Map Monnify status to our status
  let newStatus: PaymentStatus = 'pending';

  switch (paymentStatus?.toUpperCase()) {
    case 'PAID':
      newStatus = 'paid';
      break;
    case 'FAILED':
      newStatus = 'failed';
      break;
    case 'EXPIRED':
      newStatus = 'expired';
      break;
    case 'CANCELLED':
      newStatus = 'failed';
      break;
    default:
      newStatus = 'pending';
  }

  // Update payment status
  if (newStatus !== payment.status) {
    await updatePaymentStatus(payment.id, newStatus, 'bank_transfer');
    
    logger.info('Payment status updated', {
      paymentId: payment.id,
      oldStatus: payment.status,
      newStatus,
    });

    // Update order payment status
    if (newStatus === 'paid') {
      await updateOrderPaymentStatus(payment.order_id, 'paid');
      
      logger.info('Order marked as paid', { 
        orderId: payment.order_id,
        paymentId: payment.id,
        amount: amountPaid,
        paidOn,
      });
    } else if (newStatus === 'failed' || newStatus === 'expired') {
      await updateOrderPaymentStatus(payment.order_id, 'failed');
      
      logger.warn('Order payment failed', { 
        orderId: payment.order_id,
        paymentId: payment.id,
        status: newStatus,
      });
    }
  }

  logger.info('Webhook processed successfully', {
    paymentId: payment.id,
    orderId: payment.order_id,
    status: newStatus,
  });
}

/**
 * Handle webhook errors
 */
export function handleWebhookError(error: any, payload: any): void {
  logger.error('Webhook processing error', {
    error: error.message,
    stack: error.stack,
    payload: JSON.stringify(payload).substring(0, 500),
  });
}

/**
 * Validate webhook payload
 */
export function validateWebhookPayload(payload: any): boolean {
  if (!payload) {
    logger.warn('Empty webhook payload');
    return false;
  }

  const requiredFields = ['transactionReference', 'paymentStatus'];
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      logger.warn(`Missing required field: ${field}`, { payload });
      return false;
    }
  }

  return true;
}