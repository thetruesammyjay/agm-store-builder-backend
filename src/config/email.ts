/**
 * AGM Store Builder - Email Configuration
 * Email service configuration
 */

import { config } from './env';

export const emailConfig = {
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },

  // From address
  from: {
    name: config.email.fromName,
    email: config.email.fromEmail,
  },

  // Email settings
  settings: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    timeout: 30000, // 30 seconds
  },

  // Template settings
  templates: {
    baseUrl: config.frontendUrl,
    logoUrl: `${config.frontendUrl}/logo.png`,
    supportEmail: 'support@shopwithagm.com',
    companyName: 'AGM Store Builder',
    companyAddress: 'Lagos, Nigeria',
  },

  // Email types
  types: {
    welcome: 'welcome',
    otp: 'otp',
    passwordReset: 'password_reset',
    orderConfirmation: 'order_confirmation',
    orderStatus: 'order_status',
    paymentReceived: 'payment_received',
    payoutCompleted: 'payout_completed',
  } as const,
};

/**
 * Get email from address
 */
export function getEmailFromAddress(): string {
  return `"${emailConfig.from.name}" <${emailConfig.from.email}>`;
}

/**
 * Validate email configuration
 */
export function validateEmailConfig(): boolean {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('  Email credentials not configured. Email sending will be disabled.');
    return false;
  }
  return true;
}

/**
 * Check if email service is enabled
 */
export function isEmailEnabled(): boolean {
  return !!emailConfig.auth.user && !!emailConfig.auth.pass;
}