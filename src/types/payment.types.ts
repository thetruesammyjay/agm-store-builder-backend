/**
 * AGM Store Builder - Payment Types
 * Types for payment operations (excluding Monnify-specific)
 */

import { PaymentStatus } from './order.types';

/**
 * Payment Method
 */
export type PaymentMethod = 'monnify' | 'bank_transfer' | 'cash' | 'card';

/**
 * Payment (Full database model)
 */
export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  reference: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  monnify_reference: string | null;
  paid_at: Date | null;
  metadata: PaymentMetadata | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Payment Metadata
 */
export interface PaymentMetadata {
  cardType?: string;
  cardLast4?: string;
  bank?: string;
  accountNumber?: string;
  [key: string]: any;
}

/**
 * Create Payment Data
 */
export interface CreatePaymentData {
  order_id: string;
  amount: number;
  payment_method?: PaymentMethod;
  reference?: string;
  monnify_reference?: string;
}

/**
 * Update Payment Data
 */
export interface UpdatePaymentData {
  status?: PaymentStatus;
  paid_at?: Date;
  metadata?: PaymentMetadata;
}

/**
 * Payment Verification Result
 */
export interface PaymentVerificationResult {
  payment: Payment;
  verified: boolean;
  status: PaymentStatus;
  message?: string;
}

/**
 * Bank Account
 */
export interface BankAccount {
  id: string;
  user_id: string;
  account_number: string;
  bank_code: string;
  account_name: string;
  bank_name: string;
  is_primary: boolean;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create Bank Account Data
 */
export interface CreateBankAccountData {
  user_id: string;
  account_number: string;
  bank_code: string;
  account_name: string;
  bank_name: string;
}

/**
 * Bank
 */
export interface Bank {
  name: string;
  code: string;
  ussdTemplate?: string;
  baseUssdCode?: string;
  transferUssdTemplate?: string;
}

/**
 * Bank Account Verification
 */
export interface BankAccountVerification {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  verified: boolean;
}

/**
 * Payout
 */
export interface Payout {
  id: string;
  user_id: string;
  bank_account_id: string;
  amount: number;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  monnify_reference: string | null;
  processed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create Payout Data
 */
export interface CreatePayoutData {
  user_id: string;
  bank_account_id: string;
  amount: number;
  reference?: string;
}

/**
 * Payout Stats
 */
export interface PayoutStats {
  totalPayouts: number;
  pendingPayouts: number;
  completedPayouts: number;
  failedPayouts: number;
  totalAmount: number;
  pendingAmount: number;
}

/**
 * Transaction
 */
export interface Transaction {
  id: string;
  user_id: string;
  type: 'payment' | 'payout' | 'refund' | 'fee';
  amount: number;
  reference: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

/**
 * Payment Gateway Response
 */
export interface PaymentGatewayResponse {
  success: boolean;
  reference: string;
  checkoutUrl?: string;
  message?: string;
  error?: string;
}