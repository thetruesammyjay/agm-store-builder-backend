/**
 * AGM Store Builder - User Types
 * Types for user-related operations
 */

/**
 * User (Full database model)
 */
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
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * User Public (No sensitive data)
 */
export interface UserPublic {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  full_name: string;
  phone: string;
  avatar_url: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: Date;
}

/**
 * Create User Data
 */
export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

/**
 * Update User Data
 */
export interface UpdateUserData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

/**
 * Update Password Data
 */
export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
}

/**
 * OTP Verification
 */
export interface OtpVerification {
  id: string;
  email: string | null;
  phone: string | null;
  code: string;
  type: 'email' | 'phone';
  purpose: 'signup' | 'login' | 'password_reset';
  verified: boolean;
  verified_at: Date | null;
  attempts: number;
  expires_at: Date;
  created_at: Date;
}

/**
 * OTP Types
 */
export type OtpType = 'email' | 'phone';
export type OtpPurpose = 'signup' | 'login' | 'password_reset';

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup Response
 */
export interface SignupResponse {
  user: UserPublic;
  message: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  user: UserPublic;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string | number;
  };
}

/**
 * Verify OTP Response
 */
export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

/**
 * User Session
 */
export interface UserSession {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
}