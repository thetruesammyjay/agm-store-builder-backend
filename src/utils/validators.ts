import { errors } from '../middleware/errorHandler';

/**
 * Validate that a required parameter exists
 */
export function validateParam(param: string | undefined, name: string): string {
  if (!param) {
    throw errors.badRequest(`${name} is required`);
  }
  return param;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Nigerian format)
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+?234|0)?[789]\d{9}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number to international format
 */
export function formatNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.substring(1)}`;
  }
  
  return `+234${cleaned}`;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const validationErrors: string[] = [];
  
  if (password.length < 8) {
    validationErrors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    validationErrors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    validationErrors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    validationErrors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    validationErrors.push('Password must contain at least one special character');
  }
  
  return {
    valid: validationErrors.length === 0,
    errors: validationErrors,
  };
}

/**
 * Parse pagination parameters
 */
export function parsePaginationParams(query: any): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: any, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw errors.badRequest(`${fieldName} must be a positive number`);
  }
  return num;
}

/**
 * Validate non-negative number
 */
export function validateNonNegativeNumber(value: any, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    throw errors.badRequest(`${fieldName} must be a non-negative number`);
  }
  return num;
}