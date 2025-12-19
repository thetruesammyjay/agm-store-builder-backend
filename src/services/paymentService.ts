/**
 * AGM Store Builder - Payment Service
 * Business logic for payment operations
 */

import {
  createPayment as createPaymentModel,
  findPaymentById,
  findPaymentByReference,
  updatePaymentStatus as updatePaymentStatusModel,
  Payment,
  PaymentStatus,
} from '../models/Payment';
import {
  createBankAccount,
  findBankAccountsByUserId,
  findBankAccountById,
  deleteBankAccount as deleteBankAccountModel,
  setPrimaryBankAccount as setPrimaryBankAccountModel,
  BankAccount,
  CreateBankAccountData,
} from '../models/BankAccount';
import { updateOrderPaymentStatus } from '../models/Order';
import * as monnifyService from './monnifyService';
import { errors } from '../middleware/errorHandler';

/**
 * Initialize payment for an order
 */
export async function initializePayment(
  orderId: string,
  amount: number,
  userId: string
): Promise<any> {
  // Create payment record
  const paymentReference = `ORD-${orderId}-${Date.now()}`;

  const monnifyResponse = await monnifyService.initializePayment({
    amount,
    customerEmail: 'customer@email.com', // Get from order
    customerName: 'Customer Name', // Get from order
    paymentDescription: `Order payment for ${orderId}`,
  });

  const payment = await createPaymentModel({
    order_id: orderId,
    user_id: userId,
    amount,
    payment_reference: paymentReference,
    monnify_reference: monnifyResponse.transactionReference,
  });

  return {
    payment,
    accountDetails: {
      accountNumber: monnifyResponse.responseBody?.accountNumber,
      accountName: monnifyResponse.responseBody?.accountName,
      bankName: monnifyResponse.responseBody?.bankName,
      amount: monnifyResponse.responseBody?.amount,
      reference: monnifyResponse.transactionReference,
    },
  };
}

/**
 * Verify payment status
 */
export async function verifyPayment(reference: string): Promise<{
  verified: boolean;
  status: PaymentStatus;
  payment: Payment | null;
}> {
  const payment = await findPaymentByReference(reference);

  if (!payment) {
    throw errors.notFound('Payment');
  }

  // If already paid, return cached status
  if (payment.status === 'paid') {
    return {
      verified: true,
      status: 'paid',
      payment,
    };
  }

  // Verify with Monnify
  const verification = await monnifyService.verifyPayment(payment.monnify_reference || reference);

  let newStatus: PaymentStatus = 'pending';

  if (verification.responseBody?.paymentStatus === 'PAID') {
    newStatus = 'paid';
  } else if (verification.responseBody?.paymentStatus === 'FAILED') {
    newStatus = 'failed';
  } else if (verification.responseBody?.paymentStatus === 'EXPIRED') {
    newStatus = 'expired';
  }

  // Update payment status
  if (newStatus !== payment.status) {
    await updatePaymentStatusModel(payment.id, newStatus);

    // Update order payment status
    if (newStatus === 'paid') {
      await updateOrderPaymentStatus(payment.order_id, 'paid');
    }
  }

  const updatedPayment = await findPaymentById(payment.id);

  return {
    verified: newStatus === 'paid',
    status: newStatus,
    payment: updatedPayment,
  };
}

/**
 * Get payment by reference
 */
export async function getPaymentByReference(reference: string): Promise<Payment | null> {
  return await findPaymentByReference(reference);
}

/**
 * Add bank account
 */
export async function addBankAccount(
  userId: string,
  data: CreateBankAccountData
): Promise<BankAccount> {
  const account = await createBankAccount({
    ...data,
    user_id: userId,
  });

  return account;
}

/**
 * Get user's bank accounts
 */
export async function getUserBankAccounts(userId: string): Promise<BankAccount[]> {
  return await findBankAccountsByUserId(userId);
}

/**
 * Delete bank account
 */
export async function deleteBankAccount(accountId: string, userId: string): Promise<void> {
  const account = await findBankAccountById(accountId);

  if (!account) {
    throw errors.notFound('Bank account');
  }

  if (account.user_id !== userId) {
    throw errors.forbidden('You do not have permission to delete this account');
  }

  if (account.is_primary) {
    throw errors.badRequest('Cannot delete primary bank account');
  }

  await deleteBankAccountModel(accountId);
}

/**
 * Set primary bank account
 */
export async function setPrimaryBankAccount(
  accountId: string,
  userId: string
): Promise<BankAccount> {
  const account = await findBankAccountById(accountId);

  if (!account) {
    throw errors.notFound('Bank account');
  }

  if (account.user_id !== userId) {
    throw errors.forbidden('You do not have permission to modify this account');
  }

  await setPrimaryBankAccountModel(accountId, userId);

  const updatedAccount = await findBankAccountById(accountId);
  return updatedAccount!;
}

/**
 * Get Nigerian banks
 */
export function getNigerianBanks(): any[] {
  return [
    { name: 'Access Bank', code: '044' },
    { name: 'Access Bank (Diamond)', code: '063' },
    { name: 'ALAT by Wema', code: '035' },
    { name: 'ASO Savings and Loans', code: '401' },
    { name: 'Bowen Microfinance Bank', code: '50931' },
    { name: 'Carbon', code: '51251' },
    { name: 'Citibank Nigeria', code: '023' },
    { name: 'Ecobank', code: '050' },
    { name: 'FairMoney Microfinance Bank', code: '51318' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'First Bank', code: '011' },
    { name: 'First City Monument Bank (FCMB)', code: '214' },
    { name: 'Globus Bank', code: '103' },
    { name: 'GTBank', code: '058' },
    { name: 'Hasal Microfinance Bank', code: '50383' },
    { name: 'Heritage Bank', code: '030' },
    { name: 'Jaiz Bank', code: '301' },
    { name: 'Keystone Bank', code: '082' },
    { name: 'Kuda Bank', code: '50211' },
    { name: 'Lotus Bank', code: '303' },
    { name: 'Moniepoint Microfinance Bank', code: '50363' },
    { name: 'OPay', code: '999992' },
    { name: 'Optimus Bank', code: '107' },
    { name: 'PalmPay', code: '999991' },
    { name: 'Parallex Bank', code: '104' },
    { name: 'Polaris Bank', code: '076' },
    { name: 'Premium Trust Bank', code: '105' },
    { name: 'Providus Bank', code: '101' },
    { name: 'Rubies Bank', code: '125' },
    { name: 'Signature Bank', code: '106' },
    { name: 'Sparkle Microfinance Bank', code: '51310' },
    { name: 'Stanbic IBTC', code: '221' },
    { name: 'Standard Chartered Bank', code: '068' },
    { name: 'Sterling Bank', code: '232' },
    { name: 'SunTrust Bank', code: '100' },
    { name: 'TAJ Bank', code: '302' },
    { name: 'Titan Trust Bank', code: '102' },
    { name: 'UBA', code: '033' },
    { name: 'Union Bank', code: '032' },
    { name: 'Unity Bank', code: '215' },
    { name: 'VFD Microfinance Bank', code: '566' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Zenith Bank', code: '057' },
  ];
}
