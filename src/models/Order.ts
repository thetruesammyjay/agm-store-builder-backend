/**
 * AGM Store Builder - Order Model
 * Database operations for orders
 */

import { db } from '../database/connection';
import { v4 as uuid } from 'uuid';

export interface Order {
  id: string;
  store_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: CustomerAddress | null;
  items: OrderItem[];
  subtotal: number;
  agm_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
  selected_variations?: Record<string, string>;
}

export interface CreateOrderData {
  store_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: CustomerAddress;
  items: Array<{
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    selected_variations?: Record<string, string>;
  }>;
  subtotal: number;
  agm_fee: number;
  total: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: OrderPaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

/**
 * Generate order number
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `AGM-${year}-${random}`;
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<Order> {
  const id = uuid();
  const orderNumber = generateOrderNumber();

  const items = data.items.map(item => ({
    ...item,
    subtotal: item.price * item.quantity,
  }));

  await db.query(
    `INSERT INTO orders (
      id, store_id, order_number, customer_name, customer_phone,
      customer_email, customer_address, items, subtotal, agm_fee, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.store_id,
      orderNumber,
      data.customer_name,
      data.customer_phone,
      data.customer_email || null,
      data.customer_address ? JSON.stringify(data.customer_address) : null,
      JSON.stringify(items),
      data.subtotal,
      data.agm_fee,
      data.total,
    ]
  );

  const order = await findOrderById(id);
  if (!order) {
    throw new Error('Failed to create order');
  }

  return order;
}

/**
 * Find order by ID
 */
export async function findOrderById(id: string): Promise<Order | null> {
  const order = await db.queryOne<any>(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  );

  return order ? parseOrderJson(order) : null;
}

/**
 * Find order by order number
 */
export async function findOrderByNumber(orderNumber: string): Promise<Order | null> {
  const order = await db.queryOne<any>(
    'SELECT * FROM orders WHERE order_number = ?',
    [orderNumber]
  );

  return order ? parseOrderJson(order) : null;
}

/**
 * Find orders by store ID
 */
export async function findOrdersByStoreId(
  storeId: string,
  filters?: OrderFilters,
  page: number = 1,
  limit: number = 20
): Promise<{ orders: Order[]; total: number }> {
  const offset = (page - 1) * limit;
  const conditions: string[] = ['store_id = ?'];
  const values: any[] = [storeId];

  // Apply filters
  if (filters?.status) {
    conditions.push('status = ?');
    values.push(filters.status);
  }

  if (filters?.payment_status) {
    conditions.push('payment_status = ?');
    values.push(filters.payment_status);
  }

  if (filters?.startDate) {
    conditions.push('created_at >= ?');
    values.push(filters.startDate);
  }

  if (filters?.endDate) {
    conditions.push('created_at <= ?');
    values.push(filters.endDate);
  }

  if (filters?.search) {
    conditions.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
    const searchTerm = `%${filters.search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countResult = await db.queryOne<any>(
    `SELECT COUNT(*) as total FROM orders WHERE ${whereClause}`,
    values
  );
  const total = countResult?.total || 0;

  // Get orders
  const orders = await db.query<any>(
    `SELECT * FROM orders WHERE ${whereClause} 
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return {
    orders: orders.map(parseOrderJson),
    total,
  };
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  await db.query(
    'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, orderId]
  );

  return await findOrderById(orderId);
}

/**
 * Update order payment status
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: OrderPaymentStatus
): Promise<Order | null> {
  await db.query(
    'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
    [paymentStatus, orderId]
  );

  return await findOrderById(orderId);
}

/**
 * Get order statistics for a store
 */
export async function getOrderStats(storeId: string): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  fulfilled: number;
  cancelled: number;
  totalRevenue: number;
}> {
  const result = await db.queryOne<any>(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as totalRevenue
     FROM orders WHERE store_id = ?`,
    [storeId]
  );

  return {
    total: result?.total || 0,
    pending: result?.pending || 0,
    confirmed: result?.confirmed || 0,
    fulfilled: result?.fulfilled || 0,
    cancelled: result?.cancelled || 0,
    totalRevenue: parseFloat(result?.totalRevenue || 0),
  };
}

/**
 * Parse JSON fields from database
 */
function parseOrderJson(order: any): Order {
  return {
    ...order,
    customer_address: order.customer_address ? JSON.parse(order.customer_address) : null,
    items: JSON.parse(order.items),
    subtotal: parseFloat(order.subtotal),
    agm_fee: parseFloat(order.agm_fee),
    total: parseFloat(order.total),
  };
}