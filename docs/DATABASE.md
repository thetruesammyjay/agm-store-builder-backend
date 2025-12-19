# AGM Store Builder - Database Schema

> Complete MySQL database schema documentation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Design](#database-design)
3. [Tables](#tables)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Stored Procedures](#stored-procedures)
7. [Triggers](#triggers)
8. [Migrations](#migrations)

---

## Overview

### Database Information
- **Database Name**: `agm_store_builder`
- **Database Engine**: MySQL 8.0+
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

### Key Features
- UUID primary keys
- Soft deletes
- Automatic timestamps
- JSON data storage
- Full-text search support
- Optimized indexes

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│    users    │──────>│    stores    │──────>│   products   │
└─────────────┘ 1:N   └──────────────┘ 1:N   └──────────────┘
      │                      │                        │
      │ 1:N                  │ 1:N                    │ N:M
      ▼                      ▼                        ▼
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│bank_accounts│       │    orders    │<──────│ order_items  │
└─────────────┘       └──────────────┘       └──────────────┘
                             │
                             │ 1:1
                             ▼
                      ┌──────────────┐
                      │   payments   │
                      └──────────────┘

┌─────────────────┐
│otp_verifications│
└─────────────────┘
```

---

## Tables

### 1. users

Stores user account information.

**Schema:**
```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**
- `id`: Unique user identifier (UUID)
- `email`: User email address (unique, required)
- `password`: Hashed password (bcrypt)
- `full_name`: User's full name
- `phone`: Phone number (unique, optional)
- `email_verified`: Email verification status
- `phone_verified`: Phone verification status
- `is_active`: Account active status
- `last_login_at`: Last login timestamp
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `deleted_at`: Soft delete timestamp

---

### 2. stores

Stores online shop information.

**Schema:**
```sql
CREATE TABLE stores (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  logo VARCHAR(500),
  banner VARCHAR(500),
  category VARCHAR(100),
  social_links JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_username (username),
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fields:**
- `id`: Unique store identifier
- `user_id`: Store owner (foreign key to users)
- `name`: Store display name
- `username`: Unique store URL slug
- `description`: Store description
- `logo`: Logo image URL
- `banner`: Banner image URL
- `category`: Store category
- `social_links`: Social media links (JSON)
- `is_active`: Store active status

**social_links JSON structure:**
```json
{
  "instagram": "@storename",
  "twitter": "@storename",
  "facebook": "storename",
  "whatsapp": "08012345678"
}
```

---

### 3. products

Stores product information.

**Schema:**
```sql
CREATE TABLE products (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  sku VARCHAR(100),
  barcode VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  weight DECIMAL(10, 2),
  dimensions JSON,
  images JSON NOT NULL,
  variants JSON,
  category VARCHAR(100),
  tags JSON,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_active (is_active),
  INDEX idx_featured (is_featured),
  INDEX idx_stock (stock_quantity),
  FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**JSON Structures:**

**images:**
```json
[
  "https://cloudinary.com/image1.jpg",
  "https://cloudinary.com/image2.jpg"
]
```

**variants:**
```json
[
  {
    "name": "Size",
    "options": ["S", "M", "L", "XL"]
  },
  {
    "name": "Color",
    "options": ["Red", "Blue", "Black"]
  }
]
```

**dimensions:**
```json
{
  "length": 10,
  "width": 5,
  "height": 3,
  "unit": "cm"
}
```

**tags:**
```json
["fashion", "trending", "sale"]
```

---

### 4. orders

Stores customer orders.

**Schema:**
```sql
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id CHAR(36) NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_state VARCHAR(100),
  delivery_lga VARCHAR(100),
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  agm_fee DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_order_number (order_number),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Order Status Flow:**
```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled
```

---

### 5. order_items

Stores individual items in orders.

**Schema:**
```sql
CREATE TABLE order_items (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  variant_selection JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 6. payments

Stores payment transactions.

**Schema:**
```sql
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id CHAR(36) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_reference VARCHAR(100) NOT NULL UNIQUE,
  monnify_reference VARCHAR(100) UNIQUE,
  status ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
  payment_method VARCHAR(50),
  metadata JSON,
  paid_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_payment_reference (payment_reference),
  INDEX idx_monnify_reference (monnify_reference),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 7. bank_accounts

Stores seller bank accounts for payouts.

**Schema:**
```sql
CREATE TABLE bank_accounts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  bank_code VARCHAR(10) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_account_number (account_number),
  UNIQUE KEY unique_account (user_id, account_number, bank_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 8. otp_verifications

Stores OTP codes for verification.

**Schema:**
```sql
CREATE TABLE otp_verifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(6) NOT NULL,
  type ENUM('email_verification', 'phone_verification', 'password_reset', 'login') NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_otp (otp),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Relationships

### One-to-Many Relationships

**users → stores**
- One user can have multiple stores
- Foreign key: `stores.user_id`

**users → bank_accounts**
- One user can have multiple bank accounts
- Foreign key: `bank_accounts.user_id`

**stores → products**
- One store can have multiple products
- Foreign key: `products.store_id`

**stores → orders**
- One store can have multiple orders
- Foreign key: `orders.store_id`

**orders → order_items**
- One order can have multiple items
- Foreign key: `order_items.order_id`

**products → order_items**
- One product can appear in multiple order items
- Foreign key: `order_items.product_id`

### One-to-One Relationships

**orders → payments**
- One order has one payment
- Foreign key: `payments.order_id` (UNIQUE)

---

## Indexes

### Primary Indexes (Automatic)
- All tables have UUID primary key index

### Foreign Key Indexes (Automatic)
- All foreign key columns are indexed

### Custom Indexes

**Performance Indexes:**
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Store lookups
CREATE INDEX idx_stores_username ON stores(username);
CREATE INDEX idx_stores_category ON stores(category);

-- Product queries
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_category ON products(category);

-- Order queries
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Payment queries
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_monnify_reference ON payments(monnify_reference);
```

**Full-Text Search Indexes:**
```sql
-- Store search
CREATE FULLTEXT INDEX idx_stores_search ON stores(name, description);

-- Product search
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);
```

---

## Stored Procedures

### Calculate Order Total

```sql
DELIMITER $$

CREATE PROCEDURE CalculateOrderTotal(IN orderId CHAR(36))
BEGIN
  UPDATE orders o
  SET o.total = (
    SELECT SUM(oi.subtotal)
    FROM order_items oi
    WHERE oi.order_id = orderId
  )
  WHERE o.id = orderId;
END$$

DELIMITER ;
```

### Get Store Statistics

```sql
DELIMITER $$

CREATE PROCEDURE GetStoreStatistics(IN storeId CHAR(36))
BEGIN
  SELECT 
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT o.id) as order_count,
    COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) as total_revenue,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
  FROM stores s
  LEFT JOIN products p ON p.store_id = s.id AND p.deleted_at IS NULL
  LEFT JOIN orders o ON o.store_id = s.id AND o.deleted_at IS NULL
  WHERE s.id = storeId;
END$$

DELIMITER ;
```

---

## Triggers

### Auto-generate Order Number

```sql
DELIMITER $$

CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.order_number IS NULL THEN
    SET NEW.order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 99999), 5, '0'));
  END IF;
END$$

DELIMITER ;
```

### Update Product Stock on Order

```sql
DELIMITER $$

CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
END$$

DELIMITER ;
```

---

## Migrations

### Running Migrations

```bash
# Run all migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database (caution!)
npm run migrate:reset
```

### Migration Files

Located in `database/migrations/`:

1. `001_create_users_table.sql`
2. `002_create_stores_table.sql`
3. `003_create_products_table.sql`
4. `004_create_orders_table.sql`
5. `005_create_payments_table.sql`
6. `006_create_bank_accounts_table.sql`
7. `007_create_otp_verifications_table.sql`
8. `008_create_indexes.sql`

---

## Backup & Restore

### Backup Database

```bash
# Full backup
mysqldump -u root -p agm_store_builder > backup.sql

# Schema only
mysqldump -u root -p --no-data agm_store_builder > schema.sql

# Specific tables
mysqldump -u root -p agm_store_builder users stores > users_stores.sql
```

### Restore Database

```bash
# Restore from backup
mysql -u root -p agm_store_builder < backup.sql
```

---

## Performance Optimization

### Query Optimization Tips

1. **Use indexes** for frequently queried columns
2. **Avoid SELECT *** - Select only needed columns
3. **Use LIMIT** for pagination
4. **Use EXPLAIN** to analyze queries
5. **Cache frequently accessed data**

### Example Optimized Queries

```sql
-- Bad: Full table scan
SELECT * FROM products WHERE name LIKE '%shirt%';

-- Good: Full-text search
SELECT * FROM products WHERE MATCH(name, description) AGAINST('shirt' IN NATURAL LANGUAGE MODE);

-- Bad: N+1 query problem
SELECT * FROM orders;
-- Then for each order:
SELECT * FROM order_items WHERE order_id = ?;

-- Good: JOIN query
SELECT o.*, oi.*
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.store_id = ?;
```

---

## Database Maintenance

### Regular Tasks

```sql
-- Optimize tables
OPTIMIZE TABLE users, stores, products, orders;

-- Analyze tables for query optimization
ANALYZE TABLE users, stores, products, orders;

-- Check table integrity
CHECK TABLE users, stores, products, orders;

-- Repair corrupted tables
REPAIR TABLE table_name;
```

### Monitoring Queries

```sql
-- Show running queries
SHOW FULL PROCESSLIST;

-- Show slow queries
SHOW VARIABLES LIKE 'slow_query%';

-- Show table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'agm_store_builder'
ORDER BY size_mb DESC;
```

---

## Support

For database support:
- **Email**: support@shopwithagm.com
- **Documentation**: https://docs.shopwithagm.com/database

---

**Last Updated**: December 11, 2025  
**Database Version**: 1.0.0