# AGM Store Builder - Backend API Endpoints

> Complete API endpoint reference for frontend integration

---

## 📋 Table of Contents

1. [Base Information](#base-information)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Store Endpoints](#store-endpoints)
5. [Product Endpoints](#product-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Payment Endpoints](#payment-endpoints)
8. [Analytics Endpoints](#analytics-endpoints)
9. [Upload Endpoints](#upload-endpoints)
10. [Webhook Endpoints](#webhook-endpoints)
11. [System Endpoints](#system-endpoints)
12. [Error Codes Reference](#error-codes-reference)
13. [Rate Limiting](#rate-limiting)
14. [Frontend Integration Examples](#frontend-integration-examples)
15. [Quick Start Guide](#quick-start-guide)

---

## Base Information

### Base URLs

**Development:**
```
http://localhost:5000/api/v1
```

**Production:**
```
https://api.shopwithagm.com/api/v1
```

### Response Format

All endpoints return JSON in this format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "details": {}
}
```

### Authentication

Protected endpoints require JWT token in header:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Access:** Public  
**Description:** Create a new user account

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
      "phone": "08012345678",
      "email_verified": false,
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Registration successful"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Full name: Required, 2-255 characters
- Phone: Optional, valid Nigerian phone number

---

### 2. Login
**POST** `/auth/login`

**Access:** Public  
**Description:** Login with email and password

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
      "full_name": "John Doe",
      "phone": "08012345678",
      "email_verified": true,
      "last_login_at": "2025-12-11T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Login successful"
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

**Access:** Public  
**Description:** Get new access token using refresh token

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
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Access:** Protected  
**Description:** Logout and invalidate tokens

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Request Password Reset
**POST** `/auth/forgot-password`

**Access:** Public  
**Description:** Request OTP for password reset

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

### 6. Verify OTP
**POST** `/auth/verify-otp`

**Access:** Public  
**Description:** Verify OTP code

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
    "resetToken": "temp_reset_token_here",
    "expiresIn": 600
  },
  "message": "OTP verified successfully"
}
```

---

### 7. Reset Password
**POST** `/auth/reset-password`

**Access:** Public  
**Description:** Reset password with verified token

**Request Body:**
```json
{
  "resetToken": "temp_reset_token_from_verify_otp",
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

### 8. Resend Verification Email
**POST** `/auth/resend-verification`

**Access:** Public  
**Description:** Resend email verification OTP

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
  "message": "Verification email sent"
}
```

---

## User Endpoints

### 9. Get Current User
**GET** `/users/me`

**Access:** Protected  
**Description:** Get authenticated user's profile

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
    "phone_verified": false,
    "is_active": true,
    "last_login_at": "2025-12-11T00:00:00.000Z",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 10. Update Profile
**PUT** `/users/me`

**Access:** Protected  
**Description:** Update user profile

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
    "email": "user@example.com",
    "full_name": "John Updated Doe",
    "phone": "08087654321"
  },
  "message": "Profile updated successfully"
}
```

---

### 11. Change Password
**POST** `/users/change-password`

**Access:** Protected  
**Description:** Change user password

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

### 12. Delete Account
**DELETE** `/users/me`

**Access:** Protected  
**Description:** Soft delete user account

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Store Endpoints

### 13. Create Store
**POST** `/stores`

**Access:** Protected  
**Description:** Create a new store

**Request Body:**
```json
{
  "name": "My Awesome Store",
  "username": "myawesomestore",
  "description": "We sell amazing products",
  "category": "fashion",
  "logo": "https://res.cloudinary.com/...",
  "banner": "https://res.cloudinary.com/...",
  "social_links": {
    "instagram": "@mystore",
    "twitter": "@mystore",
    "facebook": "mystore",
    "whatsapp": "08012345678"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user_uuid",
    "name": "My Awesome Store",
    "username": "myawesomestore",
    "description": "We sell amazing products",
    "category": "fashion",
    "logo": "https://res.cloudinary.com/...",
    "banner": "https://res.cloudinary.com/...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Store created successfully"
}
```

---

### 14. Check Username Availability
**GET** `/stores/check/:username`

**Access:** Public  
**Description:** Check if store username is available

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "username": "myawesomestore",
    "available": false,
    "suggestions": ["myawesomestore1", "myawesomestore2"]
  }
}
```

---

### 15. Get My Stores
**GET** `/stores/my-stores`

**Access:** Protected  
**Description:** Get all stores owned by authenticated user

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Store",
      "username": "mystore",
      "logo": "https://...",
      "is_active": true,
      "product_count": 15,
      "order_count": 42,
      "total_revenue": 250000,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 16. Get Store by Username (Public)
**GET** `/stores/:username`

**Access:** Public  
**Description:** Get public store details

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Store",
    "username": "mystore",
    "description": "Store description",
    "category": "fashion",
    "logo": "https://...",
    "banner": "https://...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 17. Get Store by ID
**GET** `/stores/id/:storeId`

**Access:** Protected  
**Description:** Get store details by ID (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user_uuid",
    "name": "My Store",
    "username": "mystore",
    "description": "Store description",
    "category": "fashion",
    "logo": "https://...",
    "banner": "https://...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-12-11T00:00:00.000Z"
  }
}
```

---

### 18. Update Store
**PUT** `/stores/:storeId`

**Access:** Protected  
**Description:** Update store details (owner only)

**Request Body:**
```json
{
  "name": "Updated Store Name",
  "description": "Updated description",
  "category": "electronics",
  "logo": "https://...",
  "banner": "https://...",
  "social_links": {
    "instagram": "@updatedstore"
  }
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

### 19. Toggle Store Status
**PATCH** `/stores/:storeId/status`

**Access:** Protected  
**Description:** Activate or deactivate store

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

### 20. Delete Store
**DELETE** `/stores/:storeId`

**Access:** Protected  
**Description:** Soft delete a store

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Store deleted successfully"
}
```

---

## Product Endpoints

### 21. Create Product
**POST** `/products`

**Access:** Protected  
**Description:** Create a new product

**Request Body:**
```json
{
  "store_id": "store_uuid",
  "name": "Amazing T-Shirt",
  "description": "High quality cotton t-shirt",
  "price": 5000,
  "compare_price": 7000,
  "cost_price": 3000,
  "sku": "TSHIRT-001",
  "barcode": "1234567890",
  "stock_quantity": 100,
  "low_stock_threshold": 10,
  "weight": 0.3,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 2,
    "unit": "cm"
  },
  "images": [
    "https://res.cloudinary.com/image1.jpg",
    "https://res.cloudinary.com/image2.jpg"
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
  ],
  "category": "clothing",
  "tags": ["fashion", "trending", "sale"],
  "is_featured": false
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Amazing T-Shirt",
    "price": 5000,
    "stock_quantity": 100,
    "images": ["https://..."],
    "is_active": true,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

---

### 22. List Products by Store (Public)
**GET** `/stores/:username/products`

**Access:** Public  
**Description:** Get all products for a store

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `category` (string)
- `search` (string)
- `sort` (string: `price_asc`, `price_desc`, `newest`, `popular`, `name_asc`, `name_desc`)
- `min_price` (number)
- `max_price` (number)
- `in_stock` (boolean)
- `featured` (boolean)

**Example:** `/stores/mystore/products?page=1&limit=20&category=clothing&sort=price_asc`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "store_id": "store_uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 5000,
      "compare_price": 7000,
      "images": ["https://..."],
      "stock_quantity": 100,
      "category": "clothing",
      "tags": ["fashion"],
      "is_active": true,
      "is_featured": false,
      "view_count": 150,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3,
    "hasMore": true
  }
}
```

---

### 23. Get Single Product (Public)
**GET** `/stores/:username/products/:productId`

**Access:** Public  
**Description:** Get detailed product information

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Amazing T-Shirt",
    "description": "High quality cotton t-shirt",
    "price": 5000,
    "compare_price": 7000,
    "cost_price": 3000,
    "sku": "TSHIRT-001",
    "stock_quantity": 100,
    "low_stock_threshold": 10,
    "weight": 0.3,
    "dimensions": {},
    "images": ["https://..."],
    "variants": [],
    "category": "clothing",
    "tags": ["fashion"],
    "is_active": true,
    "is_featured": false,
    "view_count": 150,
    "store": {
      "id": "store_uuid",
      "name": "My Store",
      "username": "mystore",
      "logo": "https://..."
    },
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 24. Get My Products
**GET** `/products/my-products`

**Access:** Protected  
**Description:** Get all products for authenticated user's stores

**Query Parameters:**
- `store_id` (string, filter by specific store)
- `page` (number)
- `limit` (number)
- `search` (string)
- `category` (string)
- `status` (string: `active`, `inactive`, `out_of_stock`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "store_id": "store_uuid",
      "store_name": "My Store",
      "name": "Product Name",
      "price": 5000,
      "stock_quantity": 100,
      "images": ["https://..."],
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

### 25. Get Product by ID
**GET** `/products/:productId`

**Access:** Protected  
**Description:** Get product details (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Product Name",
    "description": "Description",
    "price": 5000,
    "cost_price": 3000,
    "stock_quantity": 100,
    "images": ["https://..."],
    "variants": [],
    "is_active": true,
    "view_count": 150,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 26. Update Product
**PUT** `/products/:productId`

**Access:** Protected  
**Description:** Update product details (owner only)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 6000,
  "stock_quantity": 150,
  "images": ["https://..."],
  "category": "electronics",
  "tags": ["trending", "sale"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "price": 6000,
    "stock_quantity": 150
  },
  "message": "Product updated successfully"
}
```

---

### 27. Update Stock Quantity
**PATCH** `/products/:productId/stock`

**Access:** Protected  
**Description:** Update product stock (owner only)

**Request Body:**
```json
{
  "stock_quantity": 200,
  "operation": "set"
}
```

Or increment/decrement:
```json
{
  "quantity": 50,
  "operation": "increment"
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

### 28. Toggle Product Status
**PATCH** `/products/:productId/status`

**Access:** Protected  
**Description:** Activate or deactivate product

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
  "message": "Product deactivated successfully"
}
```

---

### 29. Delete Product
**DELETE** `/products/:productId`

**Access:** Protected  
**Description:** Soft delete a product

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 30. Bulk Update Products
**PATCH** `/products/bulk-update`

**Access:** Protected  
**Description:** Update multiple products at once

**Request Body:**
```json
{
  "product_ids": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "category": "electronics",
    "is_active": true
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "updated_count": 3
  },
  "message": "Products updated successfully"
}
```

---

## Order Endpoints

### 31. Create Order (Public Checkout)
**POST** `/orders`

**Access:** Public  
**Description:** Create a new order (customer checkout)

**Request Body:**
```json
{
  "store_username": "mystore",
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "08012345678",
  "delivery_address": "123 Main Street, Ikeja",
  "delivery_state": "Lagos",
  "delivery_lga": "Ikeja",
  "items": [
    {
      "product_id": "product_uuid",
      "quantity": 2,
      "variant_selection": {
        "Size": "L",
        "Color": "Blue"
      }
    }
  ],
  "notes": "Please deliver before 5pm",
  "discount": 0,
  "shipping_fee": 2000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "store_id": "store_uuid",
      "customer_name": "Jane Doe",
      "customer_email": "jane@example.com",
      "customer_phone": "08012345678",
      "delivery_address": "123 Main Street, Ikeja",
      "delivery_state": "Lagos",
      "delivery_lga": "Ikeja",
      "subtotal": 10000,
      "discount": 0,
      "shipping_fee": 2000,
      "total": 12000,
      "agm_fee": 300,
      "status": "pending",
      "payment_status": "pending",
      "notes": "Please deliver before 5pm",
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "items": [
      {
        "product_id": "product_uuid",
        "product_name": "Amazing T-Shirt",
        "product_price": 5000,
        "quantity": 2,
        "subtotal": 10000,
        "variant_selection": {
          "Size": "L",
          "Color": "Blue"
        }
      }
    ],
    "payment": {
      "id": "payment_uuid",
      "payment_reference": "ORD-20251211-12345",
      "amount": 12000,
      "status": "pending",
      "accountDetails": {
        "accountNumber": "1234567890",
        "accountName": "AGM Store Builder - My Store",
        "bankName": "Wema Bank",
        "amount": 12000
      },
      "expires_at": "2025-12-11T01:00:00.000Z"
    }
  },
  "message": "Order created successfully. Please complete payment."
}
```

---

### 32. Track Order (Public)
**GET** `/orders/track/:orderNumber`

**Access:** Public  
**Description:** Track order status by order number

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "order_number": "ORD-20251211-12345",
    "status": "confirmed",
    "payment_status": "paid",
    "customer_name": "Jane Doe",
    "total": 12000,
    "created_at": "2025-12-11T00:00:00.000Z",
    "items": [
      {
        "product_name": "Amazing T-Shirt",
        "quantity": 2,
        "price": 5000,
        "subtotal": 10000
      }
    ],
    "tracking_history": [
      {
        "status": "pending",
        "timestamp": "2025-12-11T00:00:00.000Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-12-11T00:05:00.000Z"
      }
    ]
  }
}
```

---

### 33. List Orders (Store Owner)
**GET** `/orders`

**Access:** Protected  
**Description:** Get all orders for user's stores

**Query Parameters:**
- `store_id` (string, filter by store)
- `status` (string: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`)
- `payment_status` (string: `pending`, `paid`, `failed`, `expired`)
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, search by order number or customer name)
- `date_from` (ISO date)
- `date_to` (ISO date)

**Example:** `/orders?store_id=uuid&status=pending&page=1`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "store_id": "store_uuid",
      "store_name": "My Store",
      "customer_name": "Jane Doe",
      "customer_email": "jane@example.com",
      "customer_phone": "08012345678",
      "total": 12000,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2025-12-11T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

---

### 34. Get Order Details
**GET** `/orders/:orderId`

**Access:** Protected  
**Description:** Get detailed order information (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20251211-12345",
    "store_id": "store_uuid",
    "store_name": "My Store",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "customer_phone": "08012345678",
    "delivery_address": "123 Main Street, Ikeja",
    "delivery_state": "Lagos",
    "delivery_lga": "Ikeja",
    "subtotal": 10000,
    "discount": 0,
    "shipping_fee": 2000,
    "total": 12000,
    "agm_fee": 300,
    "status": "confirmed",
    "payment_status": "paid",
    "notes": "Please deliver before 5pm",
    "items": [
      {
        "id": "item_uuid",
        "product_id": "product_uuid",
        "product_name": "Amazing T-Shirt",
        "product_price": 5000,
        "quantity": 2,
        "subtotal": 10000,
        "variant_selection": {
          "Size": "L",
          "Color": "Blue"
        }
      }
    ],
    "payment": {
      "id": "payment_uuid",
      "payment_reference": "ORD-20251211-12345",
      "amount": 12000,
      "status": "paid",
      "paid_at": "2025-12-11T00:10:00.000Z"
    },
    "created_at": "2025-12-11T00:00:00.000Z",
    "updated_at": "2025-12-11T00:10:00.000Z"
  }
}
```

---

### 35. Update Order Status
**PATCH** `/orders/:orderId/status`

**Access:** Protected  
**Description:** Update order status (owner only)

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending` - Order created, awaiting confirmation
- `confirmed` - Order confirmed by seller
- `processing` - Order being prepared
- `shipped` - Order shipped/out for delivery
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20251211-12345",
    "status": "confirmed",
    "updated_at": "2025-12-11T00:15:00.000Z"
  },
  "message": "Order status updated successfully"
}
```

**Status Flow:**
```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled (can be set from pending or confirmed)
```

---

### 36. Cancel Order
**DELETE** `/orders/:orderId`

**Access:** Protected  
**Description:** Cancel an order (owner only, only if pending/confirmed)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Payment Endpoints

### 37. Verify Payment (Public)
**GET** `/payments/verify/:reference`

**Access:** Public  
**Description:** Verify payment status by reference

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "verified": true,
    "status": "paid",
    "payment": {
      "id": "uuid",
      "payment_reference": "ORD-20251211-12345",
      "monnify_reference": "MNFY|20251211|123456",
      "amount": 12000,
      "status": "paid",
      "payment_method": "bank_transfer",
      "paid_at": "2025-12-11T00:10:00.000Z",
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "order": {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "status": "confirmed",
      "payment_status": "paid"
    }
  }
}
```

