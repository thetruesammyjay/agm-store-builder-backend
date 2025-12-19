backend/
│
├── 📁 prisma/                           # Prisma ORM
│   ├── schema.prisma                    # Database schema (CRITICAL)
│   ├── seed.ts                          # Database seeding
│   │
│   └── 📁 migrations/                   # Database migrations
│       ├── 20250101000000_init/
│       │   └── migration.sql
│       ├── 20250102000000_add_virtual_accounts/
│       │   └── migration.sql
│       └── 20250103000000_add_reviews/
│           └── migration.sql
│
├── 📁 src/
│   │
│   ├── index.ts                         # Entry point
│   ├── app.ts                           # Express app setup
│   ├── server.ts                        # Server startup
│   │
│   ├── 📁 config/                       # Configuration files
│   │   ├── database.ts                  # Prisma client singleton
│   │   ├── redis.ts                     # Redis client
│   │   ├── aws.ts                       # S3 config
│   │   ├── cloudinary.ts                # Cloudinary config (alternative)
│   │   ├── monnify.ts                   # Monnify API config
│   │   ├── paystack.ts                  # Paystack config
│   │   ├── termii.ts                    # Termii SMS config
│   │   ├── resend.ts                    # Resend email config
│   │   ├── jwt.ts                       # JWT config
│   │   ├── cors.ts                      # CORS settings
│   │   ├── rate-limit.ts                # Rate limiter config
│   │   └── constants.ts                 # App constants
│   │
│   ├── 📁 controllers/                  # HTTP request handlers
│   │   ├── auth.controller.ts           # Auth endpoints
│   │   ├── user.controller.ts           # User management
│   │   ├── store.controller.ts          # Store CRUD
│   │   ├── product.controller.ts        # Product CRUD
│   │   ├── order.controller.ts          # Order management
│   │   ├── payment.controller.ts        # Payment operations
│   │   ├── upload.controller.ts         # File uploads
│   │   ├── dashboard.controller.ts      # Analytics
│   │   ├── customer.controller.ts       # Customer data
│   │   ├── review.controller.ts         # Reviews
│   │   ├── webhook.controller.ts        # Webhook handlers
│   │   └── health.controller.ts         # Health check
│   │
│   ├── 📁 services/                     # Business logic layer
│   │   ├── auth.service.ts              # Auth logic
│   │   ├── user.service.ts              # User operations
│   │   ├── store.service.ts             # Store operations
│   │   ├── product.service.ts           # Product operations
│   │   ├── order.service.ts             # Order operations
│   │   ├── payment.service.ts           # Payment orchestration
│   │   ├── monnify.service.ts           # Monnify integration
│   │   ├── paystack.service.ts          # Paystack integration
│   │   ├── email.service.ts             # Email sending
│   │   ├── sms.service.ts               # SMS sending
│   │   ├── upload.service.ts            # File upload (S3/Cloudinary)
│   │   ├── analytics.service.ts         # Analytics calculations
│   │   ├── notification.service.ts      # Multi-channel notifications
│   │   ├── otp.service.ts               # OTP generation/verification
│   │   └── cache.service.ts             # Redis caching
│   │
│   ├── 📁 repositories/                 # Data access layer
│   │   ├── user.repository.ts           # User DB queries
│   │   ├── store.repository.ts          # Store DB queries
│   │   ├── product.repository.ts        # Product DB queries
│   │   ├── order.repository.ts          # Order DB queries
│   │   ├── transaction.repository.ts    # Transaction DB queries
│   │   ├── bank-account.repository.ts   # Bank account queries
│   │   ├── virtual-account.repository.ts # Virtual account queries
│   │   ├── customer.repository.ts       # Customer queries
│   │   └── review.repository.ts         # Review queries
│   │
│   ├── 📁 middleware/                   # Express middleware
│   │   ├── auth.middleware.ts           # JWT verification
│   │   ├── validate.middleware.ts       # Request validation
│   │   ├── error.middleware.ts          # Error handling
│   │   ├── rate-limit.middleware.ts     # Rate limiting
│   │   ├── cors.middleware.ts           # CORS setup
│   │   ├── logger.middleware.ts         # Request logging
│   │   ├── upload.middleware.ts         # Multer setup
│   │   ├── webhook-verify.middleware.ts # Webhook signature verification
│   │   └── owner.middleware.ts          # Resource ownership check
│   │
│   ├── 📁 routes/                       # API routes
│   │   ├── index.ts                     # Route aggregator
│   │   ├── auth.routes.ts               # /api/v1/auth/*
│   │   ├── user.routes.ts               # /api/v1/users/*
│   │   ├── store.routes.ts              # /api/v1/stores/*
│   │   ├── product.routes.ts            # /api/v1/products/*
│   │   ├── order.routes.ts              # /api/v1/orders/*
│   │   ├── payment.routes.ts            # /api/v1/payments/*
│   │   ├── upload.routes.ts             # /api/v1/upload/*
│   │   ├── dashboard.routes.ts          # /api/v1/dashboard/*
│   │   ├── customer.routes.ts           # /api/v1/customers/*
│   │   ├── review.routes.ts             # /api/v1/reviews/*
│   │   ├── webhook.routes.ts            # /api/v1/webhooks/*
│   │   └── health.routes.ts             # /api/v1/health
│   │
│   ├── 📁 validators/                   # Zod validation schemas
│   │   ├── auth.validator.ts            # Auth schemas
│   │   ├── user.validator.ts            # User schemas
│   │   ├── store.validator.ts           # Store schemas
│   │   ├── product.validator.ts         # Product schemas
│   │   ├── order.validator.ts           # Order schemas
│   │   ├── payment.validator.ts         # Payment schemas
│   │   ├── review.validator.ts          # Review schemas
│   │   └── common.validator.ts          # Shared schemas
│   │
│   ├── 📁 jobs/                         # Background jobs (BullMQ)
│   │   ├── index.ts                     # Job exports
│   │   ├── queues.ts                    # Queue definitions
│   │   ├── workers.ts                   # Worker setup
│   │   │
│   │   ├── 📁 processors/               # Job processors
│   │   │   ├── payout.processor.ts      # Process payouts
│   │   │   ├── notification.processor.ts # Send notifications
│   │   │   ├── analytics.processor.ts   # Update analytics
│   │   │   ├── email.processor.ts       # Send emails
│   │   │   └── sms.processor.ts         # Send SMS
│   │   │
│   │   └── 📁 schedulers/               # Scheduled jobs
│   │       ├── daily-summary.ts         # Daily sales summary
│   │       ├── abandoned-cart.ts        # Abandoned cart reminders
│   │       └── inventory-alerts.ts      # Low stock alerts
│   │
│   ├── 📁 types/                        # TypeScript types
│   │   ├── index.ts                     # Type exports
│   │   ├── express.d.ts                 # Express type extensions
│   │   ├── user.types.ts                # User types
│   │   ├── store.types.ts               # Store types
│   │   ├── product.types.ts             # Product types
│   │   ├── order.types.ts               # Order types
│   │   ├── payment.types.ts             # Payment types
│   │   ├── monnify.types.ts             # Monnify API types
│   │   ├── paystack.types.ts            # Paystack API types
│   │   └── job.types.ts                 # Job types
│   │
│   ├── 📁 utils/                        # Utility functions
│   │   ├── bcrypt.util.ts               # Password hashing
│   │   ├── jwt.util.ts                  # JWT operations
│   │   ├── otp.util.ts                  # OTP generation
│   │   ├── slug.util.ts                 # Slug generation
│   │   ├── date.util.ts                 # Date utilities
│   │   ├── currency.util.ts             # Currency formatting
│   │   ├── validator.util.ts            # Custom validators
│   │   ├── error.util.ts                # Error handling
│   │   ├── response.util.ts             # Response formatting
│   │   └── webhook.util.ts              # Webhook verification
│   │
│   ├── 📁 lib/                          # External integrations
│   │   ├── prisma.ts                    # Prisma client
│   │   ├── redis.ts                     # Redis client
│   │   ├── logger.ts                    # Winston logger
│   │   ├── sentry.ts                    # Sentry error tracking
│   │   └── metrics.ts                   # Performance metrics
│   │
│   ├── 📁 constants/                    # Application constants
│   │   ├── errors.ts                    # Error codes/messages
│   │   ├── messages.ts                  # Success messages
│   │   ├── status-codes.ts              # HTTP status codes
│   │   ├── reserved-usernames.ts        # Reserved usernames list
│   │   ├── templates.ts                 # Store template IDs
│   │   └── banks.ts                     # Nigerian bank list
│   │
│   └── 📁 templates/                    # Email/SMS templates
│       ├── 📁 email/
│       │   ├── welcome.html             # Welcome email
│       │   ├── otp.html                 # OTP email
│       │   ├── order-confirmation.html
│       │   ├── payment-received.html
│       │   └── payout-completed.html
│       │
│       └── 📁 sms/
│           ├── otp.ts                   # OTP SMS template
│           ├── order-confirmed.ts
│           └── payment-received.ts
│
├── 📁 tests/                            # Backend tests
│   ├── 📁 unit/
│   │   ├── 📁 services/
│   │   │   ├── auth.service.test.ts
│   │   │   ├── store.service.test.ts
│   │   │   ├── product.service.test.ts
│   │   │   ├── order.service.test.ts
│   │   │   └── payment.service.test.ts
│   │   │
│   │   ├── 📁 repositories/
│   │   │   ├── user.repository.test.ts
│   │   │   └── store.repository.test.ts
│   │   │
│   │   └── 📁 utils/
│   │       ├── jwt.util.test.ts
│   │       ├── otp.util.test.ts
│   │       └── currency.util.test.ts
│   │
│   ├── 📁 integration/
│   │   ├── auth.test.ts                 # Auth endpoints
│   │   ├── store.test.ts                # Store endpoints
│   │   ├── product.test.ts              # Product endpoints
│   │   ├── order.test.ts                # Order endpoints
│   │   ├── payment.test.ts              # Payment endpoints
│   │   └── webhook.test.ts              # Webhook endpoints
│   │
│   ├── 📁 e2e/
│   │   ├── full-checkout.test.ts        # Complete checkout flow
│   │   ├── store-creation.test.ts       # Store setup flow
│   │   └── payment-webhook.test.ts      # Payment flow
│   │
│   ├── setup.ts                         # Test setup
│   ├── teardown.ts                      # Test cleanup
│   └── helpers.ts                       # Test utilities
│
├── 📁 scripts/                          # Utility scripts
│   ├── seed.ts                          # Seed database
│   ├── reset-db.ts                      # Reset database
│   ├── generate-banks.ts                # Fetch Nigerian banks
│   └── migrate.ts                       # Run migrations
│
├── 📄 package.json                      # Dependencies
├── 📄 package-lock.json
├── 📄 tsconfig.json                     # TypeScript config
├── 📄 nodemon.json                      # Nodemon config
├── 📄 .env                              # Environment variables
├── 📄 .env.example                      # Environment template
├── 📄 .eslintrc.json                    # ESLint config
├── 📄 .prettierrc                       # Prettier config
├── 📄 .gitignore                        # Git ignore
├── 📄 Dockerfile                        # Docker config
├── 📄 railway.json                      # Railway config (IMPORTANT)
├── 📄 railway.toml                      # Railway deployment
└── 📄 README.md                         # Backend docs