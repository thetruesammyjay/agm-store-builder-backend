/**
 * AGM Store Builder - Permissions Middleware
 * Role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { errors } from './errorHandler';

/**
 * Check if user has required permissions
 */
export function requirePermissions(..._requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(errors.unauthorized('Authentication required'));
    }

    // For now, all authenticated users have basic permissions
    // You can extend the User model to include a permissions field if needed
    const hasPermission = true;

    if (!hasPermission) {
      return next(
        errors.forbidden('You do not have permission to perform this action')
      );
    }

    next();
  };
}

/**
 * Require admin role
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(errors.unauthorized('Authentication required'));
  }

  // Check if user is admin (you can add role field to User model if needed)
  // For now, we'll use a simple check based on email or add role to the database
  const isAdmin = req.user.email?.endsWith('@agmshop.com') || false;

  if (!isAdmin) {
    return next(errors.forbidden('Admin access required'));
  }

  next();
}

/**
 * Require store ownership
 */
export async function requireStoreOwnership(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      return next(errors.unauthorized('Authentication required'));
    }

    const storeId = req.params.storeId || req.params.id;

    if (!storeId) {
      return next(errors.badRequest('Store ID is required'));
    }

    // Check if user owns the store
    // This will be validated in the controller/service layer
    // For now, we'll pass it through
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require product ownership (via store)
 */
export async function requireProductOwnership(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      return next(errors.unauthorized('Authentication required'));
    }

    const productId = req.params.productId || req.params.id;

    if (!productId) {
      return next(errors.badRequest('Product ID is required'));
    }

    // Check if user owns the product (via store ownership)
    // This will be validated in the controller/service layer
    next();
  } catch (error) {
    next(error);
  }
}