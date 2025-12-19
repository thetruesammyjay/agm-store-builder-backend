/**
 * AGM Store Builder - Auth Service
 * Business logic for authentication
 */

import {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  verifyUserPassword,
  markEmailAsVerified,
  markPhoneAsVerified,
  updateLastLogin,
  emailExists,
  phoneExists,
  CreateUserData,
  toPublicUser,
  UserPublic,
} from '../models/User';
import {
  createEmailOtp,
  createPhoneOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
} from './otpService';
import { generateTokenPair, TokenPair } from '../utils/jwt';
import { errors } from '../middleware/errorHandler';

export interface SignupResult {
  user: UserPublic;
  message: string;
}

export interface LoginResult {
  user: UserPublic;
  tokens: TokenPair;
}

/**
 * Register a new user
 */
export async function signup(data: CreateUserData): Promise<SignupResult> {
  // Check if email already exists
  if (await emailExists(data.email)) {
    throw errors.conflict('Email is already registered');
  }

  // Check if phone already exists
  if (await phoneExists(data.phone)) {
    throw errors.conflict('Phone number is already registered');
  }

  // Create user
  const user = await createUser(data);

  // Send verification OTPs
  const emailOtp = await createEmailOtp(data.email, 'signup');
  const phoneOtp = await createPhoneOtp(data.phone, 'signup');

  // TODO: Send email and SMS with OTP codes
  // await sendEmailOtp(data.email, emailOtp.code);
  // await sendSmsOtp(data.phone, phoneOtp.code);

  console.log('📧 Email OTP:', emailOtp.code); // For development
  console.log('📱 Phone OTP:', phoneOtp.code); // For development

  return {
    user: toPublicUser(user),
    message: 'Account created successfully. Please verify your email and phone.',
  };
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  // Verify credentials
  const user = await verifyUserPassword(email, password);

  if (!user) {
    throw errors.unauthorized('Invalid email or password');
  }

  if (!user.is_active) {
    throw errors.unauthorized('Account is inactive');
  }

  // Update last login
  await updateLastLogin(user.id);

  // Generate tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
  });

  return {
    user: toPublicUser(user),
    tokens,
  };
}

/**
 * Verify email OTP
 */
export async function verifyEmail(
  email: string,
  code: string
): Promise<{ verified: boolean; message: string }> {
  // Verify OTP
  const result = await verifyEmailOtp(email, code, 'signup');

  if (!result.valid) {
    return { verified: false, message: result.message };
  }

  // Mark email as verified
  const user = await findUserByEmail(email);
  if (user) {
    await markEmailAsVerified(user.id);
  }

  return { verified: true, message: 'Email verified successfully' };
}

/**
 * Verify phone OTP
 */
export async function verifyPhone(
  phone: string,
  code: string
): Promise<{ verified: boolean; message: string }> {
  // Verify OTP
  const result = await verifyPhoneOtp(phone, code, 'signup');

  if (!result.valid) {
    return { verified: false, message: result.message };
  }

  // Mark phone as verified
  const user = await findUserByPhone(phone);
  if (user) {
    await markPhoneAsVerified(user.id);
  }

  return { verified: true, message: 'Phone verified successfully' };
}

/**
 * Resend email OTP
 */
export async function resendEmailOtp(email: string): Promise<{ message: string }> {
  const user = await findUserByEmail(email);

  if (!user) {
    throw errors.notFound('User');
  }

  if (user.email_verified) {
    return { message: 'Email is already verified' };
  }

  const emailOtp = await createEmailOtp(email, 'signup');

  // TODO: Send email with OTP
  // await sendEmailOtp(email, emailOtp.code);

  console.log('📧 Email OTP:', emailOtp.code); // For development

  return { message: 'Verification code sent to your email' };
}

/**
 * Resend phone OTP
 */
export async function resendPhoneOtp(phone: string): Promise<{ message: string }> {
  const user = await findUserByPhone(phone);

  if (!user) {
    throw errors.notFound('User');
  }

  if (user.phone_verified) {
    return { message: 'Phone is already verified' };
  }

  const phoneOtp = await createPhoneOtp(phone, 'signup');

  // TODO: Send SMS with OTP
  // await sendSmsOtp(phone, phoneOtp.code);

  console.log('📱 Phone OTP:', phoneOtp.code); // For development

  return { message: 'Verification code sent to your phone' };
}

/**
 * Get authenticated user profile
 */
export async function getMe(userId: string): Promise<UserPublic> {
  const user = await findUserById(userId);

  if (!user) {
    throw errors.notFound('User');
  }

  return toPublicUser(user);
}