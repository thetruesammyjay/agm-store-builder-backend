/**
 * AGM Store Builder - OTP Utilities
 * OTP generation and validation helpers
 */

import { OTP_CONFIG } from './constants';

/**
 * Generate numeric OTP code
 */
export function generateOtpCode(length: number = OTP_CONFIG.LENGTH): string {
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  
  return code;
}

/**
 * Generate alphanumeric OTP code
 */
export function generateAlphanumericOtp(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * Validate OTP format
 */
export function isValidOtpFormat(code: string, length: number = OTP_CONFIG.LENGTH): boolean {
  const regex = new RegExp(`^[0-9]{${length}}$`);
  return regex.test(code);
}

/**
 * Check if OTP is expired
 */
export function isOtpExpired(createdAt: Date, expiryMinutes: number = OTP_CONFIG.EXPIRY_MINUTES): boolean {
  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return now > expiryTime;
}

/**
 * Get OTP expiry time
 */
export function getOtpExpiryTime(expiryMinutes: number = OTP_CONFIG.EXPIRY_MINUTES): Date {
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
}

/**
 * Format OTP code for display (e.g., "123-456")
 */
export function formatOtpCode(code: string): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  }
  return code;
}