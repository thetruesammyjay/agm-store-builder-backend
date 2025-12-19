/**
 * AGM Store Builder - Bank Account Model
 * Database operations for bank accounts
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

export interface BankAccount {
  id: string;
  user_id: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
  is_verified: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBankAccountData {
  user_id: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
}

/**
 * Create a new bank account
 */
export async function createBankAccount(data: CreateBankAccountData): Promise<BankAccount> {
  const id = uuid();

  // Check if this is the user's first bank account
  const existingAccounts = await findBankAccountsByUserId(data.user_id);
  const isPrimary = existingAccounts.length === 0;

  await db.query(
    `INSERT INTO bank_accounts (
      id, user_id, account_number, account_name, bank_code, bank_name, is_primary
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.user_id,
      data.account_number,
      data.account_name,
      data.bank_code,
      data.bank_name,
      isPrimary,
    ]
  );

  const account = await findBankAccountById(id);
  if (!account) {
    throw new Error('Failed to create bank account');
  }

  return account;
}

/**
 * Find bank account by ID
 */
export async function findBankAccountById(id: string): Promise<BankAccount | null> {
  return await db.queryOne<any>(
    'SELECT * FROM bank_accounts WHERE id = ?',
    [id]
  ) as BankAccount | null;
}

/**
 * Find bank accounts by user ID
 */
export async function findBankAccountsByUserId(userId: string): Promise<BankAccount[]> {
  return await db.query<any>(
    'SELECT * FROM bank_accounts WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC',
    [userId]
  ) as BankAccount[];
}

/**
 * Find primary bank account
 */
export async function findPrimaryBankAccount(userId: string): Promise<BankAccount | null> {
  return await db.queryOne<any>(
    'SELECT * FROM bank_accounts WHERE user_id = ? AND is_primary = TRUE',
    [userId]
  ) as BankAccount | null;
}

/**
 * Check if account number exists for user
 */
export async function accountNumberExists(
  userId: string,
  accountNumber: string
): Promise<boolean> {
  const result = await db.queryOne<any>(
    'SELECT COUNT(*) as count FROM bank_accounts WHERE user_id = ? AND account_number = ?',
    [userId, accountNumber]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Mark bank account as verified
 */
export async function markAccountAsVerified(accountId: string): Promise<BankAccount | null> {
  await db.query(
    'UPDATE bank_accounts SET is_verified = TRUE, updated_at = NOW() WHERE id = ?',
    [accountId]
  );

  return await findBankAccountById(accountId);
}

/**
 * Set primary bank account
 */
export async function setPrimaryBankAccount(
  userId: string,
  accountId: string
): Promise<BankAccount | null> {
  // First, unset all primary accounts for this user
  await db.query(
    'UPDATE bank_accounts SET is_primary = FALSE, updated_at = NOW() WHERE user_id = ?',
    [userId]
  );

  // Then set the new primary account
  await db.query(
    'UPDATE bank_accounts SET is_primary = TRUE, updated_at = NOW() WHERE id = ?',
    [accountId]
  );

  return await findBankAccountById(accountId);
}

/**
 * Delete bank account
 */
export async function deleteBankAccount(accountId: string): Promise<void> {
  await db.query('DELETE FROM bank_accounts WHERE id = ?', [accountId]);
}