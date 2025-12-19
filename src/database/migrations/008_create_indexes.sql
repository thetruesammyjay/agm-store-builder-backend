-- ============================================================================
-- Migration: 008_create_additional_tables_and_data
-- Description: Create analytics, notifications, and seed data
-- ============================================================================

-- Store Analytics Table
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

-- Reviews Table
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

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  type ENUM('order', 'payment', 'payout', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON COMMENT 'Additional notification data',
  `read` BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_read (`read`),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
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

-- Reserved Usernames Table
CREATE TABLE IF NOT EXISTS reserved_usernames (
  username VARCHAR(30) PRIMARY KEY,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert reserved usernames
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
('paystack', 'Partner reserved')
ON DUPLICATE KEY UPDATE reason = VALUES(reason);

-- Views for easier data access
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
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid') AS total_revenue,
  (SELECT COUNT(*) FROM payments WHERE status = 'paid') AS successful_payments;