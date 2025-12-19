/**
 * AGM Store Builder - Payment Controller
 * HTTP request handlers for payment operations
 */

import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/paymentService';
import { asyncHandler, errors } from '../middleware/errorHandler';
import { validateParam } from '../utils/validators';

/**
 * GET /payments/verify/:reference
 * Verify payment status
 */
export const verifyPayment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const reference = validateParam(req.params.reference, 'Payment reference');
    const result = await paymentService.verifyPayment(reference);

    res.json({
      success: true,
      data: result,
    });
  }
);

/**
 * GET /payments/:reference
 * Get payment details
 */
export const getPayment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const reference = validateParam(req.params.reference, 'Payment reference');
    const payment = await paymentService.getPaymentByReference(reference);

    if (!payment) {
      throw errors.notFound('Payment');
    }

    res.json({
      success: true,
      data: payment,
    });
  }
);

/**
 * POST /payments/bank-accounts
 * Add bank account
 */
export const addBankAccount = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const accountData = req.body;
    const account = await paymentService.addBankAccount(req.user.id, accountData);

    res.status(201).json({
      success: true,
      data: account,
      message: 'Bank account added successfully',
    });
  }
);

/**
 * GET /payments/bank-accounts
 * List bank accounts
 */
export const listBankAccounts = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const accounts = await paymentService.getUserBankAccounts(req.user.id);

    res.json({
      success: true,
      data: accounts,
    });
  }
);

/**
 * DELETE /payments/bank-accounts/:accountId
 * Delete bank account
 */
export const deleteBankAccount = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const accountId = validateParam(req.params.accountId, 'Account ID');
    await paymentService.deleteBankAccount(accountId, req.user.id);

    res.json({
      success: true,
      message: 'Bank account deleted successfully',
    });
  }
);

/**
 * PUT /payments/bank-accounts/:accountId/primary
 * Set primary bank account
 */
export const setPrimaryBankAccount = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const accountId = validateParam(req.params.accountId, 'Account ID');
    const account = await paymentService.setPrimaryBankAccount(accountId, req.user.id);

    res.json({
      success: true,
      data: account,
      message: 'Primary bank account updated',
    });
  }
);

/**
 * GET /payments/banks
 * Get list of Nigerian banks
 */
export const getNigerianBanks = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const banks = paymentService.getNigerianBanks();

    res.json({
      success: true,
      data: banks,
    });
  }
);