---

### 38. Get Payment Details
**GET** `/payments/:reference`

**Access:** Public  
**Description:** Get payment details by reference

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_id": "order_uuid",
    "payment_reference": "ORD-20251211-12345",
    "monnify_reference": "MNFY|20251211|123456",
    "amount": 12000,
    "status": "paid",
    "payment_method": "bank_transfer",
    "accountDetails": {
      "accountNumber": "1234567890",
      "accountName": "AGM Store Builder - My Store",
      "bankName": "Wema Bank",
      "amount": 12000
    },
    "paid_at": "2025-12-11T00:10:00.000Z",
    "expires_at": "2025-12-11T01:00:00.000Z",
    "created_at": "2025-12-11T00:00:00.000Z"
  }
}
```

---

### 39. Reinitialize Payment
**POST** `/payments/:reference/reinitialize`

**Access:** Public  
**Description:** Reinitialize expired payment

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment_reference": "ORD-20251211-12345",
    "accountDetails": {
      "accountNumber": "0987654321",
      "accountName": "AGM Store Builder - My Store",
      "bankName": "Wema Bank",
      "amount": 12000
    },
    "expires_at": "2025-12-11T02:00:00.000Z"
  },
  "message": "Payment reinitialized successfully"
}
```

---

### 40. Add Bank Account
**POST** `/payments/bank-accounts`

