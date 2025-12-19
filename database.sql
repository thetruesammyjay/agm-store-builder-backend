-- =============================================================================
-- AGM STORE BUILDER - COMPLETE DATABASE SCHEMA
-- =============================================================================
-- MySQL 8.0+
-- Character Set: utf8mb4 (full Unicode support including emojis)
-- Collation: utf8mb4_unicode_ci (case-insensitive, Unicode-aware)
-- =============================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS agm_store_builder
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agm_store_builder;

-- =============================================================================
-- TABLE: users
-- Stores user account information
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: stores
-- Stores information for each online store
-- =============================================================================
CREATE TABLE IF NOT EXISTS stores (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  template_id ENUM('products', 'bookings', 'portfolio') DEFAULT 'products',
  custom_colors JSON COMMENT 'Store theme colors: {primary, secondary, accent}',
  custom_fonts JSON COMMENT 'Store fonts: {heading, body}',
  social_links JSON COMMENT 'Social media links: {facebook, instagram, twitter, whatsapp}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_username (username),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: products
-- Stores product catalog for each store
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2) COMMENT 'Original price for showing discounts',
  images JSON NOT NULL COMMENT 'Array of image URLs',
  variations JSON COMMENT 'Product variations: [{name, options}]',
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100),
  category VARCHAR(100),
  tags JSON COMMENT 'Array of tag strings',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0 COMMENT 'Track product views',
  sales_count INT DEFAULT 0 COMMENT 'Track total sales',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_is_active (is_active),
  INDEX idx_is_featured (is_featured),
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: orders
-- Stores customer orders
-- =============================================================================
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
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: payments
-- Stores payment records (Monnify integration)
-- =============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id VARCHAR(36) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL COMMENT 'AGM-PAY-xxx',
  monnify_reference VARCHAR(100) UNIQUE COMMENT 'Monnify transaction reference',
  account_number VARCHAR(20) COMMENT 'Reserved account number',
  account_name VARCHAR(255) COMMENT 'Account name for transfer',
  bank_name VARCHAR(100) COMMENT 'Bank name',
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
  payment_method VARCHAR(50) COMMENT 'bank_transfer, card, ussd',
  expires_at TIMESTAMP NULL COMMENT 'Payment expiry time (30 minutes)',
  paid_at TIMESTAMP NULL,
  webhook_data JSON COMMENT 'Raw webhook payload from Monnify',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_reference (reference),
  INDEX idx_monnify_reference (monnify_reference),
  INDEX idx_status (status),
  INDEX idx_order_id (order_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: bank_accounts
-- Stores user bank accounts for payouts
-- =============================================================================
CREATE TABLE IF NOT EXISTS bank_accounts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  bank_code VARCHAR(10) NOT NULL COMMENT 'CBN bank code',
  bank_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  verification_data JSON COMMENT 'Verification response from bank',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_primary (is_primary),
  UNIQUE KEY unique_account_per_user (user_id, account_number, bank_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: payouts
-- Stores payout/withdrawal records
-- =============================================================================
CREATE TABLE IF NOT EXISTS payouts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  bank_account_id VARCHAR(36) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL COMMENT 'AGM-PAYOUT-xxx',
  amount DECIMAL(10, 2) NOT NULL,
  fee DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(10, 2) NOT NULL COMMENT 'Amount after fees',
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  description TEXT,
  transaction_reference VARCHAR(100) COMMENT 'Bank transaction reference',
  failure_reason TEXT,
  processed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_reference (reference),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: otp_verifications
-- Stores OTP codes for email/phone verification
-- =============================================================================
CREATE TABLE IF NOT EXISTS otp_verifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255),
  phone VARCHAR(20),
  code VARCHAR(6) NOT NULL,
  type ENUM('email', 'phone') NOT NULL,
  purpose ENUM('signup', 'login', 'password_reset') DEFAULT 'signup',
  verified BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0 COMMENT 'Failed verification attempts',
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_code (code),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: password_resets
-- Stores password reset tokens
-- =============================================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: sessions
-- Stores active user sessions (optional - for refresh tokens)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  device_info JSON COMMENT 'User agent, IP address, device type',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_refresh_token (refresh_token),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: store_analytics
-- Stores daily analytics for each store
-- =============================================================================
CREATE TABLE IF NOT EXISTS store_analytics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  orders INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  new_customers INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_store_date (store_id, date),
  INDEX idx_store_id (store_id),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: reviews
-- Stores product reviews (optional feature)
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSON COMMENT 'Array of review image URLs',
  is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verified purchase',
  is_approved BOOLEAN DEFAULT FALSE COMMENT 'Approved by store owner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_order_id (order_id),
  INDEX idx_rating (rating),
  INDEX idx_is_approved (is_approved),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: notifications
-- Stores user notifications
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  type ENUM('order', 'payment', 'payout', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON COMMENT 'Additional notification data',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_read (read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: activity_logs
-- Stores user activity logs (optional - for audit trail)
-- =============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) COMMENT 'users, stores, products, orders, etc.',
  resource_id VARCHAR(36),
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSON COMMENT 'Additional context data',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- VIEWS - For easier data access
-- =============================================================================

-- View: Active stores with owner info
CREATE OR REPLACE VIEW v_active_stores AS
SELECT 
  s.id,
  s.username,
  s.display_name,
  s.description,
  s.logo_url,
  s.template_id,
  s.created_at,
  u.full_name AS owner_name,
  u.email AS owner_email,
  COUNT(DISTINCT p.id) AS product_count,
  COUNT(DISTINCT o.id) AS order_count
FROM stores s
JOIN users u ON s.user_id = u.id
LEFT JOIN products p ON s.id = p.store_id AND p.is_active = TRUE
LEFT JOIN orders o ON s.id = o.store_id
WHERE s.is_active = TRUE
GROUP BY s.id, u.id;

-- View: Order summary
CREATE OR REPLACE VIEW v_order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.payment_status,
  o.customer_name,
  o.customer_phone,
  o.total,
  o.created_at,
  s.username AS store_username,
  s.display_name AS store_name,
  p.reference AS payment_reference,
  p.status AS payment_status_detail
FROM orders o
JOIN stores s ON o.store_id = s.id
LEFT JOIN payments p ON o.id = p.order_id;

-- =============================================================================
-- TRIGGERS - For automated tasks
-- =============================================================================

-- Trigger: Update product sales count when order is confirmed
DELIMITER //
CREATE TRIGGER trg_update_product_sales
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- This would need a stored procedure to parse JSON and update products
    -- Simplified version - implement full logic in application layer
    NULL;
  END IF;
END//
DELIMITER ;

-- Trigger: Ensure only one primary bank account per user
DELIMITER //
CREATE TRIGGER trg_one_primary_bank_account
BEFORE INSERT ON bank_accounts
FOR EACH ROW
BEGIN
  IF NEW.is_primary = TRUE THEN
    UPDATE bank_accounts 
    SET is_primary = FALSE 
    WHERE user_id = NEW.user_id AND is_primary = TRUE;
  END IF;
END//
DELIMITER ;

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_orders_store_status ON orders(store_id, status, created_at);
CREATE INDEX idx_orders_store_payment ON orders(store_id, payment_status, created_at);
CREATE INDEX idx_products_store_active ON products(store_id, is_active, created_at);
CREATE INDEX idx_payments_status_date ON payments(status, created_at);

-- =============================================================================
-- INITIAL DATA - Reserved usernames
-- =============================================================================

-- Reserved usernames that cannot be used
CREATE TABLE IF NOT EXISTS reserved_usernames (
  username VARCHAR(30) PRIMARY KEY,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO reserved_usernames (username, reason) VALUES
('www', 'System reserved'),
('api', 'System reserved'),
('admin', 'System reserved'),
('support', 'System reserved'),
('help', 'System reserved'),
('billing', 'System reserved'),
('payment', 'System reserved'),
('checkout', 'System reserved'),
('shop', 'System reserved'),
('store', 'System reserved'),
('dashboard', 'System reserved'),
('login', 'System reserved'),
('signup', 'System reserved'),
('register', 'System reserved'),
('verify', 'System reserved'),
('forgot-password', 'System reserved'),
('reset-password', 'System reserved'),
('terms', 'System reserved'),
('privacy', 'System reserved'),
('about', 'System reserved'),
('contact', 'System reserved'),
('blog', 'System reserved'),
('news', 'System reserved'),
('docs', 'System reserved'),
('documentation', 'System reserved'),
('agm', 'Brand reserved'),
('agmtech', 'Brand reserved'),
('agmshop', 'Brand reserved'),
('agmtechpluse', 'Brand reserved'),
('shopwithagm', 'Brand reserved'),
('monnify', 'Partner reserved'),
('paystack', 'Partner reserved');

-- =============================================================================
-- DATABASE STATISTICS AND HEALTH CHECKS
-- =============================================================================

-- View: Database statistics
CREATE OR REPLACE VIEW v_database_stats AS
SELECT 
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS active_users,
  (SELECT COUNT(*) FROM stores) AS total_stores,
  (SELECT COUNT(*) FROM stores WHERE is_active = TRUE) AS active_stores,
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS active_products,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'fulfilled') AS fulfilled_orders,
  (SELECT SUM(total) FROM orders WHERE payment_status = 'paid') AS total_revenue,
  (SELECT COUNT(*) FROM payments WHERE status = 'paid') AS successful_payments;

-- =============================================================================
-- SCHEMA COMPLETE
-- =============================================================================
-- Total Tables: 15
-- Total Views: 3
-- Total Triggers: 2
-- =============================================================================