/**
 * AGM Store Builder - Store Model
 * Database operations for stores
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

export interface Store {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  description: string | null;
  logo_url: string | null;
  template_id: 'products' | 'bookings' | 'portfolio';
  custom_colors: CustomColors | null;
  custom_fonts: CustomFonts | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface CustomFonts {
  heading: string;
  body: string;
}

export interface CreateStoreData {
  user_id: string;
  username: string;
  display_name: string;
  description?: string;
  logo_url?: string;
  template_id?: 'products' | 'bookings' | 'portfolio';
  custom_colors?: CustomColors;
  custom_fonts?: CustomFonts;
}

/**
 * Create a new store
 */
export async function createStore(data: CreateStoreData): Promise<Store> {
  const id = uuid();
  
  await db.query(
    `INSERT INTO stores (
      id, user_id, username, display_name, description, 
      logo_url, template_id, custom_colors, custom_fonts
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.user_id,
      data.username,
      data.display_name,
      data.description || null,
      data.logo_url || null,
      data.template_id || 'products',
      data.custom_colors ? JSON.stringify(data.custom_colors) : null,
      data.custom_fonts ? JSON.stringify(data.custom_fonts) : null,
    ]
  );

  const store = await findStoreById(id);
  if (!store) {
    throw new Error('Failed to create store');
  }

  return store;
}

/**
 * Find store by ID
 */
export async function findStoreById(id: string): Promise<Store | null> {
  const store = await db.queryOne<any>(
    'SELECT * FROM stores WHERE id = ?',
    [id]
  );

  return store ? parseStoreJson(store) : null;
}

/**
 * Find store by username
 */
export async function findStoreByUsername(username: string): Promise<Store | null> {
  const store = await db.queryOne<any>(
    'SELECT * FROM stores WHERE username = ?',
    [username]
  );

  return store ? parseStoreJson(store) : null;
}

/**
 * Find stores by user ID
 */
export async function findStoresByUserId(userId: string): Promise<Store[]> {
  const stores = await db.query<any>(
    'SELECT * FROM stores WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  return stores.map(parseStoreJson);
}

/**
 * Check if username exists
 */
export async function usernameExists(username: string): Promise<boolean> {
  const result = await db.queryOne<any>(
    'SELECT COUNT(*) as count FROM stores WHERE username = ?',
    [username]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Update store
 */
export async function updateStore(
  storeId: string,
  data: Partial<{
    display_name: string;
    description: string;
    logo_url: string;
    template_id: 'products' | 'bookings' | 'portfolio';
    custom_colors: CustomColors;
    custom_fonts: CustomFonts;
    is_active: boolean;
  }>
): Promise<Store | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.display_name) {
    updates.push('display_name = ?');
    values.push(data.display_name);
  }

  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }

  if (data.logo_url !== undefined) {
    updates.push('logo_url = ?');
    values.push(data.logo_url);
  }

  if (data.template_id) {
    updates.push('template_id = ?');
    values.push(data.template_id);
  }

  if (data.custom_colors) {
    updates.push('custom_colors = ?');
    values.push(JSON.stringify(data.custom_colors));
  }

  if (data.custom_fonts) {
    updates.push('custom_fonts = ?');
    values.push(JSON.stringify(data.custom_fonts));
  }

  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(data.is_active);
  }

  if (updates.length === 0) {
    return await findStoreById(storeId);
  }

  values.push(storeId);

  await db.query(
    `UPDATE stores SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );

  return await findStoreById(storeId);
}

/**
 * Delete store
 */
export async function deleteStore(storeId: string): Promise<void> {
  await db.query('DELETE FROM stores WHERE id = ?', [storeId]);
}

/**
 * Activate/Deactivate store
 */
export async function toggleStoreStatus(storeId: string, isActive: boolean): Promise<void> {
  await db.query(
    'UPDATE stores SET is_active = ?, updated_at = NOW() WHERE id = ?',
    [isActive, storeId]
  );
}

/**
 * Parse JSON fields from database
 */
function parseStoreJson(store: any): Store {
  return {
    ...store,
    custom_colors: store.custom_colors ? JSON.parse(store.custom_colors) : null,
    custom_fonts: store.custom_fonts ? JSON.parse(store.custom_fonts) : null,
  };
}