**Access:** Protected  
**Description:** Add bank account for payouts

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
    "user_id": "user_uuid",
    "account_name": "John Doe",
    "account_number": "0123456789",
    "bank_code": "057",
    "bank_name": "Zenith Bank",
    "is_primary": true,
    "is_verified": false,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Bank account added successfully"
}
```

---

### 41. List Bank Accounts
**GET** `/payments/bank-accounts`

**Access:** Protected  
**Description:** Get user's bank accounts

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "account_name": "John Doe",
      "account_number": "0123456789",
      "bank_code": "057",
      "bank_name": "Zenith Bank",
      "is_primary": true,
      "is_verified": true,
      "created_at": "2025-12-11T00:00:00.000Z"
    }
  ]
}
```

---

### 42. Set Primary Bank Account
**PUT** `/payments/bank-accounts/:accountId/primary`

**Access:** Protected  
**Description:** Set bank account as primary

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_primary": true
  },
  "message": "Primary bank account updated successfully"
}
```

---

### 43. Delete Bank Account
**DELETE** `/payments/bank-accounts/:accountId`

**Access:** Protected  
**Description:** Delete a bank account

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

---

### 44. Get Nigerian Banks
**GET** `/payments/banks`

**Access:** Public  
**Description:** Get list of Nigerian banks

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "name": "Access Bank",
      "code": "044"
    },
    {
      "name": "Zenith Bank",
      "code": "057"
    },
    {
      "name": "GTBank",
      "code": "058"
    }
  ]
}
```

---

## Analytics Endpoints

### 45. Dashboard Analytics
**GET** `/analytics/dashboard`

**Access:** Protected  
**Description:** Get dashboard overview for all stores

**Query Parameters:**
- `store_id` (string, filter by specific store)
- `period` (string: `today`, `week`, `month`, `year`, `custom`)
- `date_from` (ISO date, for custom period)
- `date_to` (ISO date, for custom period)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 500000,
      "totalOrders": 150,
      "pendingOrders": 10,
      "completedOrders": 140,
      "totalProducts": 45,
      "activeProducts": 42,
      "totalStores": 2
    },
    "recentOrders": [
      {
        "id": "uuid",
        "order_number": "ORD-20251211-12345",
        "customer_name": "Jane Doe",
        "total": 12000,
        "status": "pending",
        "created_at": "2025-12-11T00:00:00.000Z"
      }
    ],
    "topProducts": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sales_count": 50,
        "revenue": 250000
      }
    ],
    "stores": [
      {
        "id": "uuid",
        "name": "My Store",
        "username": "mystore",
        "product_count": 15,
        "order_count": 42,
        "revenue": 250000
      }
    ]
  }
}
```

---

### 46. Revenue Statistics
**GET** `/analytics/revenue`

**Access:** Protected  
**Description:** Get revenue statistics

**Query Parameters:**
- `store_id` (string)
- `period` (string: `today`, `week`, `month`, `year`)
- `group_by` (string: `day`, `week`, `month`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 500000,
    "paid": 480000,
    "pending": 20000,
    "thisMonth": 50000,
    "lastMonth": 45000,
    "growth": 11.11,
    "chartData": [
      {
        "period": "2025-11-11",
        "revenue": 5000,
        "orders": 5
      },
      {
        "period": "2025-12-11",
        "revenue": 12000,
        "orders": 3
      }
    ]
  }
}
```

---

### 47. Order Statistics
**GET** `/analytics/orders`

**Access:** Protected  
**Description:** Get order statistics

