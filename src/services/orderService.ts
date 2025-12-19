/**
 * AGM Store Builder - Order Service
 * Business logic for order management
 */

import {
  createOrder as createOrderModel,
  findOrderById,
  findOrderByNumber,
  updateOrderStatus as updateOrderStatusModel,
  Order,
  CreateOrderData,
  OrderStatus,
} from '../models/Order';
import {
  createOrderItem,
  CreateOrderItemData,
} from '../models/OrderItem';
import { findProductById, decreaseStock } from '../models/Product';
import { findStoreByUsername, findStoreById } from '../models/Store';
import { createPayment } from '../models/Payment';
import { errors } from '../middleware/errorHandler';
import { config } from '../config/env';
import { query } from '../config/database';
import * as monnifyService from './monnifyService';

/**
 * Calculate AGM fee
 */
function calculateAgmFee(amount: number): number {
  const feePercentage = config.agmFeePercentage / 100;
  return Math.round(amount * feePercentage * 100) / 100;
}

/**
 * Create a new order
 */
export async function createOrder(
  username: string,
  data: Omit<CreateOrderData, 'store_id'>
): Promise<{ order: Order; payment: any }> {
  // Get store
  const store = await findStoreByUsername(username);
  if (!store) {
    throw errors.notFound('Store');
  }

  if (!store.is_active) {
    throw errors.badRequest('Store is currently inactive');
  }

  // Validate products and calculate total
  let subtotal = 0;
  const orderItems: (CreateOrderItemData & { product_name: string; product_price: number })[] = [];

  for (const item of data.items) {
    const product = await findProductById(item.product_id);

    if (!product) {
      throw errors.notFound(`Product with ID ${item.product_id}`);
    }

    if (product.store_id !== store.id) {
      throw errors.badRequest('Product does not belong to this store');
    }

    if (!product.is_active) {
      throw errors.badRequest(`Product "${product.name}" is not available`);
    }

    if (product.stock_quantity < item.quantity) {
      throw errors.badRequest(`Insufficient stock for product "${product.name}"`);
    }

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      order_id: '', // Will be set after order creation
      product_id: item.product_id,
      product_name: product.name,
      product_price: product.price,
      quantity: item.quantity,
    });
  }

  const agmFee = calculateAgmFee(subtotal);
  const total = subtotal;

  // Create order
  const order = await createOrderModel({
    ...data,
    store_id: store.id,
    subtotal,
    total,
    agm_fee: agmFee,
  });

  // Create order items and decrease stock
  for (const item of orderItems) {
    await createOrderItem({
      ...item,
      order_id: order.id,
    });

    await decreaseStock(item.product_id, item.quantity);
  }

  // Initialize Monnify payment
  const monnifyResponse = await monnifyService.initializePayment({
    amount: total,
    customerEmail: data.customer_email || 'customer@email.com',
    customerName: data.customer_name,
    paymentDescription: `Order payment for ${order.order_number}`,
  });

  const payment = await createPayment({
    order_id: order.id,
    user_id: store.user_id,
    amount: total,
    payment_reference: order.order_number,
    monnify_reference: monnifyResponse.transactionReference,
    expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  });

  return { 
    order, 
    payment: {
      ...payment,
      accountDetails: {
        accountNumber: monnifyResponse.responseBody?.accountNumber,
        accountName: monnifyResponse.responseBody?.accountName,
        bankName: monnifyResponse.responseBody?.bankName,
        amount: total,
      },
    },
  };
}

/**
 * Track order by order number
 */
export async function trackOrder(orderNumber: string): Promise<Order | null> {
  return await findOrderByNumber(orderNumber);
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  return await findOrderById(orderId);
}

/**
 * Verify order ownership
 */
export async function verifyOrderOwnership(orderId: string, userId: string): Promise<void> {
  const order = await findOrderById(orderId);
  if (!order) {
    throw errors.notFound('Order');
  }

  const store = await findStoreById(order.store_id);
  if (!store || store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to access this order');
  }
}

