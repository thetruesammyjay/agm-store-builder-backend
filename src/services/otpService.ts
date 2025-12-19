/**
 * AGM Store Builder - OTP Service
 * Handles OTP generation, verification, and storage
 */

import { db } from '../database/connection';
import { config } from '../config/env';
import { v4 as uuid } from 'uuid';

export type OtpType = 'email' | 'phone';
export type OtpPurpose = 'signup' | 'login' | 'password_reset';

interface OtpRecord {
  id: string;
  email: string | null;
  phone: string | null;
  code: string;
  type: OtpType;
  purpose: OtpPurpose;
  verified: boolean;
  attempts: number;
  expires_at: string;
  created_at: string;
}

/**
 * Generate random OTP code
 */
function generateOtpCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

/**
 * Create OTP for email
 */
export async function createEmailOtp(
  email: string,
  purpose: OtpPurpose = 'signup'
): Promise<{ code: string; expiresAt: Date }> {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

  await db.query(
    `INSERT INTO otp_verifications (id, email, code, type, purpose, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuid(), email, code, 'email', purpose, expiresAt]
  );

  return { code, expiresAt };
}

/**
 * Create OTP for phone
 */
export async function createPhoneOtp(
  phone: string,
  purpose: OtpPurpose = 'signup'
): Promise<{ code: string; expiresAt: Date }> {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

  await db.query(
    `INSERT INTO otp_verifications (id, phone, code, type, purpose, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuid(), phone, code, 'phone', purpose, expiresAt]
  );

  return { code, expiresAt };
}

/**
 * Verify email OTP
 */
export async function verifyEmailOtp(
  email: string,
  code: string,
  purpose: OtpPurpose = 'signup'
): Promise<{ valid: boolean; message: string }> {
  // Get the most recent OTP for this email and purpose
  const otp = await db.queryOne<any>(
    `SELECT * FROM otp_verifications
     WHERE email = ? AND type = 'email' AND purpose = ? AND verified = FALSE
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, purpose]
  ) as OtpRecord | null;

  if (!otp) {
    return { valid: false, message: 'No OTP found for this email' };
  }

  // Check if OTP is expired
  if (new Date() > new Date(otp.expires_at)) {
    return { valid: false, message: 'OTP has expired' };
  }

  // Check if too many attempts
  if (otp.attempts >= 3) {
    return { valid: false, message: 'Too many failed attempts' };
  }

  // Verify code
  if (otp.code !== code) {
    // Increment attempts
    await db.query(
      'UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ?',
      [otp.id]
    );
    return { valid: false, message: 'Invalid OTP code' };
  }

  // Mark as verified
  await db.query(
    'UPDATE otp_verifications SET verified = TRUE, verified_at = NOW() WHERE id = ?',
    [otp.id]
  );

  return { valid: true, message: 'OTP verified successfully' };
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOtp(
  phone: string,
  code: string,
  purpose: OtpPurpose = 'signup'
): Promise<{ valid: boolean; message: string }> {
  // Get the most recent OTP for this phone and purpose
  const otp = await db.queryOne<any>(
    `SELECT * FROM otp_verifications
     WHERE phone = ? AND type = 'phone' AND purpose = ? AND verified = FALSE
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone, purpose]
  ) as OtpRecord | null;

  if (!otp) {
    return { valid: false, message: 'No OTP found for this phone number' };
  }

  // Check if OTP is expired
  if (new Date() > new Date(otp.expires_at)) {
    return { valid: false, message: 'OTP has expired' };
  }

  // Check if too many attempts
  if (otp.attempts >= 3) {
    return { valid: false, message: 'Too many failed attempts' };
  }

  // Verify code
  if (otp.code !== code) {
    // Increment attempts
    await db.query(
      'UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ?',
      [otp.id]
    );
    return { valid: false, message: 'Invalid OTP code' };
  }

  // Mark as verified
  await db.query(
    'UPDATE otp_verifications SET verified = TRUE, verified_at = NOW() WHERE id = ?',
    [otp.id]
  );

  return { valid: true, message: 'OTP verified successfully' };
}

/**
 * Check if email OTP was recently verified
 */
export async function isEmailOtpVerified(
  email: string,
  purpose: OtpPurpose,
  withinMinutes: number = 10
): Promise<boolean> {
  const cutoffTime = new Date(Date.now() - withinMinutes * 60 * 1000);

  const otp = await db.queryOne<any>(
    `SELECT * FROM otp_verifications
     WHERE email = ? AND type = 'email' AND purpose = ? AND verified = TRUE AND verified_at >= ?
     ORDER BY verified_at DESC
     LIMIT 1`,
    [email, purpose, cutoffTime]
  ) as OtpRecord | null;

  return !!otp;
}

/**
 * Check if phone OTP was recently verified
 */
export async function isPhoneOtpVerified(
  phone: string,
  purpose: OtpPurpose,
  withinMinutes: number = 10
): Promise<boolean> {
  const cutoffTime = new Date(Date.now() - withinMinutes * 60 * 1000);

  const otp = await db.queryOne<any>(
    `SELECT * FROM otp_verifications
     WHERE phone = ? AND type = 'phone' AND purpose = ? AND verified = TRUE AND verified_at >= ?
     ORDER BY verified_at DESC
     LIMIT 1`,
    [phone, purpose, cutoffTime]
  ) as OtpRecord | null;

  return !!otp;
}

/**
 * Clean up expired OTPs (run periodically)
 */
export async function cleanupExpiredOtps(): Promise<number> {
  const result = await db.delete(
    'DELETE FROM otp_verifications WHERE expires_at < NOW() OR verified = TRUE',
    []
  );
  return result;
}