**Query Parameters:**
- `store_id` (string)
- `period` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 10,
    "confirmed": 20,
    "processing": 15,
    "shipped": 10,
    "delivered": 90,
    "cancelled": 5,
    "averageOrderValue": 8000,
    "chartData": [
      {
        "status": "pending",
        "count": 10
      },
      {
        "status": "delivered",
        "count": 90
      }
    ]
  }
}
```

---

### 48. Product Performance
**GET** `/analytics/products`

**Access:** Protected  
**Description:** Get product performance analytics

**Query Parameters:**
- `store_id` (string)
- `period` (string)
- `limit` (number, top products to return)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalProducts": 45,
    "activeProducts": 42,
    "outOfStock": 3,
    "lowStock": 5,
    "topSelling": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sales_count": 50,
        "revenue": 250000,
        "stock_quantity": 80
      }
    ],
    "recentlyAdded": [
      {
        "id": "uuid",
        "name": "New Product",
        "created_at": "2025-12-11T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 49. Customer Analytics
**GET** `/analytics/customers`

**Access:** Protected  
**Description:** Get customer analytics

**Query Parameters:**
- `store_id` (string)
- `period` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCustomers": 120,
    "newCustomers": 15,
    "returningCustomers": 25,
    "topCustomers": [
      {
        "name": "Customer Name",
        "email": "customer@example.com",
        "order_count": 10,
        "total_spent": 80000
      }
    ]
  }
}
```

---

## Upload Endpoints

### 50. Upload Single Image
**POST** `/upload/image`

**Access:** Protected  
**Description:** Upload single image to Cloudinary

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN
```

**Form Data:**
- `image` (file) - Image file (JPG, PNG, WEBP, max 5MB)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "secure_url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "agm-store/user_id/xxxxx",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "resource_type": "image"
  }
}
```

---

### 51. Upload Multiple Images
**POST** `/upload/images`

**Access:** Protected  
**Description:** Upload multiple images (max 5)

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN
```

**Form Data:**
- `images` (files) - Array of image files

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "secure_url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "agm-store/user_id/xxxxx1"
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "secure_url": "https://res.cloudinary.com/.../image2.jpg",
      "public_id": "agm-store/user_id/xxxxx2"
    }
  ]
}
```

---

### 52. Delete Image
**DELETE** `/upload/image/:publicId`

**Access:** Protected  
**Description:** Delete image from Cloudinary

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Webhook Endpoints

### 53. Monnify Webhook
**POST** `/webhooks/monnify`

**Access:** Public (with signature verification)  
**Description:** Receive payment notifications from Monnify

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
    "transactionReference": "MNFY|20251211|123456",
    "paymentReference": "ORD-20251211-12345",
    "amountPaid": "12000.00",
    "totalPayable": "12000.00",
    "settlementAmount": "11700.00",
    "paidOn": "2025-12-11T00:10:00.000Z",
    "paymentStatus": "PAID",
    "paymentMethod": "ACCOUNT_TRANSFER",
    "currency": "NGN",
    "product": {
      "reference": "ORD-20251211-12345"
    },
    "cardDetails": {},
    "accountDetails": {
      "accountNumber": "1234567890",
      "accountName": "AGM Store Builder - My Store",
      "bankCode": "035",
      "bankName": "Wema Bank"
    },
    "accountPayments": [
      {
        "accountNumber": "1234567890",
        "accountName": "AGM Store Builder - My Store",
        "bankCode": "035",
        "bankName": "Wema Bank",
        "amountPaid": "12000.00"
      }
    ],
    "customer": {
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## System Endpoints

### 54. Health Check
**GET** `/health`

**Access:** Public  
**Description:** Check API health status

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T00:00:00.000Z",
  "uptime": 123456.78,
  "environment": "development",
  "version": "v1",
  "database": "connected"
}
```

---

### 55. API Version
**GET** `/version`

**Access:** Public  
**Description:** Get API version information

**Response:** `200 OK`
```json
{
  "version": "1.0.0",
  "apiVersion": "v1",
  "environment": "production",
  "buildDate": "2025-12-11"
}
```

---

## Error Codes Reference

### HTTP Status Codes

| Code | Description | When it occurs |
|------|-------------|----------------|
| 200 | OK | Successful GET, PUT, PATCH request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | External service error |

### Common Error Messages

```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 422,
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

```json
{
  "success": false,
  "message": "Unauthorized access",
  "statusCode": 401
}
```

```json
{
  "success": false,
  "message": "Store not found",
  "statusCode": 404
}
```

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702339200
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "statusCode": 429,
  "retryAfter": 900
}
```

---

## Frontend Integration Examples

### React/Next.js API Client

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### API Service Examples

```typescript
// lib/api/auth.ts
import { apiClient } from './client';

export const authAPI = {
  register: (data: RegisterData) => 
    apiClient.post('/auth/register', data),
  
  login: (data: LoginData) => 
    apiClient.post('/auth/login', data),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  verifyOTP: (email: string, otp: string) =>
    apiClient.post('/auth/verify-otp', { email, otp }),
  
  resetPassword: (resetToken: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { resetToken, newPassword }),
};

// lib/api/stores.ts
export const storesAPI = {
  create: (data: CreateStoreData) => 
    apiClient.post('/stores', data),
  
  getMyStores: () => 
    apiClient.get('/stores/my-stores'),
  
  getByUsername: (username: string) => 
    apiClient.get(`/stores/${username}`),
  
  getById: (storeId: string) =>
    apiClient.get(`/stores/id/${storeId}`),
  
  update: (storeId: string, data: UpdateStoreData) => 
    apiClient.put(`/stores/${storeId}`, data),
  
  toggleStatus: (storeId: string, is_active: boolean) =>
    apiClient.patch(`/stores/${storeId}/status`, { is_active }),
  
  delete: (storeId: string) =>
    apiClient.delete(`/stores/${storeId}`),
  
  checkUsername: (username: string) =>
    apiClient.get(`/stores/check/${username}`),
};

// lib/api/products.ts
export const productsAPI = {
  create: (data: CreateProductData) => 
    apiClient.post('/products', data),
  
  listByStore: (username: string, params?: ProductListParams) => 
    apiClient.get(`/stores/${username}/products`, { params }),
  
  getByUsername: (username: string, productId: string) => 
    apiClient.get(`/stores/${username}/products/${productId}`),
  
  getById: (productId: string) =>
    apiClient.get(`/products/${productId}`),
  
  getMyProducts: (params?: MyProductsParams) =>
    apiClient.get('/products/my-products', { params }),
  
  update: (productId: string, data: UpdateProductData) => 
    apiClient.put(`/products/${productId}`, data),
  
  updateStock: (productId: string, stock_quantity: number) =>
    apiClient.patch(`/products/${productId}/stock`, { stock_quantity, operation: 'set' }),
  
  toggleStatus: (productId: string, is_active: boolean) =>
    apiClient.patch(`/products/${productId}/status`, { is_active }),
  
  delete: (productId: string) => 
    apiClient.delete(`/products/${productId}`),
  
  bulkUpdate: (product_ids: string[], updates: any) =>
    apiClient.patch('/products/bulk-update', { product_ids, updates }),
};

// lib/api/orders.ts
export const ordersAPI = {
  create: (data: CreateOrderData) => 
    apiClient.post('/orders', data),
  
  track: (orderNumber: string) => 
    apiClient.get(`/orders/track/${orderNumber}`),
  
  list: (params?: OrderListParams) => 
    apiClient.get('/orders', { params }),
  
  getById: (orderId: string) =>
    apiClient.get(`/orders/${orderId}`),
  
  updateStatus: (orderId: string, status: string) => 
    apiClient.patch(`/orders/${orderId}/status`, { status }),
  
  cancel: (orderId: string) =>
    apiClient.delete(`/orders/${orderId}`),
};

