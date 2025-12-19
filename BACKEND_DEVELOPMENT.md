# AGM Store Builder - Backend Development Prompt

> Complete backend implementation guide for AI assistants (Claude, Gemini, ChatGPT, etc.)

---

## 🎯 Project Overview

**Project:** AGM Store Builder - Backend API  
**Tech Stack:** Node.js, Express, MySQL, Monnify Payment Gateway  
**Hosting:** Railway (with MySQL database)  
**Frontend:** Next.js 16 (hosted on Vercel at shopwithagm.com)  
**Target Market:** Nigerian entrepreneurs and SMEs  

**Purpose:** Build a production-ready REST API for an online store builder platform where Nigerian entrepreneurs can create and manage their own e-commerce stores with instant bank payouts via Monnify.

---

## 📁 Project Structure

```
agm-store-builder-backend/
│
├── 📄 package.json                      # Dependencies
├── 📄 tsconfig.json                     # TypeScript config
├── 📄 nodemon.json                      # Nodemon config
├── 📄 .env.example                      # Environment template
├── 📄 .eslintrc.json                    # ESLint config
├── 📄 .prettierrc                       # Prettier config
├── 📄 .gitignore                        # Git ignore
├── 📄 Dockerfile                        # Docker config
├── 📄 railway.json                      # Railway config
├── 📄 railway.toml                      # Railway deployment
├── 📄 README.md                         # Documentation
│
├── 📁 src/
│   │
│   ├── 📄 server.ts                     # Server entry point (CRITICAL)
│   ├── 📄 app.ts                        # Express app setup (CRITICAL)
│   │
│   ├── 📁 config/                       # Configuration files
│   │   ├── database.ts                  # MySQL connection pool (CRITICAL)
│   │   ├── env.ts                       # Environment variables
│   │   ├── monnify.ts                   # Monnify API config
│   │   ├── cloudinary.ts                # Cloudinary config
│   │   ├── email.ts                     # Email service config
│   │   ├── sms.ts                       # SMS service config
│   │   └── constants.ts                 # App constants
│   │
│   ├── 📁 database/                     # Database files
│   │   ├── connection.ts                # DB connection singleton
│   │   ├── query.ts                     # Query helper functions
│   │   │
│   │   ├── 📁 migrations/               # SQL migration files
│   │   │   ├── 001_create_users_table.sql
│   │   │   ├── 002_create_stores_table.sql
│   │   │   ├── 003_create_products_table.sql
│   │   │   ├── 004_create_orders_table.sql
│   │   │   ├── 005_create_payments_table.sql
│   │   │   ├── 006_create_bank_accounts_table.sql
│   │   │   ├── 007_create_otp_verifications_table.sql
│   │   │   └── 008_create_indexes.sql
│   │   │
│   │   ├── 📁 seeds/                    # Seed data
│   │   │   ├── users.seed.ts
│   │   │   ├── stores.seed.ts
│   │   │   └── products.seed.ts
│   │   │
│   │   ├── migrate.ts                   # Migration runner
│   │   └── seed.ts                      # Seed runner
│   │
│   ├── 📁 models/                       # Database models
│   │   ├── User.ts                      # User model
│   │   ├── Store.ts                     # Store model
│   │   ├── Product.ts                   # Product model
│   │   ├── Order.ts                     # Order model
│   │   ├── Payment.ts                   # Payment model
│   │   ├── BankAccount.ts               # Bank account model
│   │   ├── OtpVerification.ts           # OTP model
│   │   └── index.ts                     # Model exports
│   │
│   ├── 📁 controllers/                  # HTTP request handlers
│   │   ├── authController.ts            # Auth endpoints
│   │   ├── userController.ts            # User management
│   │   ├── storeController.ts           # Store CRUD
│   │   ├── productController.ts         # Product CRUD
│   │   ├── orderController.ts           # Order management
│   │   ├── paymentController.ts         # Payment operations
│   │   ├── uploadController.ts          # File uploads
│   │   ├── analyticsController.ts       # Analytics
│   │   ├── webhookController.ts         # Webhook handlers
│   │   └── healthController.ts          # Health check
│   │
│   ├── 📁 services/                     # Business logic layer
│   │   ├── authService.ts               # Auth logic
│   │   ├── userService.ts               # User operations
│   │   ├── storeService.ts              # Store operations
│   │   ├── productService.ts            # Product operations
│   │   ├── orderService.ts              # Order operations
│   │   ├── paymentService.ts            # Payment logic
│   │   ├── monnifyService.ts            # Monnify integration (CRITICAL)
│   │   ├── emailService.ts              # Email sending
│   │   ├── smsService.ts                # SMS sending (Termii)
│   │   ├── uploadService.ts             # File upload (Cloudinary)
│   │   ├── otpService.ts                # OTP generation/verification
│   │   └── analyticsService.ts          # Analytics calculations
│   │
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── auth.ts                      # JWT authentication (CRITICAL)
│   │   ├── validation.ts                # Request validation
│   │   ├── errorHandler.ts              # Global error handler (CRITICAL)
│   │   ├── rateLimiter.ts               # Rate limiting
│   │   ├── cors.ts                      # CORS configuration
│   │   ├── logger.ts                    # Request logging
│   │   ├── upload.ts                    # Multer file upload
│   │   └── webhookVerify.ts             # Webhook signature verification
│   │
│   ├── 📁 routes/                       # API routes
│   │   ├── index.ts                     # Route aggregator (CRITICAL)
│   │   ├── auth.ts                      # /api/v1/auth/*
│   │   ├── users.ts                     # /api/v1/users/*
│   │   ├── stores.ts                    # /api/v1/stores/*
│   │   ├── products.ts                  # /api/v1/products/*
│   │   ├── orders.ts                    # /api/v1/orders/*
│   │   ├── payments.ts                  # /api/v1/payments/*
│   │   ├── upload.ts                    # /api/v1/upload/*
│   │   ├── analytics.ts                 # /api/v1/analytics/*
│   │   ├── webhooks.ts                  # /api/v1/webhooks/*
│   │   └── health.ts                    # /api/v1/health
│   │
│   ├── 📁 validators/                   # Joi validation schemas
│   │   ├── authValidator.ts             # Auth schemas
│   │   ├── userValidator.ts             # User schemas
│   │   ├── storeValidator.ts            # Store schemas
│   │   ├── productValidator.ts          # Product schemas
│   │   ├── orderValidator.ts            # Order schemas
│   │   ├── paymentValidator.ts          # Payment schemas
│   │   └── commonValidator.ts           # Shared schemas
│   │
│   ├── 📁 types/                        # TypeScript types
│   │   ├── index.ts                     # Type exports
│   │   ├── express.d.ts                 # Express extensions
│   │   ├── api.types.ts                 # API types
│   │   ├── user.types.ts                # User types
│   │   ├── store.types.ts               # Store types
│   │   ├── product.types.ts             # Product types
│   │   ├── order.types.ts               # Order types
│   │   ├── payment.types.ts             # Payment types
│   │   └── monnify.types.ts             # Monnify API types
│   │
│   ├── 📁 utils/                        # Utility functions
│   │   ├── jwt.ts                       # JWT operations
│   │   ├── bcrypt.ts                    # Password hashing
│   │   ├── otp.ts                       # OTP generation
│   │   ├── slugify.ts                   # Slug generation
│   │   ├── validators.ts                # Custom validators
│   │   ├── helpers.ts                   # General helpers
│   │   ├── constants.ts                 # Constants
│   │   ├── errors.ts                    # Custom error classes
│   │   └── response.ts                  # Response formatter
│   │
│   └── 📁 templates/                    # Email/SMS templates
│       ├── 📁 email/
│       │   ├── welcome.html             # Welcome email
│       │   ├── otp.html                 # OTP email
│       │   ├── orderConfirmation.html   # Order confirmation
│       │   ├── paymentReceived.html     # Payment received
│       │   └── payoutCompleted.html     # Payout completed
│       │
│       └── 📁 sms/
│           ├── otp.ts                   # OTP SMS template
│           ├── orderConfirmed.ts        # Order confirmed
│           └── paymentReceived.ts       # Payment received
│
├── 📁 tests/                            # Test files
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │
│   └── integration/
│       ├── auth.test.ts
│       ├── stores.test.ts
│       ├── products.test.ts
│       └── orders.test.ts
│
└── 📁 docs/                             # Additional documentation
    ├── API.md                           # API documentation
    ├── DATABASE.md                      # Database schema
    ├── DEPLOYMENT.md                    # Deployment guide
    └── CONTRIBUTING.md                  # Contributing guide
```

