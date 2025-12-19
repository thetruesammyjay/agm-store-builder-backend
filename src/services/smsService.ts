/**
 * AGM Store Builder - SMS Service
 * SMS sending functionality using Termii or other Nigerian SMS gateway
 */

import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { formatNigerianPhone } from '../utils/validators';

interface SendSmsOptions {
  to: string;
  message: string;
}

/**
 * Send SMS via Termii
 */
async function sendViaTermii(to: string, message: string): Promise<boolean> {
  try {
    const response = await axios.post(
      'https://api.ng.termii.com/api/sms/send',
      {
        to,
        from: config.sms.senderId,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: config.sms.apiKey,
      }
    );

    logger.info('SMS sent successfully via Termii', { to, messageId: response.data.message_id });
    return true;
  } catch (error: any) {
    logger.error('Failed to send SMS via Termii', {
      to,
      error: error.response?.data || error.message,
    });
    return false;
  }
}

/**
 * Send SMS
 */
export async function sendSms(options: SendSmsOptions): Promise<boolean> {
  const phone = formatNigerianPhone(options.to);
  
  // In development, just log the SMS
  if (config.nodeEnv === 'development') {
    logger.info('📱 SMS (Development Mode)', {
      to: phone,
      message: options.message,
    });
    return true;
  }

  // Send via configured provider
  switch (config.sms.provider) {
    case 'termii':
      return await sendViaTermii(phone, options.message);
    default:
      logger.warn('No SMS provider configured');
      return false;
  }
}

/**
 * Send OTP SMS
 */
export async function sendOtpSms(
  phone: string,
  code: string,
  purpose: 'signup' | 'login' | 'password_reset' = 'signup'
): Promise<boolean> {
  const purposeText = {
    signup: 'verify your phone number',
    login: 'log in to your account',
    password_reset: 'reset your password',
  }[purpose];

  const message = `Your AGM Store Builder verification code is: ${code}. Use this code to ${purposeText}. Valid for 10 minutes.`;

  return await sendSms({
    to: phone,
    message,
  });
}

/**
 * Send order notification SMS
 */
export async function sendOrderNotificationSms(
  phone: string,
  orderNumber: string,
  storeName: string
): Promise<boolean> {
  const message = `New order ${orderNumber} received from ${storeName}. Check your dashboard for details. - AGM Store Builder`;

  return await sendSms({
    to: phone,
    message,
  });
}

/**
 * Send order confirmation SMS to customer
 */
export async function sendOrderConfirmationSms(
  phone: string,
  orderNumber: string,
  total: number
): Promise<boolean> {
  const message = `Order confirmed! Your order ${orderNumber} (₦${total.toLocaleString()}) is being processed. Track at ${config.frontendUrl}/orders/${orderNumber}`;

  return await sendSms({
    to: phone,
    message,
  });
}

/**
 * Send order status update SMS
 */
export async function sendOrderStatusSms(
  phone: string,
  orderNumber: string,
  status: string
): Promise<boolean> {
  const statusMessage = {
    confirmed: 'has been confirmed',
    fulfilled: 'has been fulfilled',
    cancelled: 'has been cancelled',
  }[status] || 'status updated';

  const message = `Order ${orderNumber} ${statusMessage}. Track at ${config.frontendUrl}/orders/${orderNumber} - AGM Store Builder`;

  return await sendSms({
    to: phone,
    message,
  });
}

/**
 * Send payment confirmation SMS
 */
export async function sendPaymentConfirmationSms(
  phone: string,
  amount: number,
  reference: string
): Promise<boolean> {
  const message = `Payment of ₦${amount.toLocaleString()} received successfully. Reference: ${reference}. Thank you! - AGM Store Builder`;

  return await sendSms({
    to: phone,
    message,
  });
}

/**
 * Send bulk SMS (for marketing/announcements)
 */
export async function sendBulkSms(
  recipients: string[],
  message: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const phone of recipients) {
    const success = await sendSms({ to: phone, message });
    if (success) {
      sent++;
    } else {
      failed++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  logger.info('Bulk SMS completed', { total: recipients.length, sent, failed });

  return { sent, failed };
}