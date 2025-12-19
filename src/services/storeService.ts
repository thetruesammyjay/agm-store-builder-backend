/**
 * AGM Store Builder - Store Service
 * Business logic for store management
 */

import {
  createStore as createStoreModel,
  findStoreById,
  findStoreByUsername,
  findStoresByUserId,
  usernameExists,
  updateStore as updateStoreModel,
  deleteStore as deleteStoreModel,
  toggleStoreStatus as toggleStoreStatusModel,
  Store,
  CreateStoreData,
} from '../models/Store';
import { errors } from '../middleware/errorHandler';
import { slugify } from '../utils/slugify';

/**
 * Create a new store
 */
export async function createStore(data: CreateStoreData): Promise<Store> {
  // Check if username already exists
  if (await usernameExists(data.username)) {
    throw errors.conflict('Username is already taken');
  }

  // Validate username format
  const username = slugify(data.username);
  if (username !== data.username) {
    throw errors.badRequest('Username must be lowercase with only letters, numbers, and hyphens');
  }

  // Create store
  const store = await createStoreModel(data);
  return store;
}

/**
 * Check username availability
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  return !(await usernameExists(username));
}

/**
 * Get user's stores
 */
export async function getUserStores(userId: string): Promise<Store[]> {
  return await findStoresByUserId(userId);
}

/**
 * Get store by username
 */
export async function getStoreByUsername(username: string): Promise<Store | null> {
  const store = await findStoreByUsername(username);

  if (!store) {
    throw errors.notFound('Store');
  }

  // Only return active stores for public access
  if (!store.is_active) {
    throw errors.notFound('Store');
  }

  return store;
}

/**
 * Update store
 */
export async function updateStore(
  storeId: string,
  userId: string,
  data: Partial<CreateStoreData>
): Promise<Store> {
  const store = await findStoreById(storeId);

  if (!store) {
    throw errors.notFound('Store');
  }

  // Verify ownership
  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to update this store');
  }

  const updatedStore = await updateStoreModel(storeId, data);

  if (!updatedStore) {
    throw errors.notFound('Store');
  }

  return updatedStore;
}

/**
 * Delete store
 */
export async function deleteStore(storeId: string, userId: string): Promise<void> {
  const store = await findStoreById(storeId);

  if (!store) {
    throw errors.notFound('Store');
  }

  // Verify ownership
  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to delete this store');
  }

  await deleteStoreModel(storeId);
}

/**
 * Toggle store active status
 */
export async function toggleStoreStatus(
  storeId: string,
  userId: string,
  isActive: boolean
): Promise<Store> {
  const store = await findStoreById(storeId);

  if (!store) {
    throw errors.notFound('Store');
  }

  // Verify ownership
  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to modify this store');
  }

  await toggleStoreStatusModel(storeId, isActive);

  const updatedStore = await findStoreById(storeId);
  if (!updatedStore) {
    throw errors.notFound('Store');
  }

  return updatedStore;
}