---

## 🗄️ Database Schema (MySQL)

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Stores Table
```sql
CREATE TABLE stores (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  template_id ENUM('products', 'bookings', 'portfolio') DEFAULT 'products',
  custom_colors JSON,
  custom_fonts JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_username (username),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Products Table
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  images JSON NOT NULL,
  variations JSON,
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  store_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'confirmed', 'fulfilled', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_address JSON,
  items JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  agm_fee DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  INDEX idx_store_id (store_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Payments Table
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id VARCHAR(36) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL,
  monnify_reference VARCHAR(100),
  account_number VARCHAR(20),
  account_name VARCHAR(255),
  bank_name VARCHAR(100),
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'failed', 'expired') DEFAULT 'pending',
  expires_at TIMESTAMP,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_reference (reference),
  INDEX idx_monnify_reference (monnify_reference),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Bank Accounts Table
```sql
CREATE TABLE bank_accounts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  bank_code VARCHAR(10) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_account_per_user (user_id, account_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### OTP Verifications Table
```sql
CREATE TABLE otp_verifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255),
  phone VARCHAR(20),
  code VARCHAR(6) NOT NULL,
  type ENUM('email', 'phone') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔐 Environment Variables (.env)

```bash
# Server
NODE_ENV=production
PORT=4000
API_VERSION=v1

# Database (Railway MySQL)
DATABASE_URL=mysql://user:password@host:port/database
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Monnify (Payment Gateway)
MONNIFY_API_KEY=your_monnify_api_key
MONNIFY_SECRET_KEY=your_monnify_secret_key
MONNIFY_CONTRACT_CODE=your_contract_code
MONNIFY_BASE_URL=https://api.monnify.com
MONNIFY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=agm-store-builder

# Email (SendGrid or Resend)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@shopwithagm.com
EMAIL_FROM_NAME=AGM Store Builder

# SMS (Termii)
TERMII_API_KEY=your_termii_api_key
TERMII_SENDER_ID=AGM

# Frontend URLs
FRONTEND_URL=https://shopwithagm.com
STORE_BASE_URL=https://*.shopwithagm.com

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# AGM Fee
AGM_FEE_PERCENTAGE=0.01

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

**POST /auth/signup**
```json
Request:
{
  "email": "user@example.com",
  "phone": "+2348012345678",
  "password": "Password123",
  "fullName": "John Doe"
}

Response (201):
{
  "success": true,
  "message": "Account created. Please verify your email.",
  "data": {
    "email": "user@example.com"
  }
}
```

**POST /auth/verify-otp**
```json
Request:
{
  "email": "user@example.com",
  "code": "123456",
  "type": "email"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully"
}
```

**POST /auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "Password123"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "emailVerified": true,
      "phoneVerified": true
    }
  }
}
```

**GET /auth/me** (Protected)
```json
Headers: { "Authorization": "Bearer <token>" }

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+2348012345678",
    "emailVerified": true,
    "phoneVerified": true
  }
}
```

### Stores (`/api/v1/stores`)

**POST /stores** (Protected)
```json
Request:
{
  "username": "mystore",
  "displayName": "My Store",
  "description": "Best products in Nigeria",
  "templateId": "products",
  "customColors": {
    "primary": "#3b82f6",
    "secondary": "#eab308",
    "accent": "#ef4444"
  }
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "mystore",
    "displayName": "My Store",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

**GET /stores/:username** (Public)
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "mystore",
    "displayName": "My Store",
    "description": "Best products in Nigeria",
    "logoUrl": "https://cloudinary.com/...",
    "customColors": { ... },
    "isActive": true
  }
}
```

**GET /stores/my-stores** (Protected)
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "mystore",
      "displayName": "My Store",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**PUT /stores/:storeId** (Protected)
```json
Request:
{
  "displayName": "Updated Store Name",
  "logoUrl": "https://cloudinary.com/new-logo.png"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

**GET /stores/check-username/:username** (Public)
```json
Response (200):
{
  "success": true,
  "available": false
}
```

### Products (`/api/v1/products`)

**POST /stores/:storeId/products** (Protected)
```json
Request:
{
  "name": "Nike Air Max",
  "description": "Original Nike sneakers",
  "price": 45000,
  "compareAtPrice": 55000,
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "variations": [
    {
      "name": "Size",
      "options": ["40", "41", "42", "43"]
    },
    {
      "name": "Color",
      "options": ["Black", "White", "Red"]
    }
  ],
  "stockQuantity": 50,
  "isActive": true
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nike Air Max",
    "price": 45000,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

**GET /stores/:username/products** (Public)
```json
Query Parameters:
?page=1&limit=20&search=nike&minPrice=10000&maxPrice=50000&inStock=true&sortBy=price&sortOrder=asc

Response (200):
{
  "success": true,
  "data": {
    "products": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**GET /stores/:username/products/:productId** (Public)
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nike Air Max",
    "description": "Original Nike sneakers",
    "price": 45000,
    "compareAtPrice": 55000,
    "images": [ ... ],
    "variations": [ ... ],
    "stockQuantity": 50,
    "isActive": true
  }
}
```

**PUT /products/:productId** (Protected)
```json
Request:
{
  "price": 42000,
  "stockQuantity": 45
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

**DELETE /products/:productId** (Protected)
```json
Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Orders (`/api/v1/orders`)

**POST /stores/:storeId/checkout** (Public)
```json
Request:
{
  "customerName": "Jane Doe",
  "customerPhone": "+2348012345678",
  "customerEmail": "jane@example.com",
  "customerAddress": {
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001"
  },
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "selectedVariations": {
        "Size": "42",
        "Color": "Black"
      }
    }
  ]
}

