-- ============================================================================
-- Migration: 002_create_stores_table
-- Description: Create stores table for user stores
-- ============================================================================

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