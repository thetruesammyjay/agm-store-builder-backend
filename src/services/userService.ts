/**
 * AGM Store Builder - User Service
 * Business logic for user management
 */

import {
  findUserById,
  updateUserProfile,
  updateUserPassword,
  deactivateUser,
  toPublicUser,
  UserPublic,
} from '../models/User';
import { verifyPassword } from '../utils/bcrypt';
import { errors } from '../middleware/errorHandler';

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserPublic> {
  const user = await findUserById(userId);

  if (!user) {
    throw errors.notFound('User');
  }

  return toPublicUser(user);
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }
): Promise<UserPublic> {
  const user = await updateUserProfile(userId, data);

  if (!user) {
    throw errors.notFound('User');
  }

  return toPublicUser(user);
}

/**
 * Update user password
 */
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await findUserById(userId);

  if (!user) {
    throw errors.notFound('User');
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, user.password_hash);
  if (!isValid) {
    throw errors.unauthorized('Current password is incorrect');
  }

  // Update password
  await updateUserPassword(userId, newPassword);
}

/**
 * Deactivate user account
 */
export async function deactivateAccount(userId: string): Promise<void> {
  const user = await findUserById(userId);

  if (!user) {
    throw errors.notFound('User');
  }

  await deactivateUser(userId);
}

/**
 * Update user avatar
 */
export async function updateAvatar(
  userId: string,
  avatarUrl: string
): Promise<UserPublic> {
  const user = await updateUserProfile(userId, { avatar_url: avatarUrl });

  if (!user) {
    throw errors.notFound('User');
  }

  return toPublicUser(user);
}