Response (201):
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "AGM-2025-001234",
      "total": 90909
    },
    "payment": {
      "reference": "AGM-PAY-xxx",
      "expiresAt": "2025-01-15T10:30:00Z",
      "accountNumber": "1234567890",
      "accountName": "AGM STORE BUILDER - MYSTORE",
      "bankName": "Wema Bank",
      "amount": 90909
    }
  }
}
```

**GET /stores/:storeId/orders** (Protected)
```json
Query Parameters:
?page=1&limit=20&status=pending&paymentStatus=paid&startDate=2025-01-01&endDate=2025-01-31

Response (200):
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "AGM-2025-001234",
        "status": "pending",
        "paymentStatus": "paid",
        "customerName": "Jane Doe",
        "customerPhone": "+2348012345678",
        "total": 90909,
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**GET /orders/:orderId** (Protected or Public with reference)
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "AGM-2025-001234",
    "status": "pending",
    "paymentStatus": "paid",
    "customerName": "Jane Doe",
    "customerPhone": "+2348012345678",
    "customerEmail": "jane@example.com",
    "customerAddress": { ... },
    "items": [
      {
        "productId": "uuid",
        "productName": "Nike Air Max",
        "productImage": "https://...",
        "quantity": 2,
        "price": 45000,
        "selectedVariations": { ... }
      }
    ],
    "subtotal": 90000,
    "agmFee": 909,
    "total": 90909,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

