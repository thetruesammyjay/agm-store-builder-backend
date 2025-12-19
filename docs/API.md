# AGM Store Builder - API Documentation

> Complete REST API reference for the AGM Store Builder backend

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Versioning](#base-url--versioning)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#user-endpoints)
   - [Stores](#store-endpoints)
   - [Products](#product-endpoints)
   - [Orders](#order-endpoints)
   - [Payments](#payment-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Upload](#upload-endpoints)
   - [Webhooks](#webhook-endpoints)

---

## Overview

The AGM Store Builder API is a RESTful API built with Express.js and TypeScript. It provides endpoints for managing online stores, products, orders, and payments through Monnify integration.

### Key Features
- JWT-based authentication
- Role-based access control
- Real-time payment verification
- Image upload to Cloudinary
- Email notifications (SendGrid)
- SMS notifications (Termii)
- Comprehensive analytics

---

## Authentication

### JWT Token Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Lifecycle
- **Access Token**: Expires in 15 minutes
- **Refresh Token**: Expires in 7 days

### Getting Tokens
1. Register or login to receive tokens
2. Use access token for API requests
3. Use refresh token to get new access token when expired

---

## Base URL & Versioning

### Development
```
http://localhost:5000/api/v1
```

### Production
```
https://api.shopwithagm.com/api/v1
```

### Versioning
All endpoints are versioned. Current version: `v1`

---

## Request/Response Format

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

### Success Response Format
```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

### Pagination Response Format
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "details": {}
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error
- `502` - Bad Gateway (External Service Error)

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## API Endpoints

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "08012345678"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "phone": "08012345678"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Registration successful"
}
```

---

### Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

---

### Refresh Token

**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Request Password Reset

**POST** `/auth/forgot-password`

Request password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

---

### Verify OTP

**POST** `/auth/verify-otp`

Verify OTP for password reset.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "resetToken": "temp_token_for_password_reset"
  },
  "message": "OTP verified successfully"
}
```

---

### Reset Password

**POST** `/auth/reset-password`

Reset password with verified token.

**Request Body:**
```json
{
  "resetToken": "temp_token_from_verify_otp",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## User Endpoints

### Get Current User

**GET** `/users/me`

Get authenticated user's profile.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "08012345678",
    "email_verified": true,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Update Profile

**PUT** `/users/me`

Update user profile.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "full_name": "John Updated Doe",
  "phone": "08087654321"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "John Updated Doe",
    "phone": "08087654321"
  },
  "message": "Profile updated successfully"
}
```

---

### Change Password

**POST** `/users/change-password`

Change user password.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Store Endpoints

### Create Store

**POST** `/stores`

Create a new store.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "name": "My Awesome Store",
  "username": "myawesomestore",
  "description": "We sell amazing products",
  "category": "fashion",
  "logo": "https://cloudinary.com/...",
  "banner": "https://cloudinary.com/...",
  "social_links": {
    "instagram": "@mystore",
    "twitter": "@mystore"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Awesome Store",
    "username": "myawesomestore",
    "description": "We sell amazing products",
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  "message": "Store created successfully"
}
```

---

### Check Username Availability

**GET** `/stores/check/:username`

Check if store username is available (public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "username": "myawesomestore",
    "available": false
  }
}
```

---

### Get My Stores

**GET** `/stores/my-stores`

Get all stores owned by authenticated user.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Store",
      "username": "mystore",
      "is_active": true,
      "product_count": 15,
      "order_count": 42
    }
  ]
}
```

---

### Get Store by Username

**GET** `/stores/:username`

Get public store details (public endpoint).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Store",
    "username": "mystore",
    "description": "Store description",
    "logo": "https://cloudinary.com/...",
    "banner": "https://cloudinary.com/...",
    "category": "fashion",
    "is_active": true,
    "social_links": {}
  }
}
```

---

### Update Store

**PUT** `/stores/:storeId`

Update store details.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "name": "Updated Store Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Store Name",
    "description": "Updated description"
  },
  "message": "Store updated successfully"
}
```

---

### Toggle Store Status

**PATCH** `/stores/:storeId/status`