// lib/api/payments.ts
export const paymentsAPI = {
  verify: (reference: string) =>
    apiClient.get(`/payments/verify/${reference}`),
  
  getDetails: (reference: string) =>
    apiClient.get(`/payments/${reference}`),
  
  reinitialize: (reference: string) =>
    apiClient.post(`/payments/${reference}/reinitialize`),
  
  addBankAccount: (data: BankAccountData) =>
    apiClient.post('/payments/bank-accounts', data),
  
  listBankAccounts: () =>
    apiClient.get('/payments/bank-accounts'),
  
  setPrimary: (accountId: string) =>
    apiClient.put(`/payments/bank-accounts/${accountId}/primary`),
  
  deleteBankAccount: (accountId: string) =>
    apiClient.delete(`/payments/bank-accounts/${accountId}`),
  
  getBanks: () =>
    apiClient.get('/payments/banks'),
};

// lib/api/analytics.ts
export const analyticsAPI = {
  dashboard: (params?: AnalyticsParams) =>
    apiClient.get('/analytics/dashboard', { params }),
  
  revenue: (params?: AnalyticsParams) =>
    apiClient.get('/analytics/revenue', { params }),
  
  orders: (params?: AnalyticsParams) =>
    apiClient.get('/analytics/orders', { params }),
  
  products: (params?: AnalyticsParams) =>
    apiClient.get('/analytics/products', { params }),
  
  customers: (params?: AnalyticsParams) =>
    apiClient.get('/analytics/customers', { params }),
};

// lib/api/upload.ts
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return apiClient.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteImage: (publicId: string) =>
    apiClient.delete(`/upload/image/${publicId}`),
};
```

### TypeScript Types

```typescript
// types/api.ts

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateStoreData {
  name: string;
  username: string;
  description?: string;
  category?: string;
  logo?: string;
  banner?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export interface CreateProductData {
  store_id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: string[];
  variants?: Array<{
    name: string;
    options: string[];
  }>;
  category?: string;
  tags?: string[];
  is_featured?: boolean;
}

export interface CreateOrderData {
  store_username: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_state: string;
  delivery_lga?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    variant_selection?: Record<string, string>;
  }>;
  notes?: string;
  discount?: number;
  shipping_fee?: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name_asc' | 'name_desc';
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
}