**PUT /orders/:orderId/status** (Protected)
```json
Request:
{
  "status": "fulfilled"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

**GET /stores/:storeId/orders/stats** (Protected)
```json
Response (200):
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "confirmed": 50,
    "fulfilled": 70,
    "cancelled": 5,
    "revenue": 4545450,
    "averageOrderValue": 30303
  }
}
```

### Payments (`/api/v1/payments`)

**GET /payments/verify/:reference** (Public)
```json
Response (200):
{
  "success": true,
  "data": {
    "status": "paid",
    "order": {
      "id": "uuid",
      "orderNumber": "AGM-2025-001234"
    }
  }
}
```

**GET /payments/:reference** (Public)
```json
Response (200):
{
  "success": true,
  "data": {
    "reference": "AGM-PAY-xxx",
    "status": "pending",
    "expiresAt": "2025-01-15T10:30:00Z",
    "accountNumber": "1234567890",
    "accountName": "AGM STORE BUILDER - MYSTORE",
    "bankName": "Wema Bank",
    "amount": 90909,
    "order": {
      "id": "uuid",
      "orderNumber": "AGM-2025-001234",
      "total": 90909
    }
  }
}
```

**POST /payments/webhook** (Monnify Webhook)
```json
Request (from Monnify):
{
  "eventType": "SUCCESSFUL_TRANSACTION",
  "eventData": {
    "transactionReference": "monnify-ref",
    "paymentReference": "AGM-PAY-xxx",
    "amountPaid": "90909.00",
    "paidOn": "2025-01-15T10:15:00Z",
    "paymentStatus": "PAID"
  }
}

