/**
 * AGM Store Builder - Store Controller
 * HTTP request handlers for store management
 */

import { Request, Response, NextFunction } from 'express';
import * as storeService from '../services/storeService';
import { asyncHandler, errors } from '../middleware/errorHandler';
import { validateParam } from '../utils/validators';

/**
 * POST /stores
 * Create a new store
 */
export const createStore = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeData = {
      ...req.body,
      user_id: req.user.id,
    };
    
    const store = await storeService.createStore(storeData);

    res.status(201).json({
      success: true,
      data: store,
      message: 'Store created successfully',
    });
  }
);

/**
 * GET /stores/check/:username
 * Check username availability
 */
export const checkUsernameAvailability = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username = validateParam(req.params.username, 'Username');
    const available = await storeService.checkUsernameAvailability(username);

    res.json({
      success: true,
      data: {
        username,
        available,
      },
    });
  }
);

/**
 * GET /stores/my-stores
 * Get user's stores
 */
export const getMyStores = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const stores = await storeService.getUserStores(req.user.id);

    res.json({
      success: true,
      data: stores,
    });
  }
);

/**
 * GET /stores/:username
 * Get store by username (public)
 */
export const getStoreByUsername = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username = validateParam(req.params.username, 'Username');
    const store = await storeService.getStoreByUsername(username);

    if (!store) {
      throw errors.notFound('Store');
    }

    res.json({
      success: true,
      data: store,
    });
  }
);

/**
 * PUT /stores/:storeId
 * Update store
 */
export const updateStore = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    const store = await storeService.updateStore(storeId, req.user.id, req.body);

    res.json({
      success: true,
      data: store,
      message: 'Store updated successfully',
    });
  }
);

/**
 * DELETE /stores/:storeId
 * Delete store
 */
export const deleteStore = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    await storeService.deleteStore(storeId, req.user.id);

    res.json({
      success: true,
      message: 'Store deleted successfully',
    });
  }
);

/**
 * PATCH /stores/:storeId/status
 * Toggle store status
 */
export const toggleStoreStatus = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const storeId = validateParam(req.params.storeId, 'Store ID');
    const { is_active } = req.body;

    if (is_active === undefined) {
      throw errors.badRequest('is_active field is required');
    }

    const store = await storeService.toggleStoreStatus(storeId, req.user.id, is_active);

    res.json({
      success: true,
      data: store,
      message: `Store ${is_active ? 'activated' : 'deactivated'} successfully`,
    });
  }
);