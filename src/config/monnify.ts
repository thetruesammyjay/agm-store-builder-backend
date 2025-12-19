/**
 * AGM Store Builder - Monnify Configuration
 * Monnify payment gateway configuration
 */

import { config } from './env';

export const monnifyConfig = {
  apiKey: config.monnify.apiKey,
  secretKey: config.monnify.secretKey,
  contractCode: config.monnify.contractCode,
  baseUrl: config.monnify.baseUrl,
  webhookSecret: config.monnify.webhookSecret,

  // API endpoints
  endpoints: {
    auth: '/api/v1/auth/login',
    initializePayment: '/api/v1/merchant/transactions/init-transaction',
    verifyPayment: '/api/v2/transactions',
    banks: '/api/v1/banks',
    verifyAccount: '/api/v1/disbursements/account/validate',
    initiatePayout: '/api/v2/disbursements/single',
    bulkPayout: '/api/v2/disbursements/batch',
    reservedAccount: '/api/v2/bank-transfer/reserved-accounts',
  },

  // Payment methods
  paymentMethods: ['CARD', 'ACCOUNT_TRANSFER', 'USSD'] as const,

  // Currency
  currency: 'NGN' as const,

  // Redirect URL
  redirectUrl: `${config.frontendUrl}/payment/callback`,

  // Webhook URL (for production)
  webhookUrl: config.isProduction
    ? `${process.env.BACKEND_URL}/api/webhooks/monnify`
    : undefined,

  // Timeout settings
  timeout: 30000, // 30 seconds

  // Retry settings
  retry: {
    attempts: 3,
    delay: 1000, // 1 second
  },
};

/**
 * Get Monnify authorization header
 */
export function getMonnifyAuthHeader(): string {
  const credentials = `${monnifyConfig.apiKey}:${monnifyConfig.secretKey}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

/**
 * Get full Monnify API URL
 */
export function getMonnifyUrl(endpoint: string): string {
  return `${monnifyConfig.baseUrl}${endpoint}`;
}

/**
 * Validate Monnify configuration
 */
export function validateMonnifyConfig(): boolean {
  const required = [
    monnifyConfig.apiKey,
    monnifyConfig.secretKey,
    monnifyConfig.contractCode,
  ];

  return required.every((value) => value && value.length > 0);
}