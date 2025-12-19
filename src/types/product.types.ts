/**
 * AGM Store Builder - Product Types
 * Types for product-related operations
 */

/**
 * Product Variation
 */
export interface ProductVariation {
  name: string;
  options: string[];
}

/**
 * Product (Full database model)
 */
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
  created_at: Date;
  updated_at: Date;
}

/**
 * Create Product Data
 */
export interface CreateProductData {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images?: string[];
  variations?: ProductVariation[];
  stock_quantity: number;
  is_active?: boolean;
}

/**
 * Update Product Data
 */
export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  compare_at_price?: number;
  images?: string[];
  variations?: ProductVariation[];
  stock_quantity?: number;
  is_active?: boolean;
}

/**
 * Product Filters
 */
export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: 'price' | 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product with Store Info
 */
export interface ProductWithStore extends Product {
  store: {
    id: string;
    username: string;
    display_name: string;
    logo_url: string | null;
  };
}

/**
 * Product Stats
 */
export interface ProductStats {
  totalSold: number;
  totalRevenue: number;
  averageRating: number | null;
  reviewCount: number;
  viewCount: number;
}

/**
 * Selected Variations (for orders)
 */
export interface SelectedVariations {
  [variationName: string]: string;
}

/**
 * Product Inventory Update
 */
export interface InventoryUpdate {
  product_id: string;
  quantity_change: number; // Positive for increase, negative for decrease
  reason: 'sale' | 'restock' | 'adjustment' | 'return';
  note?: string;
}