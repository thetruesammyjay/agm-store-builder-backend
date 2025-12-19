/**
 * AGM Store Builder - Product Service
 * Business logic for product management
 */

import {
  createProduct as createProductModel,
  findProductById,
  findProductsByStoreId,
  updateProduct as updateProductModel,
  deleteProduct as deleteProductModel,
  updateStockQuantity,
  Product,
  CreateProductData,
  ProductFilters,
} from '../models/Product';
import { findStoreById, findStoreByUsername } from '../models/Store';
import { errors } from '../middleware/errorHandler';

/**
 * Create a new product
 */
export async function createProduct(
  data: CreateProductData,
  userId: string
): Promise<Product> {
  // Verify store ownership
  const store = await findStoreById(data.store_id);

  if (!store) {
    throw errors.notFound('Store');
  }

  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to add products to this store');
  }

  // Create product
  const product = await createProductModel(data);
  return product;
}

/**
 * List products for a store (public)
 */
export async function listProducts(
  username: string,
  filters: any
): Promise<{ products: Product[]; pagination: any }> {
  const store = await findStoreByUsername(username);

  if (!store) {
    throw errors.notFound('Store');
  }

  if (!store.is_active) {
    throw errors.notFound('Store');
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;

  const productFilters: ProductFilters = {
    search: filters.search,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    inStock: filters.inStock === 'true',
    isActive: true, // Only show active products publicly
  };

  const result = await findProductsByStoreId(store.id, productFilters, page, limit);

  return {
    products: result.products,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

/**
 * Get single product (public)
 */
export async function getProduct(
  username: string,
  productId: string
): Promise<Product | null> {
  const store = await findStoreByUsername(username);

  if (!store) {
    throw errors.notFound('Store');
  }

  const product = await findProductById(productId);

  if (!product || product.store_id !== store.id) {
    throw errors.notFound('Product');
  }

  if (!product.is_active) {
    throw errors.notFound('Product');
  }

  return product;
}

/**
 * Get product by ID (for dashboard)
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const product = await findProductById(productId);

  if (!product) {
    throw errors.notFound('Product');
  }

  return product;
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  userId: string,
  data: Partial<CreateProductData>
): Promise<Product> {
  const product = await findProductById(productId);

  if (!product) {
    throw errors.notFound('Product');
  }

  // Verify store ownership
  const store = await findStoreById(product.store_id);

  if (!store || store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to update this product');
  }

  const updatedProduct = await updateProductModel(productId, data);

  if (!updatedProduct) {
    throw errors.notFound('Product');
  }

  return updatedProduct;
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string, userId: string): Promise<void> {
  const product = await findProductById(productId);

  if (!product) {
    throw errors.notFound('Product');
  }

  // Verify store ownership
  const store = await findStoreById(product.store_id);

  if (!store || store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to delete this product');
  }

  await deleteProductModel(productId);
}

/**
 * Update stock quantity
 */
export async function updateStock(
  productId: string,
  userId: string,
  stockQuantity: number
): Promise<Product> {
  const product = await findProductById(productId);

  if (!product) {
    throw errors.notFound('Product');
  }

  // Verify store ownership
  const store = await findStoreById(product.store_id);

  if (!store || store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to update this product');
  }

  await updateStockQuantity(productId, stockQuantity);

  const updatedProduct = await findProductById(productId);
  if (!updatedProduct) {
    throw errors.notFound('Product');
  }

  return updatedProduct;
}