export interface OrderListParams {
  store_id?: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed' | 'expired';
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface AnalyticsParams {
  store_id?: string;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  date_from?: string;
  date_to?: string;
  group_by?: 'day' | 'week' | 'month';
  limit?: number;
}
```

---

## Quick Start Guide

### 1. User Registration & Login

```javascript
// Register new user
const response = await fetch('http://localhost:5000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    full_<!-- filepath: c:\Users\HomePC\Documents\agm-store-builder-backend\BACKEND_API_ENDPOINTS.md -->
# AGM Store Builder - Backend API Endpoints

> Complete API endpoint reference for frontend integration

---

## 📋 Table of Contents

1. [Base Information](#base-information)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Store Endpoints](#store-endpoints)
5. [Product Endpoints](#product-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Payment Endpoints](#payment-endpoints)
8. [Analytics Endpoints](#analytics-endpoints)
9. [Upload Endpoints](#upload-endpoints)
10. [Webhook Endpoints](#webhook-endpoints)
11. [System Endpoints](#system-endpoints)
12. [Error Codes Reference](#error-codes-reference)
13. [Rate Limiting](#rate-limiting)
14. [Frontend Integration Examples](#frontend-integration-examples)
15. [Quick Start Guide](#quick-start-guide)

---

## Base Information

### Base URLs

**Development:**
```
http://localhost:5000/api/v1
```

**Production:**
```
https://api.shopwithagm.com/api/v1
```

### Response Format

All endpoints return JSON in this format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "details": {}
}
```

### Authentication

Protected endpoints require JWT token in header:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Access:** Public  
**Description:** Create a new user account

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
      "phone": "08012345678",
      "email_verified": false,
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Registration successful"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Full name: Required, 2-255 characters
- Phone: Optional, valid Nigerian phone number

---

### 2. Login
**POST** `/auth/login`

**Access:** Public  
**Description:** Login with email and password

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
      "full_name": "John Doe",
      "phone": "08012345678",
      "email_verified": true,
      "last_login_at": "2025-12-11T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Login successful"
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

**Access:** Public  
**Description:** Get new access token using refresh token

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
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Access:** Protected  
**Description:** Logout and invalidate tokens

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Request Password Reset
**POST** `/auth/forgot-password`

**Access:** Public  
**Description:** Request OTP for password reset

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

### 6. Verify OTP
**POST** `/auth/verify-otp`

**Access:** Public  
**Description:** Verify OTP code

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
    "resetToken": "temp_reset_token_here",
    "expiresIn": 600
  },
  "message": "OTP verified successfully"
}
```

---

### 7. Reset Password
**POST** `/auth/reset-password`

**Access:** Public  
**Description:** Reset password with verified token

**Request Body:**
```json
{
  "resetToken": "temp_reset_token_from_verify_otp",
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

### 8. Resend Verification Email
**POST** `/auth/resend-verification`

**Access:** Public  
**Description:** Resend email verification OTP

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
  "message": "Verification email sent"
}
```

---

## User Endpoints

### 9. Get Current User
**GET** `/users/me`

**Access:** Protected  
**Description:** Get authenticated user's profile

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
    "phone_verified": false,
    "is_active": true,
    "last_login_at": "2025-12-11T00:00:00.000Z",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 10. Update Profile
**PUT** `/users/me`

**Access:** Protected  
**Description:** Update user profile

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
    "email": "user@example.com",
    "full_name": "John Updated Doe",
    "phone": "08087654321"
  },
  "message": "Profile updated successfully"
}
```

---

### 11. Change Password
**POST** `/users/change-password`

**Access:** Protected  
**Description:** Change user password

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

### 12. Delete Account
**DELETE** `/users/me`

**Access:** Protected  
**Description:** Soft delete user account

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Store Endpoints

### 13. Create Store
**POST** `/stores`

**Access:** Protected  
**Description:** Create a new store

**Request Body:**
```json
{
  "name": "My Awesome Store",
  "username": "myawesomestore",
  "description": "We sell amazing products",
  "category": "fashion",
  "logo": "https://res.cloudinary.com/...",
  "banner": "https://res.cloudinary.com/...",
  "social_links": {
    "instagram": "@mystore",
    "twitter": "@mystore",
    "facebook": "mystore",
    "whatsapp": "08012345678"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user_uuid",
    "name": "My Awesome Store",
    "username": "myawesomestore",
    "description": "We sell amazing products",
    "category": "fashion",
    "logo": "https://res.cloudinary.com/...",
    "banner": "https://res.cloudinary.com/...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Store created successfully"
}
```

---

### 14. Check Username Availability
**GET** `/stores/check/:username`

**Access:** Public  
**Description:** Check if store username is available

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "username": "myawesomestore",
    "available": false,
    "suggestions": ["myawesomestore1", "myawesomestore2"]
  }
}
```

---

### 15. Get My Stores
**GET** `/stores/my-stores`

**Access:** Protected  
**Description:** Get all stores owned by authenticated user

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Store",
      "username": "mystore",
      "logo": "https://...",
      "is_active": true,
      "product_count": 15,
      "order_count": 42,
      "total_revenue": 250000,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 16. Get Store by Username (Public)
**GET** `/stores/:username`

**Access:** Public  
**Description:** Get public store details

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Store",
    "username": "mystore",
    "description": "Store description",
    "category": "fashion",
    "logo": "https://...",
    "banner": "https://...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 17. Get Store by ID
**GET** `/stores/id/:storeId`

**Access:** Protected  
**Description:** Get store details by ID (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user_uuid",
    "name": "My Store",
    "username": "mystore",
    "description": "Store description",
    "category": "fashion",
    "logo": "https://...",
    "banner": "https://...",
    "social_links": {},
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-12-11T00:00:00.000Z"
  }
}
```

---

### 18. Update Store
**PUT** `/stores/:storeId`

**Access:** Protected  
**Description:** Update store details (owner only)

**Request Body:**
```json
{
  "name": "Updated Store Name",
  "description": "Updated description",
  "category": "electronics",
  "logo": "https://...",
  "banner": "https://...",
  "social_links": {
    "instagram": "@updatedstore"
  }
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

### 19. Toggle Store Status
**PATCH** `/stores/:storeId/status`

**Access:** Protected  
**Description:** Activate or deactivate store

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

### 20. Delete Store
**DELETE** `/stores/:storeId`

**Access:** Protected  
**Description:** Soft delete a store

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Store deleted successfully"
}
```

---

## Product Endpoints

### 21. Create Product
**POST** `/products`

**Access:** Protected  
**Description:** Create a new product

**Request Body:**
```json
{
  "store_id": "store_uuid",
  "name": "Amazing T-Shirt",
  "description": "High quality cotton t-shirt",
  "price": 5000,
  "compare_price": 7000,
  "cost_price": 3000,
  "sku": "TSHIRT-001",
  "barcode": "1234567890",
  "stock_quantity": 100,
  "low_stock_threshold": 10,
  "weight": 0.3,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 2,
    "unit": "cm"
  },
  "images": [
    "https://res.cloudinary.com/image1.jpg",
    "https://res.cloudinary.com/image2.jpg"
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
  ],
  "category": "clothing",
  "tags": ["fashion", "trending", "sale"],
  "is_featured": false
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Amazing T-Shirt",
    "price": 5000,
    "stock_quantity": 100,
    "images": ["https://..."],
    "is_active": true,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

---

### 22. List Products by Store (Public)
**GET** `/stores/:username/products`

**Access:** Public  
**Description:** Get all products for a store

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `category` (string)
- `search` (string)
- `sort` (string: `price_asc`, `price_desc`, `newest`, `popular`, `name_asc`, `name_desc`)
- `min_price` (number)
- `max_price` (number)
- `in_stock` (boolean)
- `featured` (boolean)

**Example:** `/stores/mystore/products?page=1&limit=20&category=clothing&sort=price_asc`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "store_id": "store_uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 5000,
      "compare_price": 7000,
      "images": ["https://..."],
      "stock_quantity": 100,
      "category": "clothing",
      "tags": ["fashion"],
      "is_active": true,
      "is_featured": false,
      "view_count": 150,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3,
    "hasMore": true
  }
}
```

---

### 23. Get Single Product (Public)
**GET** `/stores/:username/products/:productId`

**Access:** Public  
**Description:** Get detailed product information

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Amazing T-Shirt",
    "description": "High quality cotton t-shirt",
    "price": 5000,
    "compare_price": 7000,
    "cost_price": 3000,
    "sku": "TSHIRT-001",
    "stock_quantity": 100,
    "low_stock_threshold": 10,
    "weight": 0.3,
    "dimensions": {},
    "images": ["https://..."],
    "variants": [],
    "category": "clothing",
    "tags": ["fashion"],
    "is_active": true,
    "is_featured": false,
    "view_count": 150,
    "store": {
      "id": "store_uuid",
      "name": "My Store",
      "username": "mystore",
      "logo": "https://..."
    },
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 24. Get My Products
**GET** `/products/my-products`

**Access:** Protected  
**Description:** Get all products for authenticated user's stores

**Query Parameters:**
- `store_id` (string, filter by specific store)
- `page` (number)
- `limit` (number)
- `search` (string)
- `category` (string)
- `status` (string: `active`, `inactive`, `out_of_stock`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "store_id": "store_uuid",
      "store_name": "My Store",
      "name": "Product Name",
      "price": 5000,
      "stock_quantity": 100,
      "images": ["https://..."],
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

### 25. Get Product by ID
**GET** `/products/:productId`

**Access:** Protected  
**Description:** Get product details (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_id": "store_uuid",
    "name": "Product Name",
    "description": "Description",
    "price": 5000,
    "cost_price": 3000,
    "stock_quantity": 100,
    "images": ["https://..."],
    "variants": [],
    "is_active": true,
    "view_count": 150,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 26. Update Product
**PUT** `/products/:productId`

**Access:** Protected  
**Description:** Update product details (owner only)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 6000,
  "stock_quantity": 150,
  "images": ["https://..."],
  "category": "electronics",
  "tags": ["trending", "sale"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "price": 6000,
    "stock_quantity": 150
  },
  "message": "Product updated successfully"
}
```

---

### 27. Update Stock Quantity
**PATCH** `/products/:productId/stock`

**Access:** Protected  
**Description:** Update product stock (owner only)

**Request Body:**
```json
{
  "stock_quantity": 200,
  "operation": "set"
}
```

Or increment/decrement:
```json
{
  "quantity": 50,
  "operation": "increment"
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

### 28. Toggle Product Status
**PATCH** `/products/:productId/status`

**Access:** Protected  
**Description:** Activate or deactivate product

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
  "message": "Product deactivated successfully"
}
```

---

### 29. Delete Product
**DELETE** `/products/:productId`

**Access:** Protected  
**Description:** Soft delete a product

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 30. Bulk Update Products
**PATCH** `/products/bulk-update`

**Access:** Protected  
**Description:** Update multiple products at once

**Request Body:**
```json
{
  "product_ids": ["uuid1", "uuid2", "uuid3"],
  "updates": {
    "category": "electronics",
    "is_active": true
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "updated_count": 3
  },
  "message": "Products updated successfully"
}
```

---

## Order Endpoints

### 31. Create Order (Public Checkout)
**POST** `/orders`

**Access:** Public  
**Description:** Create a new order (customer checkout)

**Request Body:**
```json
{
  "store_username": "mystore",
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "08012345678",
  "delivery_address": "123 Main Street, Ikeja",
  "delivery_state": "Lagos",
  "delivery_lga": "Ikeja",
  "items": [
    {
      "product_id": "product_uuid",
      "quantity": 2,
      "variant_selection": {
        "Size": "L",
        "Color": "Blue"
      }
    }
  ],
  "notes": "Please deliver before 5pm",
  "discount": 0,
  "shipping_fee": 2000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "store_id": "store_uuid",
      "customer_name": "Jane Doe",
      "customer_email": "jane@example.com",
      "customer_phone": "08012345678",
      "delivery_address": "123 Main Street, Ikeja",
      "delivery_state": "Lagos",
      "delivery_lga": "Ikeja",
      "subtotal": 10000,
      "discount": 0,
      "shipping_fee": 2000,
      "total": 12000,
      "agm_fee": 300,
      "status": "pending",
      "payment_status": "pending",
      "notes": "Please deliver before 5pm",
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "items": [
      {
        "product_id": "product_uuid",
        "product_name": "Amazing T-Shirt",
        "product_price": 5000,
        "quantity": 2,
        "subtotal": 10000,
        "variant_selection": {
          "Size": "L",
          "Color": "Blue"
        }
      }
    ],
    "payment": {
      "id": "payment_uuid",
      "payment_reference": "ORD-20251211-12345",
      "amount": 12000,
      "status": "pending",
      "accountDetails": {
        "accountNumber": "1234567890",
        "accountName": "AGM Store Builder - My Store",
        "bankName": "Wema Bank",
        "amount": 12000
      },
      "expires_at": "2025-12-11T01:00:00.000Z"
    }
  },
  "message": "Order created successfully. Please complete payment."
}
```

---

### 32. Track Order (Public)
**GET** `/orders/track/:orderNumber`

**Access:** Public  
**Description:** Track order status by order number

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "order_number": "ORD-20251211-12345",
    "status": "confirmed",
    "payment_status": "paid",
    "customer_name": "Jane Doe",
    "total": 12000,
    "created_at": "2025-12-11T00:00:00.000Z",
    "items": [
      {
        "product_name": "Amazing T-Shirt",
        "quantity": 2,
        "price": 5000,
        "subtotal": 10000
      }
    ],
    "tracking_history": [
      {
        "status": "pending",
        "timestamp": "2025-12-11T00:00:00.000Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-12-11T00:05:00.000Z"
      }
    ]
  }
}
```

---

### 33. List Orders (Store Owner)
**GET** `/orders`

**Access:** Protected  
**Description:** Get all orders for user's stores

**Query Parameters:**
- `store_id` (string, filter by store)
- `status` (string: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`)
- `payment_status` (string: `pending`, `paid`, `failed`, `expired`)
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, search by order number or customer name)
- `date_from` (ISO date)
- `date_to` (ISO date)

**Example:** `/orders?store_id=uuid&status=pending&page=1`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "store_id": "store_uuid",
      "store_name": "My Store",
      "customer_name": "Jane Doe",
      "customer_email": "jane@example.com",
      "customer_phone": "08012345678",
      "total": 12000,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2025-12-11T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

---

### 34. Get Order Details
**GET** `/orders/:orderId`

**Access:** Protected  
**Description:** Get detailed order information (owner only)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20251211-12345",
    "store_id": "store_uuid",
    "store_name": "My Store",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "customer_phone": "08012345678",
    "delivery_address": "123 Main Street, Ikeja",
    "delivery_state": "Lagos",
    "delivery_lga": "Ikeja",
    "subtotal": 10000,
    "discount": 0,
    "shipping_fee": 2000,
    "total": 12000,
    "agm_fee": 300,
    "status": "confirmed",
    "payment_status": "paid",
    "notes": "Please deliver before 5pm",
    "items": [
      {
        "id": "item_uuid",
        "product_id": "product_uuid",
        "product_name": "Amazing T-Shirt",
        "product_price": 5000,
        "quantity": 2,
        "subtotal": 10000,
        "variant_selection": {
          "Size": "L",
          "Color": "Blue"
        }
      }
    ],
    "payment": {
      "id": "payment_uuid",
      "payment_reference": "ORD-20251211-12345",
      "amount": 12000,
      "status": "paid",
      "paid_at": "2025-12-11T00:10:00.000Z"
    },
    "created_at": "2025-12-11T00:00:00.000Z",
    "updated_at": "2025-12-11T00:10:00.000Z"
  }
}
```

---

### 35. Update Order Status
**PATCH** `/orders/:orderId/status`

**Access:** Protected  
**Description:** Update order status (owner only)

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending` - Order created, awaiting confirmation
- `confirmed` - Order confirmed by seller
- `processing` - Order being prepared
- `shipped` - Order shipped/out for delivery
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20251211-12345",
    "status": "confirmed",
    "updated_at": "2025-12-11T00:15:00.000Z"
  },
  "message": "Order status updated successfully"
}
```

**Status Flow:**
```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled (can be set from pending or confirmed)
```

---

### 36. Cancel Order
**DELETE** `/orders/:orderId`

**Access:** Protected  
**Description:** Cancel an order (owner only, only if pending/confirmed)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Payment Endpoints

### 37. Verify Payment (Public)
**GET** `/payments/verify/:reference`

**Access:** Public  
**Description:** Verify payment status by reference

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "verified": true,
    "status": "paid",
    "payment": {
      "id": "uuid",
      "payment_reference": "ORD-20251211-12345",
      "monnify_reference": "MNFY|20251211|123456",
      "amount": 12000,
      "status": "paid",
      "payment_method": "bank_transfer",
      "paid_at": "2025-12-11T00:10:00.000Z",
      "created_at": "2025-12-11T00:00:00.000Z"
    },
    "order": {
      "id": "uuid",
      "order_number": "ORD-20251211-12345",
      "status": "confirmed",
      "payment_status": "paid"
    }
  }
}
```

