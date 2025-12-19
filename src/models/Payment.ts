import { query } from '../config/database';
import { v4 as uuid } from 'uuid';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
export type PaymentMethod = 'bank_transfer' | 'card' | 'ussd';

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod | null;
  payment_reference: string;
  monnify_reference: string | null;
  account_number: string | null;
  account_name: string | null;
  bank_name: string | null;
  paid_at: Date | null;
  expires_at: Date | null;
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentData {
  order_id: string;
  user_id: string;
  amount: number;
  currency?: string;
  payment_reference: string;
  monnify_reference?: string;
  account_number?: string;
  account_name?: string;
  bank_name?: string;
  expires_at?: Date;
  metadata?: any;
}

/**
 * Create a new payment record
 */
export async function createPayment(data: CreatePaymentData): Promise<Payment> {
  const id = uuid();

  await query(
    `INSERT INTO payments (
      id, order_id, user_id, amount, currency, status, payment_reference,
      monnify_reference, account_number, account_name, bank_name, expires_at, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.order_id,
      data.user_id,
      data.amount,
      data.currency || 'NGN',
      'pending',
      data.payment_reference,
      data.monnify_reference || null,
      data.account_number || null,
      data.account_name || null,
      data.bank_name || null,
      data.expires_at || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]
  );

  const payment = await findPaymentById(id);
  if (!payment) {
    throw new Error('Failed to create payment');
  }
  return payment;
}

/**
 * Find payment by ID
 */
export async function findPaymentById(id: string): Promise<Payment | null> {
  const rows = await query<any>('SELECT * FROM payments WHERE id = ?', [id]);
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  };
}

/**
 * Find payment by reference
 */
export async function findPaymentByReference(reference: string): Promise<Payment | null> {
  const rows = await query<any>(
    'SELECT * FROM payments WHERE payment_reference = ?',
    [reference]
  );
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  };
}

/**
 * Find payment by Monnify reference
 */
export async function findPaymentByMonnifyReference(reference: string): Promise<Payment | null> {
  const rows = await query<any>(
    'SELECT * FROM payments WHERE monnify_reference = ?',
    [reference]
  );
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  };
}

/**
 * Find payment by order ID
 */
export async function findPaymentByOrderId(orderId: string): Promise<Payment | null> {
  const rows = await query<any>(
    'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
    [orderId]
  );
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
  };
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  paymentMethod?: PaymentMethod
): Promise<void> {
  const updates: string[] = ['status = ?', 'updated_at = NOW()'];
  const values: any[] = [status];

  if (status === 'paid') {
    updates.push('paid_at = NOW()');
  }

  if (paymentMethod) {
    updates.push('payment_method = ?');
    values.push(paymentMethod);
  }

  values.push(id);

  await query(
    `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
}

/**
 * Update payment metadata
 */
export async function updatePaymentMetadata(id: string, metadata: any): Promise<void> {
  await query(
    'UPDATE payments SET metadata = ?, updated_at = NOW() WHERE id = ?',
    [JSON.stringify(metadata), id]
  );
}

/**
 * List payments for a user
 */
export async function findPaymentsByUserId(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ payments: Payment[]; total: number }> {
  const offset = (page - 1) * limit;

  const payments = await query<any>(
    `SELECT * FROM payments 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  const countResults = await query<any>(
    'SELECT COUNT(*) as total FROM payments WHERE user_id = ?',
    [userId]
  );

  const total = countResults[0]?.total || 0;

  return {
    payments: payments.map((p: any) => ({
      ...p,
      metadata: p.metadata ? JSON.parse(p.metadata) : null,
    })),
    total,
  };
}

/**
 * Get payment stats for user
 */
export async function getPaymentStats(userId: string): Promise<{
  totalPaid: number;
  totalPending: number;
  totalFailed: number;
  count: number;
}> {
  const rows = await query<any>(
    `SELECT 
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as totalPaid,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as totalPending,
      SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END) as totalFailed,
      COUNT(*) as count
    FROM payments 
    WHERE user_id = ?`,
    [userId]
  );

  return {
    totalPaid: rows[0]?.totalPaid || 0,
    totalPending: rows[0]?.totalPending || 0,
    totalFailed: rows[0]?.totalFailed || 0,
    count: rows[0]?.count || 0,
  };
}

/**
 * Find expired pending payments
 */
export async function findExpiredPayments(): Promise<Payment[]> {
  const rows = await query<any>(
    `SELECT * FROM payments 
     WHERE status = 'pending' 
     AND expires_at IS NOT NULL 
     AND expires_at < NOW()
     ORDER BY expires_at ASC`,
    []
  );

  return rows.map((p: any) => ({
    ...p,
    metadata: p.metadata ? JSON.parse(p.metadata) : null,
  }));
}

/**
 * Mark payment as expired
 */
export async function markPaymentAsExpired(id: string): Promise<void> {
  await query(
    `UPDATE payments 
     SET status = 'expired', updated_at = NOW() 
     WHERE id = ? AND status = 'pending'`,
    [id]
  );
}