Response (200):
{
  "success": true
}
```

### File Upload (`/api/v1/upload`)

**POST /upload/image** (Protected)
```json
Request (multipart/form-data):
- image: File
- type: "logo" | "product" | "banner"

Response (200):
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/agm/image/upload/v1234567890/agm-store-builder/products/image.jpg"
  }
}
```

---

## 🔧 Key Implementation Requirements

### 1. Authentication & Security

**JWT Implementation:**
```javascript
// Generate token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// Verify token middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
};
```

**Password Hashing:**
```javascript
const bcrypt = require('bcrypt');

// Hash password
const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

// Verify password
const isValid = await bcrypt.compare(password, user.password_hash);
```

**Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS), // 100 requests
  message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);
```

### 2. Monnify Integration

**Initialize Transaction:**
```javascript
const monnifyService = {
  async createReservedAccount(orderNumber, customerName, customerEmail) {
    const auth = Buffer.from(
      `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
    ).toString('base64');

    const response = await axios.post(
      `${process.env.MONNIFY_BASE_URL}/api/v1/bank-transfer/reserved-accounts`,
      {
        accountReference: orderNumber,
        accountName: customerName,
        currencyCode: 'NGN',
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        customerEmail: customerEmail,
        customerName: customerName,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.responseBody;
  },

  async verifyTransaction(reference) {
    const auth = Buffer.from(
      `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
    ).toString('base64');

    const response = await axios.get(
      `${process.env.MONNIFY_BASE_URL}/api/v1/transactions/${reference}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.responseBody;
  },
};
```

**Webhook Handler:**
```javascript
const crypto = require('crypto');

const verifyMonnifyWebhook = (req, res, next) => {
  const hash = crypto
    .createHmac('sha512', process.env.MONNIFY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['monnify-signature']) {
    next();
  } else {
    res.status(401).json({ success: false, error: { message: 'Invalid signature' } });
  }
};

app.post('/api/v1/payments/webhook', verifyMonnifyWebhook, async (req, res) => {
  const { eventType, eventData } = req.body;

  if (eventType === 'SUCCESSFUL_TRANSACTION') {
    // Update payment and order status
    await Payment.update(
      {
        status: 'paid',
        monnify_reference: eventData.transactionReference,
        paid_at: new Date(eventData.paidOn),
      },
      { where: { reference: eventData.paymentReference } }
    );

    await Order.update(
      { payment_status: 'paid', status: 'confirmed' },
      { where: { order_number: eventData.paymentReference.split('-')[0] } }
    );

    // Send confirmation email/SMS
    await emailService.sendOrderConfirmation(order, payment);
  }

  res.json({ success: true });
});
```

### 3. Cloudinary Image Upload

```javascript
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_IMAGE_TYPES.split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const uploadController = {
  async uploadImage(req, res) {
    try {
      const { type } = req.body;
      const file = req.file;

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${process.env.CLOUDINARY_FOLDER}/${type}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      res.json({
        success: true,
        data: { url: result.secure_url },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: 'Upload failed' },
      });
    }
  },
};
```

### 4. Email & SMS Notifications

**SendGrid Email:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailService = {
  async sendOTP(email, code) {
    await sgMail.send({
      to: email,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject: 'Verify Your Email',
      html: `
        <h1>Welcome to AGM Store Builder</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
    });
  },

  async sendOrderConfirmation(order, payment) {
    await sgMail.send({
      to: order.customer_email,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject: `Order Confirmed - ${order.order_number}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order.</p>
        <p>Order Number: ${order.order_number}</p>
        <p>Total: ₦${order.total.toLocaleString()}</p>
      `,
    });
  },
};
```

**Termii SMS:**
```javascript
const axios = require('axios');

