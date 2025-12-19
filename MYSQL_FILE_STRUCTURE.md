# AGM Store Builder Backend - MySQL File Structure

> Complete file structure for MySQL-based backend (No Prisma/ORM)

---

## 📁 Complete Directory Structure

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

## 📊 File Count Summary

### Root Files (11)
- Configuration files
- Docker & Railway setup
- Documentation

### Source Files (80+)
- **config/** - 7 files
- **database/** - 10 files (8 migrations + 2 utilities)
- **models/** - 8 files
- **controllers/** - 10 files
- **services/** - 12 files
- **middleware/** - 8 files
- **routes/** - 11 files
- **validators/** - 7 files
- **types/** - 9 files
- **utils/** - 9 files
- **templates/** - 8 files

**Total: ~90 files**

---

## 🎯 Critical Files (Build First)

### Phase 1: Foundation (5 files)
1. ✅ `src/server.ts` - Server entry point
2. ✅ `src/app.ts` - Express setup
3. ✅ `src/config/database.ts` - MySQL connection
4. ✅ `src/middleware/errorHandler.ts` - Error handling
5. ✅ `src/routes/index.ts` - Route aggregator

### Phase 2: Database (10 files)
6. ✅ `src/database/connection.ts` - Connection singleton
7. ✅ `src/database/query.ts` - Query helpers
8. ✅ `src/database/migrations/*.sql` - All 8 migrations
9. ✅ `src/database/migrate.ts` - Migration runner

### Phase 3: Authentication (8 files)
10. ✅ `src/models/User.ts` - User model
11. ✅ `src/controllers/authController.ts` - Auth endpoints
12. ✅ `src/services/authService.ts` - Auth logic
13. ✅ `src/middleware/auth.ts` - JWT middleware
14. ✅ `src/utils/jwt.ts` - JWT utilities
15. ✅ `src/utils/bcrypt.ts` - Password hashing
16. ✅ `src/validators/authValidator.ts` - Auth validation
17. ✅ `src/routes/auth.ts` - Auth routes

### Phase 4: Core Features (Stores, Products, Orders)
18-50. Models, controllers, services, routes for each entity

### Phase 5: Payments (Monnify Integration)
51. ✅ `src/services/monnifyService.ts` - Monnify API
52. ✅ `src/controllers/paymentController.ts` - Payment endpoints
53. ✅ `src/controllers/webhookController.ts` - Webhooks

### Phase 6: Supporting Services
54-90. Upload, email, SMS, analytics, etc.

---

## 🔑 Key Differences from Prisma Structure

### What's Removed:
- ❌ Prisma ORM
- ❌ BullMQ background jobs
- ❌ Redis caching
- ❌ Repository pattern (simplified)
- ❌ Complex job processors

### What's Added:
- ✅ Direct MySQL queries with `mysql2`
- ✅ Manual SQL migrations
- ✅ Simple model classes
- ✅ Query helper functions
- ✅ Simpler architecture

### What's Kept:
- ✅ TypeScript throughout
- ✅ Express.js framework
- ✅ JWT authentication
- ✅ Monnify payment integration
- ✅ File upload (Cloudinary)
- ✅ Email (SendGrid) & SMS (Termii)
- ✅ Rate limiting & security
- ✅ Comprehensive error handling

---

## 📝 Technology Stack

**Core:**
- Node.js 18+
- TypeScript 5.3
- Express.js 4.18

**Database:**
- MySQL 8.0
- mysql2 (driver)

**Authentication:**
- JWT (jsonwebtoken)
- bcrypt

**Payments:**
- Monnify API
- axios

**File Upload:**
- Cloudinary
- multer

**Communication:**
- SendGrid (email)
- Termii (SMS)

**Security:**
- helmet
- cors
- express-rate-limit
- joi (validation)

**Development:**
- nodemon
- ts-node
- ESLint + Prettier

---

## 🚀 Next Steps

**I can now create all files in this structure. Which files would you like me to build first?**

**Recommended order:**
1. **Foundation files** (server.ts, app.ts, database.ts)
2. **Database migrations** (all 8 SQL files)
3. **Authentication system** (complete auth flow)
4. **Core entities** (stores, products, orders)
5. **Payment integration** (Monnify)
6. **Supporting services** (email, SMS, upload)

**Shall I start building?** 🎯