/**
 * List all orders for user (across all their stores)
 */
export async function listAllOrders(
  userId: string,
  filters: {
    status?: OrderStatus;
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    page?: number;
    limit?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
  } = {}
): Promise<{ orders: Order[]; total: number; pagination: any }> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ['s.user_id = ?'];
  const params: any[] = [userId];

  if (filters.status) {
    conditions.push('o.status = ?');
    params.push(filters.status);
  }

  if (filters.payment_status) {
    conditions.push('o.payment_status = ?');
    params.push(filters.payment_status);
  }

  if (filters.search) {
    conditions.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)');
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.date_from) {
    conditions.push('o.created_at >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    conditions.push('o.created_at <= ?');
    params.push(filters.date_to);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) as total 
     FROM orders o
     INNER JOIN stores s ON o.store_id = s.id
     WHERE ${whereClause}`,
    params
  ) as any[];

  const total = countResult[0]?.total || 0;

  // Get orders with store info
  const orders = await query(
    `SELECT 
      o.*,
      s.username as store_username,
      s.display_name as store_name,
      s.logo_url as store_logo
     FROM orders o
     INNER JOIN stores s ON o.store_id = s.id
     WHERE ${whereClause}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  ) as any[];

  return {
    orders,
    total,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: offset + orders.length < total,
    },
  };
}

/**
 * List orders for specific store
 */
export async function listStoreOrders(
  storeId: string,
  userId: string,
  filters: {
    status?: OrderStatus;
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    page?: number;
    limit?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
  } = {}
): Promise<{ orders: Order[]; total: number; pagination: any }> {
  // Verify store ownership
  const store = await findStoreById(storeId);
  if (!store) {
    throw errors.notFound('Store');
  }

  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to access this store');
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ['o.store_id = ?'];
  const params: any[] = [storeId];

  if (filters.status) {
    conditions.push('o.status = ?');
    params.push(filters.status);
  }

  if (filters.payment_status) {
    conditions.push('o.payment_status = ?');
    params.push(filters.payment_status);
  }

  if (filters.search) {
    conditions.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)');
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters.date_from) {
    conditions.push('o.created_at >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    conditions.push('o.created_at <= ?');
    params.push(filters.date_to);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) as total 
     FROM orders o
     WHERE ${whereClause}`,
    params
  ) as any[];

  const total = countResult[0]?.total || 0;

  // Get orders
  const orders = await query(
    `SELECT o.*
     FROM orders o
     WHERE ${whereClause}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  ) as any[];

  return {
    orders,
    total,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: offset + orders.length < total,
    },
  };
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  userId: string,
  status: OrderStatus
): Promise<Order> {
  const order = await findOrderById(orderId);
  if (!order) {
    throw errors.notFound('Order');
  }

  // Verify ownership
  const store = await findStoreById(order.store_id);
  if (!store || store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to update this order');
  }

  await updateOrderStatusModel(orderId, status);

  const updatedOrder = await findOrderById(orderId);
  if (!updatedOrder) {
    throw new Error('Failed to update order');
  }

  return updatedOrder;
}

/**
 * Get order statistics
 */
export async function getOrderStats(storeId: string, userId: string): Promise<any> {
  const store = await findStoreById(storeId);
  if (!store) {
    throw errors.notFound('Store');
  }

  if (store.user_id !== userId) {
    throw errors.forbidden('You do not have permission to access this store');
  }

  const stats = await query(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as revenue
    FROM orders
    WHERE store_id = ?`,
    [storeId]
  ) as any[];

  return {
    total: stats[0]?.total || 0,
    pending: stats[0]?.pending || 0,
    confirmed: stats[0]?.confirmed || 0,
    fulfilled: stats[0]?.fulfilled || 0,
    cancelled: stats[0]?.cancelled || 0,
    revenue: stats[0]?.revenue || 0,
  };
}