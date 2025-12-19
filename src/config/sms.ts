/**
 * AGM Store Builder - SMS Configuration
 * SMS service configuration
 */

import { config } from './env';

export const smsConfig = {
  provider: config.sms.provider,
  apiKey: config.sms.apiKey,
  senderId: config.sms.senderId,

  // Termii configuration
  termii: {
    baseUrl: 'https://api.ng.termii.com/api',
    endpoints: {
      send: '/sms/send',
      otp: '/sms/otp/send',
      verify: '/sms/otp/verify',
    },
    channel: 'generic' as const,
    type: 'plain' as const,
  },

  // SMS settings
  settings: {
    maxRetries: 3,
    retryDelay: 3000, // 3 seconds
    timeout: 15000, // 15 seconds
    maxLength: 160, // Standard SMS length
  },

  // SMS types
  types: {
    otp: 'otp',
    orderNotification: 'order_notification',
    orderConfirmation: 'order_confirmation',
    orderStatus: 'order_status',
    paymentReceived: 'payment_received',
    marketing: 'marketing',
  } as const,
};

/**
 * Get Termii API URL
 */
export function getTermiiUrl(endpoint: string): string {
  return `${smsConfig.termii.baseUrl}${endpoint}`;
}

/**
 * Validate SMS configuration
 */
export function validateSmsConfig(): boolean {
  if (smsConfig.provider === 'none') {
    console.warn('⚠️  SMS provider set to "none". SMS sending is disabled.');
    return false;
  }

  if (!smsConfig.apiKey) {
    console.warn('⚠️  SMS API key not configured. SMS sending will be disabled.');
    return false;
  }

  return true;
}

/**
 * Check if SMS service is enabled
 */
export function isSmsEnabled(): boolean {
  return smsConfig.provider !== 'none' && !!smsConfig.apiKey;
}

/**
 * Truncate SMS message to fit within length limit
 */
export function truncateSmsMessage(message: string): string {
  if (message.length <= smsConfig.settings.maxLength) {
    return message;
  }
  return message.substring(0, smsConfig.settings.maxLength - 3) + '...';
}