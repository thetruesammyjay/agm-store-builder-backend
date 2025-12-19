-- ============================================================================
-- Migration: 003_create_products_table
-- Description: Create products table for store products
-- ============================================================================

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