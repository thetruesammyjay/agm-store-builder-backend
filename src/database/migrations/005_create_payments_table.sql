-- ============================================================================
-- Migration: 005_create_payments_table
-- Description: Create payments table for Monnify integration
-- ============================================================================

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
  INDEX idx_created_at (created_at),
  INDEX idx_payments_status_date (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;