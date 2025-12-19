/**
 * AGM Store Builder - Store Routes
 * Store management endpoints
 */

import { Router } from 'express';
import * as storeController from '../controllers/storeController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  createStoreSchema,
  updateStoreSchema,
  usernameSchema,
} from '../validators/storeValidator';

const router = Router();

/**
 * GET /stores/check/:username
 * Check if username is available (public)
 */
router.get(
  '/check/:username',
  rateLimiter,
  validateParams(usernameSchema),
  storeController.checkUsernameAvailability
);

/**
 * POST /stores
 * Create a new store (protected)
 */
router.post(
  '/',
  authenticate,
  rateLimiter,
  validateBody(createStoreSchema),
  storeController.createStore
);

/**
 * GET /stores/my-stores
 * Get user's stores (protected)
 */
router.get(
  '/my-stores',
  authenticate,
  rateLimiter,
  storeController.getMyStores
);

/**
 * GET /stores/:username
 * Get store by username (public)
 */
router.get(
  '/:username',
  rateLimiter,
  storeController.getStoreByUsername
);

/**
 * PUT /stores/:storeId
 * Update store (protected)
 */
router.put(
  '/:storeId',
  authenticate,
  rateLimiter,
  validateBody(updateStoreSchema),
  storeController.updateStore
);

/**
 * DELETE /stores/:storeId
 * Delete store (protected)
 */
router.delete(
  '/:storeId',
  authenticate,
  rateLimiter,
  storeController.deleteStore
);

/**
 * PATCH /stores/:storeId/status
 * Toggle store active status (protected)
 */
router.patch(
  '/:storeId/status',
  authenticate,
  rateLimiter,
  storeController.toggleStoreStatus
);

export default router;