Activate or deactivate store.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_active": false
  },
  "message": "Store deactivated successfully"
}
```

---

### Delete Store

**DELETE** `/stores/:storeId`

Delete a store (soft delete).

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Store deleted successfully"
}
```

---

## Product Endpoints

### Create Product

**POST** `/products`

Create a new product.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "store_id": "store_uuid",
  "name": "Amazing T-Shirt",
  "description": "High quality cotton t-shirt",
  "price": 5000,
  "stock_quantity": 100,
  "category": "clothing",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "variants": [
    {
      "name": "Size",
      "options": ["S", "M", "L", "XL"]
    },
    {
      "name": "Color",
      "options": ["Red", "Blue", "Black"]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Amazing T-Shirt",
    "price": 5000,
    "stock_quantity": 100,
    "is_active": true
  },
  "message": "Product created successfully"
}
```

---

### List Products

**GET** `/stores/:username/products`

List all products for a store (public).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string)
- `search` (string)
- `sort` (string: `price_asc`, `price_desc`, `newest`, `popular`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 5000,
      "images": ["url1", "url2"],
      "stock_quantity": 100,
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### Get Single Product

**GET** `/stores/:username/products/:productId`

Get product details (public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 5000,
    "stock_quantity": 100,
    "images": ["url1", "url2"],
    "variants": [],
    "category": "clothing",
    "store": {
      "name": "Store Name",
      "username": "storeusername"
    }
  }
}
```

---

### Update Product

**PUT** `/products/:productId`

Update product details.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 6000,
  "stock_quantity": 150
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "price": 6000
  },
  "message": "Product updated successfully"
}
```

---

### Update Stock

**PATCH** `/products/:productId/stock`

Update product stock quantity.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "stock_quantity": 200
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "stock_quantity": 200
  },
  "message": "Stock updated successfully"
}
```

---

### Delete Product

**DELETE** `/products/:productId`

Delete a product.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order Endpoints

### Create Order

**POST** `/orders`

Create a new order (public checkout).

**Request Body:**
```json
{
  "store_username": "mystore",
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "08012345678",
  "delivery_address": "123 Main St, Lagos",
  "delivery_state": "Lagos",
  "delivery_lga": "Ikeja",
  "items": [
    {
      "product_id": "product_uuid",
      "quantity": 2
    }
  ],
  "notes": "Please deliver before 5pm"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "ORD-20250101-XXXXX",
      "total": 10000,
      "status": "pending",
      "payment_status": "pending"
    },
    "payment": {
      "id": "payment_uuid",
      "payment_reference": "ORD-20250101-XXXXX",
      "amount": 10000,
      "accountDetails": {
        "accountNumber": "1234567890",
        "accountName": "AGM Store Builder",
        "bankName": "Wema Bank",
        "amount": 10000
      },
      "expires_at": "2025-01-01T01:00:00.000Z"
    }
  },
  "message": "Order created successfully. Please complete payment."
}
```

---

### Track Order

**GET** `/orders/track/:orderNumber`

Track order status (public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "order_number": "ORD-20250101-XXXXX",
    "status": "confirmed",
    "payment_status": "paid",
    "total": 10000,
    "created_at": "2025-01-01T00:00:00.000Z",
    "items": [
      {
        "product_name": "Product Name",
        "quantity": 2,
        "price": 5000
      }
    ]
  }
}
```

---

### List Orders

**GET** `/orders`

List all orders for authenticated user.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string)
- `payment_status` (string)
- `store_id` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20250101-XXXXX",
      "customer_name": "Jane Doe",
      "total": 10000,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

---

### Get Order Details

**GET** `/orders/:orderId`

Get detailed order information.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20250101-XXXXX",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "customer_phone": "08012345678",
    "delivery_address": "123 Main St, Lagos",
    "subtotal": 10000,
    "total": 10000,
    "agm_fee": 250,
    "status": "confirmed",
    "payment_status": "paid",
    "items": [
      {
        "product_name": "Product Name",
        "quantity": 2,
        "price": 5000,
        "subtotal": 10000
      }
    ]
  }
}
```

---

### Update Order Status

