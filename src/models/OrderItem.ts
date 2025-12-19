import { query } from '../config/database';
import { v4 as uuid } from 'uuid';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: Date;
}

export interface CreateOrderItemData {
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

/**
 * Create order item
 */
export async function createOrderItem(data: CreateOrderItemData): Promise<OrderItem> {
  const id = uuid();
  const subtotal = data.product_price * data.quantity;

  await query(
    `INSERT INTO order_items (
      id, order_id, product_id, product_name, product_price, quantity, subtotal
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.order_id,
      data.product_id,
      data.product_name,
      data.product_price,
      data.quantity,
      subtotal,
    ]
  );

  const item = await findOrderItemById(id);
  if (!item) {
    throw new Error('Failed to create order item');
  }
  return item;
}

/**
 * Find order item by ID
 */
export async function findOrderItemById(id: string): Promise<OrderItem | null> {
  const rows = await query<any>(
    'SELECT * FROM order_items WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Find order items by order ID
 */
export async function findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
  const rows = await query<any>(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
    [orderId]
  );
  return rows;
}

/**
 * Get total items count for an order
 */
export async function getOrderItemsCount(orderId: string): Promise<number> {
  const rows = await query<any>(
    'SELECT COUNT(*) as count FROM order_items WHERE order_id = ?',
    [orderId]
  );
  return rows[0]?.count || 0;
}

/**
 * Get order subtotal from items
 */
export async function calculateOrderSubtotal(orderId: string): Promise<number> {
  const rows = await query<any>(
    'SELECT SUM(subtotal) as total FROM order_items WHERE order_id = ?',
    [orderId]
  );
  return rows[0]?.total || 0;
}

/**
 * Delete order items by order ID
 */
export async function deleteOrderItems(orderId: string): Promise<void> {
  await query(
    'DELETE FROM order_items WHERE order_id = ?',
    [orderId]
  );
}