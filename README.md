# AGM Store Builder - Backend API

> Production-ready REST API for AGM Store Builder platform built with Node.js, Express, TypeScript, and MySQL

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-blueviolet.svg)](https://railway.app/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MySQL 8.0+
- Monnify account for payments
- Cloudinary account for image storage
- SendGrid account for emails
- Termii account for SMS

### Installation

```bash
# Clone the repository
git clone https://github.com/thetruesammyjay/agm-store-builder-backend.git
cd agm-store-builder-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your actual values
nano .env

# Build TypeScript
npm run build

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
agm-store-builder-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MySQL connection
│   │   ├── env.ts           # Environment variables
│   │   └── monnify.ts       # Monnify config
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── validation.ts    # Request validation
│   │   ├── errorHandler.ts # Error handling
│   │   ├── rateLimiter.ts  # Rate limiting
│   │   └── cors.ts          # CORS configuration
│   │
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   ├── Store.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   └── BankAccount.ts
│   │
│   ├── controllers/         # Route controllers
│   │   ├── authController.ts
│   │   ├── storeController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── paymentController.ts
│   │   └── uploadController.ts
│   │
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── stores.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   └── upload.ts
│   │
│   ├── services/            # Business logic
│   │   ├── emailService.ts
│   │   ├── smsService.ts
│   │   ├── monnifyService.ts
│   │   ├── cloudinaryService.ts
│   │   └── otpService.ts
│   │
│   ├── utils/               # Utilities
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── database/            # Database files
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── dist/                    # Compiled JavaScript
├── node_modules/           # Dependencies
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── nodemon.json            # Nodemon config
├── .env.example            # Environment template
├── .eslintrc.json          # ESLint config
├── .prettierrc             # Prettier config
├── .gitignore              # Git ignore
├── Dockerfile              # Docker config
├── railway.json            # Railway config
├── railway.toml            # Railway deployment
└── README.md               # This file
```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
NODE_ENV=production
PORT=4000

# Database (Railway MySQL)
DATABASE_URL=mysql://user:password@host:port/database

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Monnify
MONNIFY_API_KEY=your_api_key
MONNIFY_SECRET_KEY=your_secret_key
MONNIFY_CONTRACT_CODE=your_contract_code

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@shopwithagm.com

# Termii
TERMII_API_KEY=your_termii_key
TERMII_SENDER_ID=AGM

# Frontend
FRONTEND_URL=https://shopwithagm.com
```

---

## 📡 API Endpoints

### Base URL

```
Production: https://api.shopwithagm.com/api/v1
Development: http://localhost:4000/api/v1
```

### Authentication

```
POST   /auth/signup          Register new user
POST   /auth/login           Login user
POST   /auth/verify-otp      Verify email/phone OTP
POST   /auth/forgot-password Request password reset
POST   /auth/reset-password  Reset password
GET    /auth/me              Get current user (protected)
```

### Stores

```
POST   /stores               Create store (protected)
GET    /stores/:username     Get store by username (public)
GET    /stores/my-stores     Get user's stores (protected)
PUT    /stores/:storeId      Update store (protected)
GET    /stores/check-username/:username  Check availability (public)
GET    /stores/:storeId/analytics        Get analytics (protected)
```

### Products

```
POST   /stores/:storeId/products          Create product (protected)
GET    /stores/:username/products         List products (public)
GET    /stores/:username/products/:id     Get single product (public)
PUT    /products/:productId               Update product (protected)
DELETE /products/:productId               Delete product (protected)
```

### Orders

```
POST   /stores/:storeId/checkout          Create order & payment (public)
GET    /stores/:storeId/orders            List orders (protected)
GET    /orders/:orderId                   Get order (protected/public)
PUT    /orders/:orderId/status            Update status (protected)
GET    /stores/:storeId/orders/stats      Order statistics (protected)
```

### Payments

```
GET    /payments/verify/:reference        Verify payment (public)
GET    /payments/:reference               Get payment details (public)
POST   /payments/webhook                  Monnify webhook (public)
```

### File Upload

```
POST   /upload/image                      Upload image (protected)
```

---

## 🚀 Deployment

### Railway Deployment

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Add MySQL Database**
   - Go to Railway dashboard
   - Click "New" → "Database" → "MySQL"
   - Copy `DATABASE_URL` to environment variables

3. **Configure Environment Variables**
   - Go to "Variables" tab
   - Add all variables from `.env.example`
   - Railway will auto-detect `railway.json`

4. **Deploy**
   ```bash
   # Link to Railway project
   railway link
   
   # Deploy
   railway up
   
   # Or push to GitHub and connect repo
   ```

5. **Setup Custom Domain**
   - Go to "Settings" → "Domains"
   - Add custom domain: `api.shopwithagm.com`
   - Update DNS: CNAME → `your-project.railway.app`

### Docker Deployment

```bash
# Build image
docker build -t agm-store-builder-backend .

# Run container
docker run -p 4000:4000 \
  --env-file .env \
  agm-store-builder-backend

# Or use Docker Compose
docker-compose up -d
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with hot-reload
npm run build        # Build TypeScript to JavaScript
npm run build:watch  # Watch mode for TypeScript compilation
npm start            # Start production server
npm run lint         # Lint code with ESLint
npm run lint:fix     # Fix linting errors
npm run format       # Format code with Prettier
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
```

### Code Style

- **ESLint**: Enforces code quality
- **Prettier**: Enforces code formatting
- **TypeScript**: Type safety

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint:fix

# Format all files
npm run format
```

---

## 📊 Database Schema

### Tables

- `users` - User accounts
- `stores` - Store information
- `products` - Product catalog
- `orders` - Customer orders
- `payments` - Payment records
- `bank_accounts` - Payout accounts
- `otp_verifications` - Email/phone verification

See [BACKEND_DEVELOPMENT_PROMPT.md](./BACKEND_DEVELOPMENT_PROMPT.md) for complete schema.

---

## 🔐 Security

- **JWT Authentication**: Secure token-based auth
- **Bcrypt**: Password hashing (10 rounds)
- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: DDoS protection (100 req/15min)
- **Input Validation**: Joi schema validation
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization

---

## 📈 Monitoring

### Health Check

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Logging

- **Morgan**: HTTP request logging
- **Winston**: Application logging (optional)
- **Sentry**: Error tracking (optional)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Support

- **Email**: support@shopwithagm.com
- **Phone**: +234 800 123 4567
- **GitHub**: [Issues](https://github.com/thetruesammyjay/agm-store-builder-backend/issues)

---

## 🎯 Roadmap

- [x] Authentication & Authorization
- [x] Store Management
- [x] Product CRUD
- [x] Order Processing
- [x] Monnify Payment Integration
- [x] File Upload (Cloudinary)
- [ ] Advanced Analytics
- [ ] Webhook Notifications
- [ ] Rate Limiting per User
- [ ] API Documentation (Swagger)
- [ ] WebSocket Support
- [ ] Caching (Redis)
- [ ] Search (Elasticsearch)
- [ ] Multi-language Support

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Monnify API Docs](https://teamapt.atlassian.net/wiki/spaces/MON/overview)
- [Railway Documentation](https://docs.railway.app/)

---

**Built with ❤️ by AGM Tech Plus**