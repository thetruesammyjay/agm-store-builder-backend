/**
 * AGM Store Builder - Product Model
 * Database operations for products
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  variations: ProductVariation[] | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  name: string;
  options: string[];
}

export interface CreateProductData {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  variations?: ProductVariation[];
  stock_quantity?: number;
  is_active?: boolean;
}

export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
}

/**
 * Create a new product
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
  const id = uuid();

  await db.query(
    `INSERT INTO products (
      id, store_id, name, description, price, compare_at_price,
      images, variations, stock_quantity, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.store_id,
      data.name,
      data.description || null,
      data.price,
      data.compare_at_price || null,
      JSON.stringify(data.images),
      data.variations ? JSON.stringify(data.variations) : null,
      data.stock_quantity || 0,
      data.is_active !== undefined ? data.is_active : true,
    ]
  );

  const product = await findProductById(id);
  if (!product) {
    throw new Error('Failed to create product');
  }

  return product;
}

/**
 * Find product by ID
 */
export async function findProductById(id: string): Promise<Product | null> {
  const product = await db.queryOne<any>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );

  return product ? parseProductJson(product) : null;
}

/**
 * Find products by store ID
 */
export async function findProductsByStoreId(
  storeId: string,
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit;
  const conditions: string[] = ['store_id = ?'];
  const values: any[] = [storeId];

  // Apply filters
  if (filters?.search) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    const searchTerm = `%${filters.search}%`;
    values.push(searchTerm, searchTerm);
  }

  if (filters?.minPrice !== undefined) {
    conditions.push('price >= ?');
    values.push(filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    conditions.push('price <= ?');
    values.push(filters.maxPrice);
  }

  if (filters?.inStock) {
    conditions.push('stock_quantity > 0');
  }

  if (filters?.isActive !== undefined) {
    conditions.push('is_active = ?');
    values.push(filters.isActive);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countResult = await db.queryOne<any>(
    `SELECT COUNT(*) as total FROM products WHERE ${whereClause}`,
    values
  );
  const total = countResult?.total || 0;

  // Get products
  const products = await db.query<any>(
    `SELECT * FROM products WHERE ${whereClause} 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return {
    products: products.map(parseProductJson),
    total,
  };
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  data: Partial<CreateProductData>
): Promise<Product | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.name) {
    updates.push('name = ?');
    values.push(data.name);
  }

  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }

  if (data.price !== undefined) {
    updates.push('price = ?');
    values.push(data.price);
  }

  if (data.compare_at_price !== undefined) {
    updates.push('compare_at_price = ?');
    values.push(data.compare_at_price);
  }

  if (data.images) {
    updates.push('images = ?');
    values.push(JSON.stringify(data.images));
  }

  if (data.variations !== undefined) {
    updates.push('variations = ?');
    values.push(data.variations ? JSON.stringify(data.variations) : null);
  }

  if (data.stock_quantity !== undefined) {
    updates.push('stock_quantity = ?');
    values.push(data.stock_quantity);
  }

  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(data.is_active);
  }

  if (updates.length === 0) {
    return await findProductById(productId);
  }

  values.push(productId);

  await db.query(
    `UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );

  return await findProductById(productId);
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string): Promise<void> {
  await db.query('DELETE FROM products WHERE id = ?', [productId]);
}

/**
 * Update stock quantity
 */
export async function updateStockQuantity(
  productId: string,
  quantity: number
): Promise<void> {
  await db.query(
    'UPDATE products SET stock_quantity = ?, updated_at = NOW() WHERE id = ?',
    [quantity, productId]
  );
}

/**
 * Decrease stock quantity (for orders)
 */
export async function decreaseStock(productId: string, quantity: number): Promise<void> {
  await db.query(
    'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = NOW() WHERE id = ? AND stock_quantity >= ?',
    [quantity, productId, quantity]
  );
}

/**
 * Parse JSON fields from database
 */
function parseProductJson(product: any): Product {
  return {
    ...product,
    price: parseFloat(product.price),
    compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price) : null,
    images: JSON.parse(product.images),
    variations: product.variations ? JSON.parse(product.variations) : null,
  };
}