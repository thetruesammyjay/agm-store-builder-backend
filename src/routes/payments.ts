/**
 * AGM Store Builder - Payment Routes
 * Payment endpoints
 */

import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  addBankAccountSchema,
} from '../validators/paymentValidator';

const router = Router();

/**
 * GET /payments/verify/:reference
 * Verify payment status (public)
 */
router.get(
  '/verify/:reference',
  rateLimiter,
  paymentController.verifyPayment
);

/**
 * GET /payments/:reference
 * Get payment details (public)
 */
router.get(
  '/:reference',
  rateLimiter,
  paymentController.getPayment
);

/**
 * POST /payments/bank-accounts
 * Add bank account (protected)
 */
router.post(
  '/bank-accounts',
  authenticate,
  rateLimiter,
  validateBody(addBankAccountSchema),
  paymentController.addBankAccount
);

/**
 * GET /payments/bank-accounts
 * List bank accounts (protected)
 */
router.get(
  '/bank-accounts',
  authenticate,
  rateLimiter,
  paymentController.listBankAccounts
);

/**
 * DELETE /payments/bank-accounts/:accountId
 * Delete bank account (protected)
 */
router.delete(
  '/bank-accounts/:accountId',
  authenticate,
  rateLimiter,
  paymentController.deleteBankAccount
);

/**
 * PATCH /payments/bank-accounts/:accountId/primary
 * Set primary bank account (protected)
 */
router.patch(
  '/bank-accounts/:accountId/primary',
  authenticate,
  rateLimiter,
  paymentController.setPrimaryBankAccount
);

/**
 * GET /payments/banks
 * Get list of Nigerian banks (public)
 */
router.get(
  '/banks',
  rateLimiter,
  paymentController.getNigerianBanks
);

export default router;