---

### 38. Get Payment Details
**GET** `/payments/:reference`

**Access:** Public  
**Description:** Get payment details by reference

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_id": "order_uuid",
    "payment_reference": "ORD-20251211-12345",
    "monnify_reference": "MNFY|20251211|123456",
    "amount": 12000,
    "status": "paid",
    "payment_method": "bank_transfer",
    "accountDetails": {
      "accountNumber": "1234567890",
      "accountName": "AGM Store Builder - My Store",
      "bankName": "Wema Bank",
      "amount": 12000
    },
    "paid_at": "2025-12-11T00:10:00.000Z",
    "expires_at": "2025-12-11T01:00:00.000Z",
    "created_at": "2025-12-11T00:00:00.000Z"
  }
}
```

---

### 39. Reinitialize Payment
**POST** `/payments/:reference/reinitialize`

**Access:** Public  
**Description:** Reinitialize expired payment

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "payment_reference": "ORD-20251211-12345",
    "accountDetails": {
      "accountNumber": "0987654321",
      "accountName": "AGM Store Builder - My Store",
      "bankName": "Wema Bank",
      "amount": 12000
    },
    "expires_at": "2025-12-11T02:00:00.000Z"
  },
  "message": "Payment reinitialized successfully"
}
```

---

### 40. Add Bank Account
**POST** `/payments/bank-accounts`

**Access:** Protected  
**Description:** Add bank account for payouts

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
    "user_id": "user_uuid",
    "account_name": "John Doe",
    "account_number": "0123456789",
    "bank_code": "057",
    "bank_name": "Zenith Bank",
    "is_primary": true,
    "is_verified": false,
    "created_at": "2025-12-11T00:00:00.000Z"
  },
  "message": "Bank account added successfully"
}
```

---

### 41. List Bank Accounts
**GET** `/payments/bank-accounts`

**Access:** Protected  
**Description:** Get user's bank accounts

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "account_name": "John Doe",
      "account_number": "0123456789",
      "bank_code": "057",
      "bank_name": "Zenith Bank",
      "is_primary": true,
      "is_verified": true,
      "created_at": "2025-12-11T00:00:00.000Z"
    }
  ]
}
```

---

### 42. Set Primary Bank Account
**PUT** `/payments/bank-accounts/:accountId/primary`

