/**
 * AGM Store Builder - Order Types
 * Types for order-related operations
 */

import { SelectedVariations } from './product.types';

/**
 * Order Status
 */
export type OrderStatus = 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';

/**
 * Payment Status
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Customer Address
 */
export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  landmark?: string;
}

/**
 * Order Item
 */
export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  selected_variations?: SelectedVariations;
}

/**
 * Order (Full database model)
 */
export interface Order {
  id: string;
  store_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: CustomerAddress | null;
  items: OrderItem[];
  subtotal: number;
  agm_fee: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create Order Data
 */
export interface CreateOrderData {
  store_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  agm_fee: number;
  total: number;
  notes?: string;
}

/**
 * Update Order Data
 */
export interface UpdateOrderData {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  notes?: string;
}

/**
 * Order Filters
 */
export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  search?: string; // Search by order number, customer name, or phone
  sortBy?: 'created_at' | 'total';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Order with Store Info
 */
export interface OrderWithStore extends Order {
  store: {
    id: string;
    username: string;
    display_name: string;
    logo_url: string | null;
  };
}

/**
 * Order Stats
 */
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  fulfilledOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalAgmFee: number;
  avgOrderValue: number;
}

/**
 * Order Timeline Event
 */
export interface OrderTimelineEvent {
  id: string;
  order_id: string;
  event_type: 'created' | 'confirmed' | 'fulfilled' | 'cancelled' | 'payment_received';
  description: string;
  created_at: Date;
}

/**
 * Order Summary (for receipts/invoices)
 */
export interface OrderSummary {
  orderNumber: string;
  orderDate: Date;
  customer: {
    name: string;
    phone: string;
    email: string | null;
    address: CustomerAddress | null;
  };
  items: OrderItem[];
  subtotal: number;
  agmFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

/**
 * Order Notification
 */
export interface OrderNotification {
  order_id: string;
  type: 'new_order' | 'status_update' | 'payment_received';
  recipient: 'customer' | 'seller';
  sent: boolean;
  sent_at: Date | null;
}