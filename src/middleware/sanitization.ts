import { Request, Response, NextFunction } from 'express';

/**
 * Basic HTML sanitization
 */
function sanitizeHtmlBasic(input: string): string {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize request body
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeHtmlBasic(obj.trim());
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize fields that allow HTML (like descriptions)
 */
export function sanitizeHtmlFields(...fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.body) {
      return next();
    }

    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        // For rich text fields, we'll allow basic formatting but strip dangerous tags
        req.body[field] = sanitizeHtmlAdvanced(req.body[field]);
      }
    }

    next();
  };
}

/**
 * Advanced HTML sanitization for rich text
 */
function sanitizeHtmlAdvanced(html: string): string {
  // Remove script tags and event handlers
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');

  // Note: For production, consider using a library like DOMPurify
  // to handle complex HTML sanitization with allowed tags/attributes
  
  return cleaned;
}

/**
 * Strip all HTML tags
 */
export function stripHtml(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    req.body = stripHtmlFromObject(req.body);
  }

  next();
}

function stripHtmlFromObject(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/<[^>]*>/g, '');
  }

  if (Array.isArray(obj)) {
    return obj.map(stripHtmlFromObject);
  }

  if (obj !== null && typeof obj === 'object') {
    const stripped: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        stripped[key] = stripHtmlFromObject(obj[key]);
      }
    }
    return stripped;
  }

  return obj;
}