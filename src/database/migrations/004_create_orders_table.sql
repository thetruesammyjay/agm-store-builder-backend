-- ============================================================================
-- Migration: 004_create_orders_table
-- Description: Create orders table for customer orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'fulfilled', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_address JSON COMMENT 'Delivery address: {street, city, state, postalCode, landmark}',
  items JSON NOT NULL COMMENT 'Order items: [{productId, productName, productImage, quantity, price, selectedVariations, subtotal}]',
  subtotal DECIMAL(10, 2) NOT NULL,
  agm_fee DECIMAL(10, 2) NOT NULL COMMENT '1% platform fee',
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  notes TEXT COMMENT 'Customer notes or special instructions',
  cancelled_reason TEXT,
  cancelled_at TIMESTAMP NULL,
  fulfilled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_customer_phone (customer_phone),
  INDEX idx_customer_email (customer_email),
  INDEX idx_created_at (created_at),
  INDEX idx_orders_store_status (store_id, status, created_at),
  INDEX idx_orders_store_payment (store_id, payment_status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;