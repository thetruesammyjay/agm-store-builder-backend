/**
 * AGM Store Builder - Analytics Service
 * Business logic for analytics and reporting
 */

import { query } from '../config/database';
import { errors } from '../middleware/errorHandler';

interface StoreRecord {
  id: string;
  display_name: string;
  username: string;
}

/**
 * Get dashboard analytics
 */
export async function getDashboardAnalytics(userId: string, _filters: any): Promise<any> {
  // Get user's stores
  const stores = await query<any>(
    'SELECT id, display_name, username FROM stores WHERE user_id = ? AND is_active = TRUE',
    [userId]
  );

  if (stores.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      stores: [],
    };
  }

  const storeIds = stores.map((s: StoreRecord) => s.id);

  // Get aggregate stats
  const stats = await query<any>(
    `SELECT 
      COUNT(DISTINCT o.id) as totalOrders,
      SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
      SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) as completedOrders,
      SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END) as totalRevenue
    FROM orders o
    WHERE o.store_id IN (${storeIds.map(() => '?').join(',')})`,
    storeIds
  );

  return {
    totalRevenue: stats[0]?.totalRevenue || 0,
    totalOrders: stats[0]?.totalOrders || 0,
    pendingOrders: stats[0]?.pendingOrders || 0,
    completedOrders: stats[0]?.completedOrders || 0,
    stores: stores.map((s: StoreRecord) => ({ id: s.id, name: s.display_name, username: s.username })),
  };
}

/**
 * Get revenue statistics
 */
export async function getRevenueStats(userId: string, _filters: any): Promise<any> {
  const stores = await query<any>(
    'SELECT id FROM stores WHERE user_id = ? AND is_active = TRUE',
    [userId]
  );

  if (stores.length === 0) {
    return {
      totalRevenue: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
    };
  }

  const storeIds = stores.map((s: { id: string }) => s.id);

  const stats = await query<any>(
    `SELECT 
      SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as totalRevenue,
      SUM(CASE WHEN payment_status = 'paid' AND MONTH(created_at) = MONTH(NOW()) THEN total ELSE 0 END) as thisMonth,
      SUM(CASE WHEN payment_status = 'paid' AND MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) THEN total ELSE 0 END) as lastMonth
    FROM orders
    WHERE store_id IN (${storeIds.map(() => '?').join(',')})`,
    storeIds
  );

  const thisMonth = stats[0]?.thisMonth || 0;
  const lastMonth = stats[0]?.lastMonth || 0;
  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return {
    totalRevenue: stats[0]?.totalRevenue || 0,
    thisMonth,
    lastMonth,
    growth: Math.round(growth * 100) / 100,
  };
}

/**
 * Get store-specific analytics
 */
export async function getStoreAnalytics(
  storeId: string,
  userId: string,
  _filters: any
): Promise<any> {
  const store = await query<any>(
    'SELECT * FROM stores WHERE id = ? AND user_id = ?',
    [storeId, userId]
  );

  if (store.length === 0) {
    throw errors.notFound('Store');
  }

  const stats = await query<any>(
    `SELECT 
      COUNT(*) as totalOrders,
      SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as totalRevenue,
      AVG(CASE WHEN payment_status = 'paid' THEN total ELSE NULL END) as averageOrderValue
    FROM orders
    WHERE store_id = ?`,
    [storeId]
  );

  return {
    storeId,
    storeName: store[0].display_name,
    totalOrders: stats[0]?.totalOrders || 0,
    totalRevenue: stats[0]?.totalRevenue || 0,
    averageOrderValue: stats[0]?.averageOrderValue || 0,
  };
}

/**
 * Get customer analytics
 */
export async function getCustomerAnalytics(userId: string): Promise<any> {
  const stores = await query<any>(
    'SELECT id FROM stores WHERE user_id = ? AND is_active = TRUE',
    [userId]
  );

  if (stores.length === 0) {
    return {
      totalCustomers: 0,
      repeatCustomers: 0,
      newCustomers: 0,
    };
  }

  const storeIds = stores.map((s: { id: string }) => s.id);

  const stats = await query<any>(
    `SELECT 
      COUNT(DISTINCT customer_email) as totalCustomers,
      COUNT(DISTINCT CASE WHEN order_count > 1 THEN customer_email END) as repeatCustomers
    FROM (
      SELECT customer_email, COUNT(*) as order_count
      FROM orders
      WHERE store_id IN (${storeIds.map(() => '?').join(',')})
      GROUP BY customer_email
    ) as customer_orders`,
    storeIds
  );

  const totalCustomers = stats[0]?.totalCustomers || 0;
  const repeatCustomers = stats[0]?.repeatCustomers || 0;

  return {
    totalCustomers,
    repeatCustomers,
    newCustomers: totalCustomers - repeatCustomers,
  };
}

/**
 * Get top-selling products
 */
export async function getTopProducts(
  userId: string,
  _limit: number = 10,
  storeId?: string
): Promise<any[]> {
  let storeIds: string[];

  if (storeId) {
    const store = await query<any>(
      'SELECT id FROM stores WHERE id = ? AND user_id = ?',
      [storeId, userId]
    );

    if (store.length === 0) {
      throw errors.notFound('Store');
    }

    storeIds = [storeId];
  } else {
    const stores = await query<any>(
      'SELECT id FROM stores WHERE user_id = ? AND is_active = TRUE',
      [userId]
    );

    if (stores.length === 0) {
      return [];
    }

    storeIds = stores.map((s: { id: string }) => s.id);
  }

  const products = await query<any>(
    `SELECT 
      oi.product_id,
      oi.product_name,
      SUM(oi.quantity) as totalSold,
      SUM(oi.subtotal) as revenue
    FROM order_items oi
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE o.store_id IN (${storeIds.map(() => '?').join(',')})
      AND o.payment_status = 'paid'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY totalSold DESC
    LIMIT 10`,
    storeIds
  );

  return products;
}