**PATCH** `/orders/:orderId/status`

Update order status.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid statuses:** `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed"
  },
  "message": "Order status updated"
}
```

---

## Payment Endpoints

### Verify Payment

**GET** `/payments/verify/:reference`

Verify payment status (public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "verified": true,
    "status": "paid",
    "payment": {
      "id": "uuid",
      "payment_reference": "ORD-20250101-XXXXX",
      "amount": 10000,
      "status": "paid"
    }
  }
}
```

---

### Get Payment Details

**GET** `/payments/:reference`

Get payment details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "payment_reference": "ORD-20250101-XXXXX",
    "amount": 10000,
    "status": "paid",
    "monnify_reference": "MNFY|20250101000000|XXXXXX",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Add Bank Account

**POST** `/payments/bank-accounts`

Add bank account for payouts.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "account_name": "John Doe",
  "account_number": "0123456789",
  "bank_code": "057",
  "bank_name": "Zenith Bank"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "account_name": "John Doe",
    "account_number": "0123456789",
    "bank_name": "Zenith Bank",
    "is_primary": true
  },
  "message": "Bank account added successfully"
}
```

---

### List Bank Accounts

**GET** `/payments/bank-accounts`

Get user's bank accounts.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "account_name": "John Doe",
      "account_number": "0123456789",
      "bank_name": "Zenith Bank",
      "is_primary": true
    }
  ]
}
```

---

### Set Primary Bank Account

**PUT** `/payments/bank-accounts/:accountId/primary`

Set bank account as primary.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_primary": true
  },
  "message": "Primary bank account updated"
}
```

---

### Delete Bank Account

**DELETE** `/payments/bank-accounts/:accountId`

Delete bank account.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

---

### Get Nigerian Banks

**GET** `/payments/banks`

Get list of Nigerian banks (public).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "code": "057",
      "name": "Zenith Bank"
    },
    {
      "code": "058",
      "name": "GTBank"
    }
  ]
}
```

---

## Analytics Endpoints

### Dashboard Analytics

**GET** `/analytics/dashboard`

Get dashboard overview.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalRevenue": 500000,
    "totalOrders": 150,
    "pendingOrders": 10,
    "completedOrders": 140,
    "stores": [
      {
        "id": "uuid",
        "name": "My Store",
        "username": "mystore"
      }
    ]
  }
}
```

---

### Revenue Stats

**GET** `/analytics/revenue`

Get revenue statistics.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalRevenue": 500000,
    "thisMonth": 50000,
    "lastMonth": 45000,
    "growth": 11.11
  }
}
```

---

## Upload Endpoints

### Upload Image

**POST** `/upload/image`

Upload single image.

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "secure_url": "https://res.cloudinary.com/...",
    "public_id": "agm-store/user_id/xxxxx"
  }
}
```

---

### Upload Multiple Images

**POST** `/upload/images`

Upload multiple images (max 5).

**Headers:**
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- `images` (files array)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "secure_url": "https://res.cloudinary.com/..."
    }
  ]
}
```

---

## Webhook Endpoints

### Monnify Webhook

**POST** `/webhooks/monnify`

Receive payment notifications from Monnify.

**Headers:**
```http
Content-Type: application/json
Monnify-Signature: signature_hash
```

**Request Body:**
```json
{
  "eventType": "SUCCESSFUL_TRANSACTION",
  "eventData": {
    "transactionReference": "MNFY|20250101000000|XXXXXX",
    "paymentReference": "ORD-20250101-XXXXX",
    "amountPaid": 10000,
    "paidOn": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

## Health Check

### Health Check

**GET** `/health`

Check API health status.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345.67,
  "environment": "development",
  "version": "v1"
}
```

---

## Postman Collection

Import this Postman collection to test all endpoints:

```json
{
  "info": {
    "name": "AGM Store Builder API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": []
}
```

---

## Support

For API support, contact:
- **Email**: support@shopwithagm.com
- **Documentation**: https://docs.shopwithagm.com
- **GitHub**: https://github.com/shopwithagm/api

---

**Last Updated**: December 11, 2025  
**API Version**: v1.0.0