**Access:** Protected  
**Description:** Set bank account as primary

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_primary": true
  },
  "message": "Primary bank account updated successfully"
}
```

---

### 43. Delete Bank Account
**DELETE** `/payments/bank-accounts/:accountId`

**Access:** Protected  
**Description:** Delete a bank account

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

---

### 44. Get Nigerian Banks
**GET** `/payments/banks`

**Access:** Public  
**Description:** Get list of Nigerian banks

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "name": "Access Bank",
      "code": "044"
    },
    {
      "name": "Zenith Bank",
      "code": "057"
    },
    {
      "name": "GTBank",
      "code": "058"
    }
  ]
}
```

---

## Analytics Endpoints

### 45. Dashboard Analytics
**GET** `/analytics/dashboard`

**Access:** Protected  
**Description:** Get dashboard overview for all stores

**Query Parameters:**
- `store_id` (string, filter by specific store)
- `period` (string: `today`, `week`, `month`, `year`, `custom`)
- `date_from` (ISO date, for custom period)
- `date_to` (ISO date, for custom period)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 500000,
      "totalOrders": 150,
      "pendingOrders": 10,
      "completedOrders": 140,
      "totalProducts": 45,
      "activeProducts": 42,
      "totalStores": 2
    },
    "recentOrders": [
      {
        "id": "uuid",
        "order_number": "ORD-20251211-12345",
        "customer_name": "Jane Doe",
        "total": 12000,
        "status": "pending",
        "created_at": "2025-12-11T00:00:00.000Z"
      }
    ],
    "topProducts": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sales_count": 50,
        "revenue": 250000
      }
    ],
    "stores": [
      {
        "id": "uuid",
        "name": "My Store",
        "username": "mystore",
        "product_count": 15,
        "order_count": 42,
        "revenue": 250000
      }
    ]
  }
}
```

---

### 46. Revenue Statistics
**GET** `/analytics/revenue`

**Access:** Protected  
**Description:** Get revenue statistics

**Query Parameters:**
- `store_id` (string)
- `period` (string: `today`, `week`, `month`, `year`)
- `group_by` (string: `day`, `week`, `month`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 500000,
    "paid": 480000,
    "pending": 20000,
    "thisMonth": 50000,
    "lastMonth": 45000,
    "growth": 11.11,
    "chartData": [
      {
        "period": "2025-11-11",
        "revenue": 5000,
        "orders": 5
      },
      {
        "period": "2025-12-11",
        "revenue": 12000,
        "orders": 3
      }
    ]
  }
}
```

---

### 47. Order Statistics
**GET** `/analytics/orders`

**Access:** Protected  
**Description:** Get order statistics

**Query Parameters:**
- `store_id` (string)
- `period` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 10,
    "confirmed": 20,
    "processing": 15,
    "shipped": 10,
    "delivered": 90,
    "cancelled": 5,
    "averageOrderValue": 8000,
    "chartData": [
      {
        "status": "pending",
        "count": 10
      },
      {
        "status": "delivered",
        "count": 90
      }
    ]
  }
}
```

---

### 48. Product Performance
**GET** `/analytics/products`

**Access:** Protected  
**Description:** Get product performance analytics

**Query Parameters:**
- `store_id` (string)
- `period` (string)
- `limit` (number, top products to return)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalProducts": 45,
    "activeProducts": 42,
    "outOfStock": 3,
    "lowStock": 5,
    "topSelling": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sales_count": 50,
        "revenue": 250000,
        "stock_quantity": 80
      }
    ],
    "recentlyAdded": [
      {
        "id": "uuid",
        "name": "New Product",
        "created_at": "2025-12-11T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 49. Customer Analytics
**GET** `/analytics/customers`

**Access:** Protected  
**Description:** Get customer analytics

**Query Parameters:**
- `store_id` (string)
- `period` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCustomers": 120,
    "newCustomers": 15,
    "returningCustomers": 25,
    "topCustomers": [
      {
        "name": "Customer Name",
        "email": "customer@example.com",
        "order_count": 10,
        "total_spent": 80000
      }
    ]
  }
}
```

---

## Upload Endpoints

### 50. Upload Single Image
**POST** `/upload/image`

**Access:** Protected  
**Description:** Upload single image to Cloudinary

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN
```

**Form Data:**
- `image` (file) - Image file (JPG, PNG, WEBP, max 5MB)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "secure_url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "agm-store/user_id/xxxxx",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "resource_type": "image"
  }
}
```

---

### 51. Upload Multiple Images
**POST** `/upload/images`

**Access:** Protected  
**Description:** Upload multiple images (max 5)

**Headers:**
```http
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN
```

**Form Data:**
- `images` (files) - Array of image files

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "secure_url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "agm-store/user_id/xxxxx1"
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "secure_url": "https://res.cloudinary.com/.../image2.jpg",
      "public_id": "agm-store/user_id/xxxxx2"
    }
  ]
}
```

---

### 52. Delete Image
**DELETE** `/upload/image/:publicId`

**Access:** Protected  
**Description:** Delete image from Cloudinary

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Webhook Endpoints

### 53. Monnify Webhook
**POST** `/webhooks/monnify`

**Access:** Public (with signature verification)  
**Description:** Receive payment notifications from Monnify

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
    "transactionReference": "MNFY|20251211|123456",
    "paymentReference": "ORD-20251211-12345",
    "amountPaid": "12000.00",
    "totalPayable": "12000.00",
    "settlementAmount": "11700.00",
    "paidOn": "2025-12-11T00:10:00.000Z",
    "paymentStatus": "PAID",
    "paymentMethod": "ACCOUNT_TRANSFER",
    "currency": "NGN",
    "product": {
      "reference": "ORD-20251211-12345"
    },
    "cardDetails": {},
    "accountDetails": {
      "accountNumber": "1234567890",
      "accountName": "AGM Store Builder - My Store",
      "bankCode": "035",
      "bankName": "Wema Bank"
    },
    "accountPayments": [
      {
        "accountNumber": "1234567890",
        "accountName": "AGM Store Builder - My Store",
        "bankCode": "035",
        "bankName": "Wema Bank",
        "amountPaid": "12000.00"
      }
    ],
    "customer": {
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## System Endpoints

### 54. Health Check
**GET** `/health`

**Access:** Public  
**Description:** Check API health status

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T00:00:00.000Z",
  "uptime": 123456.78,
  "environment": "development",
  "version": "v1",
  "database": "connected"
}
```

---

### 55. API Version
**GET** `/version`

**Access:** Public  
**Description:** Get API version information

**Response:** `200 OK`
```json
{
  "version": "1.0.0",
  "apiVersion": "v1",
  "environment": "production",
  "buildDate": "2025-12-11"
}
```

---

## Error Codes Reference

### HTTP Status Codes

| Code | Description | When it occurs |
|------|-------------|----------------|
| 200 | OK | Successful GET, PUT, PATCH request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | External service error |

### Common Error Messages

```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 422,
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

```json
{
  "success": false,
  "message": "Unauthorized access",
  "statusCode": 401
}
```

```json
{
  "success": false,
  "message": "Store not found",
  "statusCode": 404
}
```

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702339200
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "statusCode": 429,
  "retryAfter": 900
}
```

---

## Frontend Integration Examples

### React/Next.js API Client

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### API Service Examples

```typescript
// lib/api/auth.ts
import { apiClient }