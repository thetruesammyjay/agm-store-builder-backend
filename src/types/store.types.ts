/**
 * AGM Store Builder - Store Types
 * Types for store-related operations
 */

/**
 * Store Templates
 */
export type StoreTemplate = 'products' | 'bookings' | 'portfolio';

/**
 * Custom Colors
 */
export interface CustomColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

/**
 * Custom Fonts
 */
export interface CustomFonts {
  heading?: string;
  body?: string;
}

/**
 * Store (Full database model)
 */
export interface Store {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  description: string | null;
  logo_url: string | null;
  template_id: StoreTemplate;
  custom_colors: CustomColors | null;
  custom_fonts: CustomFonts | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create Store Data
 */
export interface CreateStoreData {
  user_id: string;
  username: string;
  display_name: string;
  description?: string;
  logo_url?: string;
  template_id: StoreTemplate;
  custom_colors?: CustomColors;
  custom_fonts?: CustomFonts;
}

/**
 * Update Store Data
 */
export interface UpdateStoreData {
  display_name?: string;
  description?: string;
  logo_url?: string;
  template_id?: StoreTemplate;
  custom_colors?: CustomColors;
  custom_fonts?: CustomFonts;
}

/**
 * Store with User Info
 */
export interface StoreWithUser extends Store {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

/**
 * Store Stats
 */
export interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  pendingOrders: number;
}

/**
 * Store Analytics
 */
export interface StoreAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  avgOrderValue: number;
  revenueByDay: Array<{
    date: string;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    orderCount: number;
  }>;
}

/**
 * Store Settings
 */
export interface StoreSettings {
  store_id: string;
  accept_orders: boolean;
  show_stock: boolean;
  require_address: boolean;
  min_order_amount: number | null;
  delivery_fee: number | null;
  delivery_note: string | null;
  created_at: Date;
  updated_at: Date;
}