const smsService = {
  async sendOTP(phone, code) {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: process.env.TERMII_SENDER_ID,
      sms: `Your AGM Store Builder verification code is: ${code}. Valid for 10 minutes.`,
      type: 'plain',
      channel: 'generic',
    });
  },
};
```

### 5. Error Handling

**Global Error Handler:**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: err.details,
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid token' },
    });
  }

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: { message: 'Resource already exists' },
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code,
    },
  });
};

app.use(errorHandler);
```

### 6. CORS Configuration

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    /\.shopwithagm\.com$/, // Allow all subdomains
    'http://localhost:3000', // Development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

## 🚀 Railway Deployment

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "node src/database/migrate.js",
    "seed": "node src/database/seed.js"
  }
}
```

### Railway Environment Setup
1. Create new project on Railway
2. Add MySQL database (Railway provides this)
3. Add environment variables from .env
4. Deploy from GitHub repo
5. Configure custom domain (api.shopwithagm.com)

---

## 📝 Implementation Checklist

### Phase 1: Setup (Day 1)
- [ ] Initialize Node.js project
- [ ] Setup Express server
- [ ] Configure MySQL connection (Railway)
- [ ] Setup environment variables
- [ ] Implement error handling middleware
- [ ] Setup CORS

### Phase 2: Authentication (Day 2-3)
- [ ] User registration with validation
- [ ] Password hashing (bcrypt)
- [ ] OTP generation and verification
- [ ] Email/SMS sending
- [ ] JWT token generation
- [ ] Login endpoint
- [ ] Auth middleware
- [ ] Protected routes

### Phase 3: Store Management (Day 4-5)
- [ ] Create store endpoint
- [ ] Get store by username
- [ ] Update store
- [ ] Check username availability
- [ ] Store analytics endpoint

### Phase 4: Product Management (Day 6-7)
- [ ] Create product
- [ ] List products with filters
- [ ] Get single product
- [ ] Update product
- [ ] Delete product
- [ ] Image upload (Cloudinary)

### Phase 5: Order & Payment (Day 8-10)
- [ ] Checkout endpoint
- [ ] Monnify integration
- [ ] Generate reserved account
- [ ] Payment verification
- [ ] Webhook handler
- [ ] Order status updates
- [ ] Order notifications

### Phase 6: Testing & Deployment (Day 11-14)
- [ ] Write tests (Jest)
- [ ] API documentation (Postman/Swagger)
- [ ] Deploy to Railway
- [ ] Configure custom domain
- [ ] Setup monitoring
- [ ] Performance optimization

---

## 🎯 Success Criteria

- ✅ All endpoints respond within 500ms
- ✅ 99.9% uptime
- ✅ Proper error handling on all routes
- ✅ Secure authentication (JWT)
- ✅ Rate limiting implemented
- ✅ Payment webhooks working
- ✅ Email/SMS notifications sent
- ✅ Images uploaded to Cloudinary
- ✅ Database properly indexed
- ✅ CORS configured correctly

---

## 📚 Resources

**Documentation:**
- Express.js: https://expressjs.com
- MySQL: https://dev.mysql.com/doc
- Monnify API: https://teamapt.atlassian.net/wiki/spaces/MON/overview
- Cloudinary: https://cloudinary.com/documentation
- SendGrid: https://docs.sendgrid.com
- Termii: https://developers.termii.com
- Railway: https://docs.railway.app

**NPM Packages:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "axios": "^1.6.2",
    "cloudinary": "^1.41.1",
    "multer": "^1.4.5-lts.1",
    "@sendgrid/mail": "^7.7.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 🔒 Security Best Practices

1. **Never expose sensitive data in responses**
2. **Always hash passwords with bcrypt**
3. **Validate all inputs with Joi**
4. **Use parameterized queries (prevent SQL injection)**
5. **Implement rate limiting on all routes**
6. **Verify webhook signatures**
7. **Use HTTPS only in production**
8. **Set secure HTTP headers with Helmet**
9. **Sanitize user inputs**
10. **Log all errors but never expose stack traces to clients**


This prompt contains everything needed to build a production-ready backend. Follow the structure, implement the endpoints, and deploy to Railway. The frontend is already built and waiting on Vercel!

**Good luck building! 🚀**