/**
 * AGM Store Builder - OTP Verification Model
 * Database operations for OTP codes
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

export interface OtpVerification {
  id: string;
  email: string | null;
  phone: string | null;
  code: string;
  type: 'email' | 'phone';
  expires_at: string;
  verified: boolean;
  created_at: string;
}

export interface CreateOtpData {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
  code: string;
  expiresIn?: number; // Minutes, default 10
}

/**
 * Create a new OTP verification
 */
export async function createOtp(data: CreateOtpData): Promise<OtpVerification> {
  const id = uuid();
  const expiresIn = data.expiresIn || 10; // Default 10 minutes
  const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

  await db.query(
    `INSERT INTO otp_verifications (id, email, phone, code, type, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.email || null,
      data.phone || null,
      data.code,
      data.type,
      expiresAt,
    ]
  );

  const otp = await findOtpById(id);
  if (!otp) {
    throw new Error('Failed to create OTP');
  }

  return otp;
}

/**
 * Find OTP by ID
 */
export async function findOtpById(id: string): Promise<OtpVerification | null> {
  return await db.queryOne<any>(
    'SELECT * FROM otp_verifications WHERE id = ?',
    [id]
  ) as OtpVerification | null;
}

/**
 * Find latest OTP by email
 */
export async function findLatestOtpByEmail(email: string): Promise<OtpVerification | null> {
  return await db.queryOne<any>(
    `SELECT * FROM otp_verifications 
     WHERE email = ? AND type = 'email' AND verified = FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [email]
  ) as OtpVerification | null;
}

/**
 * Find latest OTP by phone
 */
export async function findLatestOtpByPhone(phone: string): Promise<OtpVerification | null> {
  return await db.queryOne<any>(
    `SELECT * FROM otp_verifications 
     WHERE phone = ? AND type = 'phone' AND verified = FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [phone]
  ) as OtpVerification | null;
}

/**
 * Verify OTP code
 */
export async function verifyOtp(
  identifier: string,
  code: string,
  type: 'email' | 'phone'
): Promise<boolean> {
  const field = type === 'email' ? 'email' : 'phone';
  
  const otp = await db.queryOne<any>(
    `SELECT * FROM otp_verifications 
     WHERE ${field} = ? AND code = ? AND type = ? AND verified = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [identifier, code, type]
  );

  if (!otp) {
    return false;
  }

  // Mark as verified
  await db.query(
    'UPDATE otp_verifications SET verified = TRUE WHERE id = ?',
    [otp.id]
  );

  return true;
}

/**
 * Check if OTP is valid (not expired and not verified)
 */
export async function isOtpValid(
  identifier: string,
  code: string,
  type: 'email' | 'phone'
): Promise<boolean> {
  const field = type === 'email' ? 'email' : 'phone';
  
  const result = await db.queryOne<any>(
    `SELECT COUNT(*) as count FROM otp_verifications 
     WHERE ${field} = ? AND code = ? AND type = ? AND verified = FALSE AND expires_at > NOW()`,
    [identifier, code, type]
  );

  return (result?.count ?? 0) > 0;
}

/**
 * Delete old OTPs (cleanup)
 */
export async function deleteExpiredOtps(): Promise<number> {
  const result = await db.query(
    'DELETE FROM otp_verifications WHERE expires_at < NOW() OR verified = TRUE'
  );

  return (result as any).affectedRows || 0;
}

/**
 * Delete all OTPs for an identifier
 */
export async function deleteOtpsByIdentifier(
  identifier: string,
  type: 'email' | 'phone'
): Promise<void> {
  const field = type === 'email' ? 'email' : 'phone';
  await db.query(
    `DELETE FROM otp_verifications WHERE ${field} = ? AND type = ?`,
    [identifier, type]
  );
}