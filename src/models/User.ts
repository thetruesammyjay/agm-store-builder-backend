/**
 * AGM Store Builder - User Model
 * Database operations for users
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';
import { hashPassword, verifyPassword } from '../utils/bcrypt';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  password_hash: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const id = uuid();
  const passwordHash = await hashPassword(data.password);

  await db.query(
    `INSERT INTO users (id, email, password_hash, full_name, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.email, passwordHash, data.full_name, data.phone]
  );

  const user = await findUserById(id);
  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  return await db.queryOne<any>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  ) as User | null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return await db.queryOne<any>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  ) as User | null;
}

/**
 * Find user by phone
 */
export async function findUserByPhone(phone: string): Promise<User | null> {
  return await db.queryOne<any>(
    'SELECT * FROM users WHERE phone = ?',
    [phone]
  ) as User | null;
}

/**
 * Check if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const result = await db.queryOne<any>(
    'SELECT COUNT(*) as count FROM users WHERE email = ?',
    [email]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Check if phone exists
 */
export async function phoneExists(phone: string): Promise<boolean> {
  const result = await db.queryOne<any>(
    'SELECT COUNT(*) as count FROM users WHERE phone = ?',
    [phone]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Verify user password
 */
export async function verifyUserPassword(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Update user email verification status
 */
export async function markEmailAsVerified(userId: string): Promise<void> {
  await db.query(
    'UPDATE users SET email_verified = TRUE WHERE id = ?',
    [userId]
  );
}

/**
 * Update user phone verification status
 */
export async function markPhoneAsVerified(userId: string): Promise<void> {
  await db.query(
    'UPDATE users SET phone_verified = TRUE WHERE id = ?',
    [userId]
  );
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await db.query(
    'UPDATE users SET last_login_at = NOW() WHERE id = ?',
    [userId]
  );
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  await db.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, userId]
  );
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<{
    full_name: string;
    phone: string;
    avatar_url: string;
  }>
): Promise<User | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.full_name) {
    updates.push('full_name = ?');
    values.push(data.full_name);
  }

  if (data.phone) {
    updates.push('phone = ?');
    values.push(data.phone);
  }

  if (data.avatar_url !== undefined) {
    updates.push('avatar_url = ?');
    values.push(data.avatar_url);
  }

  if (updates.length === 0) {
    return await findUserById(userId);
  }

  values.push(userId);

  await db.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  return await findUserById(userId);
}

/**
 * Deactivate user account
 */
export async function deactivateUser(userId: string): Promise<void> {
  await db.query(
    'UPDATE users SET is_active = FALSE WHERE id = ?',
    [userId]
  );
}

/**
 * Activate user account
 */
export async function activateUser(userId: string): Promise<void> {
  await db.query(
    'UPDATE users SET is_active = TRUE WHERE id = ?',
    [userId]
  );
}

/**
 * Convert user to public format (remove sensitive data)
 */
export function toPublicUser(user: User): UserPublic {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    email_verified: user.email_verified,
    phone_verified: user.phone_verified,
    created_at: user.created_at,
  };
}