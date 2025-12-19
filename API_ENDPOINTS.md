# AGM Store Builder - API Endpoints Documentation

> Complete API reference for frontend developers integrating with the Express backend

---

## 📋 Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [Authentication Endpoints](#authentication-endpoints)
5. [Store Endpoints](#store-endpoints)
6. [Product Endpoints](#product-endpoints)
7. [Order Endpoints](#order-endpoints)
8. [Payment Endpoints](#payment-endpoints)
9. [Dashboard/Analytics Endpoints](#dashboardanalytics-endpoints)
10. [Upload Endpoints](#upload-endpoints)
11. [Webhook Endpoints](#webhook-endpoints)

---

## 🔗 Base URL & Authentication

### Base URL

```
Development: http://localhost:4000/api/v1
Production:  https://api.agmshop.com/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Rate Limiting

- **Public endpoints:** 100 requests per 15 minutes
- **Authenticated endpoints:** 300 requests per 15 minutes
- **Upload endpoints:** 20 requests per hour

---

## 📦 Response Format

### Success Response

```typescript
{
  success: true,
  data: {
    // Response data
  },
  message?: "Optional success message"
}
```

### Error Response

```typescript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details?: {
      // Additional error details
    }
  }
}
```

### Paginated Response

```typescript
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8,
    hasNext: true,
    hasPrev: false
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

```typescript
// Authentication Errors
INVALID_CREDENTIALS
EMAIL_NOT_VERIFIED
PHONE_NOT_VERIFIED
TOKEN_EXPIRED
TOKEN_INVALID

// Validation Errors
VALIDATION_ERROR
MISSING_REQUIRED_FIELD
INVALID_FORMAT

// Resource Errors
RESOURCE_NOT_FOUND
RESOURCE_ALREADY_EXISTS
USERNAME_TAKEN
USERNAME_RESERVED

// Permission Errors
UNAUTHORIZED
FORBIDDEN
NOT_OWNER

// Payment Errors
PAYMENT_FAILED
INVALID_BANK_ACCOUNT
PAYOUT_FAILED

// System Errors
INTERNAL_SERVER_ERROR
SERVICE_UNAVAILABLE
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /auth/signup
```

**Request Body:**
```typescript
{
  email: string;           // Valid email
  phone: string;           // Nigerian phone format: +234XXXXXXXXXX
  password: string;        // Min 8 chars, 1 uppercase, 1 number
  fullName: string;        // Min 3 chars
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    userId: string;
    email: string;
    message: "Verification OTP sent to your email"
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useAuth.ts
import api from '@/lib/api';

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/signup', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to OTP verification
      router.push(`/verify?email=${data.data.email}`);
    },
  });
}
```

---

### Verify OTP

```http
POST /auth/verify-otp
```

**Request Body:**
```typescript
{
  email: string;
  code: string;           // 6-digit OTP
  type: 'email' | 'phone';
}
```

**Response (200):**
```typescript
{
  success: true,
  message: "Email verified successfully"
}
```

---

### Login

```http
POST /auth/login
```

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    token: string;          // JWT token (expires in 7 days)
    user: {
      id: string;
      email: string;
      fullName: string;
      emailVerified: boolean;
      phoneVerified: boolean;
    }
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useAuth.ts
export function useLogin() {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Save to Zustand store
      login(data.data.user, data.data.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}
```

---

### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**
```typescript
{
  email: string;
}
```

**Response (200):**
```typescript
{
  success: true,
  message: "Password reset link sent to your email"
}
```

---

### Reset Password

```http
POST /auth/reset-password
```

**Request Body:**
```typescript
{
  token: string;          // From email link
  newPassword: string;
}
```

**Response (200):**
```typescript
{
  success: true,
  message: "Password reset successfully"
}
```

---

### Get Current User

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    phone: string;
    fullName: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
  }
}
```

---

## 🏪 Store Endpoints

### Check Username Availability

```http
GET /stores/check/:username
```

**Parameters:**
- `username` (path) - Store username to check

**Response (200):**
```typescript
{
  success: true,
  data: {
    available: boolean;
    username: string;
    message?: string;  // If not available, reason (reserved/taken)
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/useStore.ts
export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: ['username-availability', username],
    queryFn: async () => {
      const response = await api.get(`/stores/check/${username}`);
      return response.data.data;
    },
    enabled: username.length >= 3,
    staleTime: 0, // Always fresh check
  });
}
```

---

### Create Store

```http
POST /stores
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
{
  username: string;           // 3-30 chars, lowercase, alphanumeric + hyphens
  displayName: string;        // Store display name
  description?: string;
  templateId: 'products' | 'bookings' | 'portfolio';
  customColors?: {
    primary: string;          // Hex color
    secondary: string;
    accent: string;
  };
  customFonts?: {
    heading: string;
    body: string;
  };
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    id: string;
    username: string;
    displayName: string;
    storeUrl: string;         // e.g., "teststore.agmshop.com"
    virtualAccount: {
      accountNumber: string;
      accountName: string;
      bankName: string;
      provider: string;
    };
  }
}
```

**Frontend Implementation:**
```typescript
export function useCreateStore() {
  return useMutation({
    mutationFn: async (data: CreateStoreData) => {
      const response = await api.post('/stores', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success(`Store created: ${data.data.storeUrl}`);
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}
```

---

### Get Store by Username (Public)

```http
GET /stores/:username
```

**Parameters:**
- `username` (path) - Store username

**Response (200):**
```typescript
{
  success: true,
  data: {
    id: string;
    username: string;
    displayName: string;
    description: string;
    logoUrl: string;
    templateId: string;
    customColors: object;
    customFonts: object;
    isActive: boolean;
    owner: {
      fullName: string;
    };
  }
}
```

---

### Update Store

```http
PUT /stores/:id
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:** (All fields optional)
```typescript
{
  displayName?: string;
  description?: string;
  logoUrl?: string;
  customColors?: object;
  customFonts?: object;
  isActive?: boolean;
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    // Updated store object
  }
}
```

---

### Get User's Stores

```http
GET /stores
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      username: string;
      displayName: string;
      isActive: boolean;
      createdAt: string;
    }
  ]
}
```

---

## 📦 Product Endpoints

### Create Product

```http
POST /stores/:storeId/products
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  price: number;              // In Naira
  compareAtPrice?: number;    // Original price (for discounts)
  images: string[];           // Array of image URLs (upload first)
  variations?: {
    name: string;             // e.g., "Size", "Color"
    options: string[];        // e.g., ["S", "M", "L"]
  }[];
  stockQuantity: number;
  isActive?: boolean;         // Default: true
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    id: string;
    storeId: string;
    name: string;
    price: number;
    images: string[];
    // ... other fields
  }
}
```

**Frontend Implementation:**
```typescript
export function useCreateProduct(storeId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const response = await api.post(`/stores/${storeId}/products`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries(['products', storeId]);
      
      toast.success('Product created successfully');
      router.push('/dashboard/products');
    },
  });
}
```

---

### List Products (Public)

```http
GET /stores/:username/products
```

**Query Parameters:**
```typescript
{
  page?: number;            // Default: 1
  limit?: number;           // Default: 20, Max: 100
  search?: string;          // Search by name/description
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;        // Only show in-stock items
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
```

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      name: string;
      description: string;
      price: number;
      compareAtPrice: number;
      images: string[];
      stockQuantity: number;
      isActive: boolean;
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 50,
    totalPages: 3
  }
}
```

**Frontend Implementation:**
```typescript
export function useProducts(username: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', username, filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await api.get(`/stores/${username}/products?${params}`);
      return response.data;
    },
  });
}
```

---

### Get Product by ID (Public)

```http
GET /stores/:username/products/:productId
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice: number;
    images: string[];
    variations: object[];
    stockQuantity: number;
    store: {
      username: string;
      displayName: string;
    };
  }
}
```

---

### Update Product

```http
PUT /products/:id
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:** (All fields optional)
```typescript
{
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  images?: string[];
  variations?: object[];
  stockQuantity?: number;
  isActive?: boolean;
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    // Updated product object
  }
}
```

---

### Delete Product

```http
DELETE /products/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```typescript
{
  success: true,
  message: "Product deleted successfully"
}
```

---

## 🛒 Order Endpoints

### Create Order (Public - Guest Checkout)

```http
POST /stores/:username/orders
```

**Request Body:**
```typescript
{
  customerName: string;
  customerPhone: string;        // +234XXXXXXXXXX
  customerEmail?: string;
  customerAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  items: [
    {
      productId: string;
      quantity: number;
      selectedVariations?: {
        [key: string]: string;  // e.g., { "Size": "M", "Color": "Blue" }
      };
    }
  ];
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    orderId: string;
    orderNumber: string;          // e.g., "AGM-2025-001234"
    totalAmount: number;
    agmFee: number;
    paymentReference: string;
    virtualAccount: {
      accountNumber: string;
      accountName: string;
      bankName: string;
      amountToPay: number;
    };
    expiresAt: string;            // Payment expiry (30 minutes)
  }
}
```

**Frontend Implementation:**
```typescript
export function useCreateOrder(username: string) {
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const response = await api.post(`/stores/${username}/orders`, orderData);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to payment instructions
      router.push(`/order-success?ref=${data.data.paymentReference}`);
    },
  });
}
```

---

### Get Order by ID

```http
GET /orders/:id
```

**Headers:** `Authorization: Bearer {token}` (for seller)  
**OR** No auth (if customer has order number)

**Response (200):**
```typescript
{
  success: true,
  data: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: [
      {
        productName: string;
        productImage: string;
        quantity: number;
        price: number;
        subtotal: number;
      }
    ];
    subtotal: number;
    agmFee: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
  }
}
```

---

### Track Order (Public)

```http
GET /orders/track/:orderNumber
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    orderNumber: string;
    status: string;
    paymentStatus: string;
    timeline: [
      {
        status: string;
        timestamp: string;
        message: string;
      }
    ];
  }
}
```

---

### List Orders (Seller Dashboard)

```http
GET /dashboard/orders
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  startDate?: string;         // ISO date
  endDate?: string;
}
```

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      orderNumber: string;
      customerName: string;
      totalAmount: number;
      status: string;
      paymentStatus: string;
      createdAt: string;
    }
  ],
  pagination: { ... }
}
```

---

### Update Order Status

```http
PATCH /orders/:id/status
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
{
  status: 'confirmed' | 'fulfilled' | 'cancelled';
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    // Updated order
  }
}
```

---

## 💳 Payment Endpoints

### Add Bank Account

```http
POST /payments/bank-accounts
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
{
  accountNumber: string;      // 10 digits
  bankCode: string;           // Nigerian bank code (e.g., "058" for GTBank)
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    id: string;
    accountNumber: string;
    accountName: string;        // Retrieved from Paystack
    bankName: string;
    bankCode: string;
    isVerified: boolean;
    isDefault: boolean;
  }
}
```

**Frontend Implementation:**
```typescript
export function useAddBankAccount() {
  return useMutation({
    mutationFn: async (data: BankAccountData) => {
      const response = await api.post('/payments/bank-accounts', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Bank account added and verified');
    },
  });
}
```

---

### List Bank Accounts

```http
GET /payments/bank-accounts
```

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      accountNumber: string;
      accountName: string;
      bankName: string;
      isVerified: boolean;
      isDefault: boolean;
    }
  ]
}
```

---

### Get Nigerian Banks

```http
GET /payments/banks
```

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      name: string;
      code: string;
      active: boolean;
    }
  ]
}
```

---

## 📊 Dashboard/Analytics Endpoints

### Get Dashboard Analytics

```http
GET /dashboard/analytics
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```typescript
{
  storeId?: string;           // Filter by specific store
  startDate?: string;         // ISO date
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'year';
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    revenueByDay: [
      {
        date: string;
        revenue: number;
        orders: number;
      }
    ];
    topProducts: [
      {
        productId: string;
        productName: string;
        productImage: string;
        totalSales: number;
        unitsSold: number;
      }
    ];
    recentOrders: [
      // Last 5 orders
    ];
  }
}
```

**Frontend Implementation:**
```typescript
export function useDashboardAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await api.get(`/dashboard/analytics?${params}`);
      return response.data.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
```

---

### Get Revenue Stats

```http
GET /dashboard/revenue
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```typescript
{
  storeId?: string;
  period: 'day' | 'week' | 'month' | 'year';
}
```

**Response (200):**
```typescript
{
  success: true,
  data: {
    currentPeriod: {
      revenue: number;
      orders: number;
      customers: number;
    };
    previousPeriod: {
      revenue: number;
      orders: number;
      customers: number;
    };
    growth: {
      revenuePercentage: number;
      ordersPercentage: number;
      customersPercentage: number;
    };
  }
}
```

---

### Get Customer List

```http
GET /dashboard/customers
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  search?: string;            // Search by name/phone/email
  sortBy?: 'name' | 'orders' | 'totalSpent' | 'lastOrder';
  sortOrder?: 'asc' | 'desc';
}
```

**Response (200):**
```typescript
{
  success: true,
  data: [
    {
      name: string;
      phone: string;
      email: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
    }
  ],
  pagination: { ... }
}
```

---

## 📤 Upload Endpoints

### Upload Image

```http
POST /upload/image
```

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```typescript
{
  image: File;                // Max 5MB, jpg/jpeg/png/webp
  type: 'logo' | 'product' | 'banner';
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    url: string;              // Full URL to uploaded image
    filename: string;
    size: number;
    mimeType: string;
  }
}
```

**Frontend Implementation:**
```typescript
export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File, type: string) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Image uploaded successfully');
      return data.data.url;
    },
  });
}
```

---

### Upload Multiple Images

```http
POST /upload/images
```

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```typescript
{
  images: File[];             // Max 5 images, 5MB each
  type: string;
}
```

**Response (201):**
```typescript
{
  success: true,
  data: {
    urls: string[];           // Array of uploaded image URLs
  }
}
```

---

## 🔗 Webhook Endpoints

### Monnify Payment Webhook

```http
POST /webhooks/monnify
```

**Note:** This is called by Monnify servers, not your frontend.

**Webhook Payload:**
```typescript
{
  eventType: string;
  eventData: {
    transactionReference: string;
    paymentReference: string;
    amountPaid: number;
    totalPayable: number;
    settlementAmount: number;
    paidOn: string;
    paymentStatus: string;
    paymentDescription: string;
    currency: string;
    paymentMethod: string;
    product: {
      type: string;
      reference: string;
    };
    cardDetails?: object;
    accountDetails?: object;
    accountPayments?: array;
    customer: {
      email: string;
      name: string;
    };
  }
}
```

**Frontend: Poll Order Status**
After showing payment instructions, poll the order status:

```typescript
export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ['order-status', orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data;
    },
    refetchInterval: (data) => {
      // Stop polling when payment is confirmed
      return data?.paymentStatus === 'paid' ? false : 5000;
    },
  });
}
```

---

## 🔄 Real-time Updates

### Server-Sent Events (Optional)

If implementing real-time order updates:

```http
GET /events/orders
```

**Headers:** `Authorization: Bearer {token}`

**Frontend Implementation:**
```typescript
useEffect(() => {
  const token = useAuthStore.getState().token;
  const eventSource = new EventSource(
    `${API_URL}/events/orders?token=${token}`
  );
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'NEW_ORDER') {
      // Show notification
      toast.info(`New order: ${data.orderNumber}`);
      
      // Invalidate orders query
      queryClient.invalidateQueries(['orders']);
    }
  };
  
  return () => eventSource.close();
}, []);
```

---

## 📝 Usage Examples

### Complete Checkout Flow

```typescript
// 1. Customer adds items to cart
const { addItem } = useCartStore();
addItem(product);

// 2. Customer proceeds to checkout
const { mutate: createOrder } = useCreateOrder(storeUsername);

createOrder({
  customerName: form.values.name,
  customerPhone: form.values.phone,
  customerEmail: form.values.email,
  items: cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  })),
});

// 3. Show payment instructions
// (Redirect handled in onSuccess)

// 4. Poll order status
const { data: order } = useOrderStatus(orderId);

useEffect(() => {
  if (order?.paymentStatus === 'paid') {
    toast.success('Payment confirmed!');
    router.push(`/track/${order.orderNumber}`);
  }
}, [order]);
```

---

### Product Management Flow

```typescript
// 1. Upload product images
const { mutateAsync: uploadImage } = useUploadImage();
const imageUrls = await Promise.all(
  selectedFiles.map(file => uploadImage(file, 'product'))
);

// 2. Create product
const { mutate: createProduct } = useCreateProduct(storeId);

createProduct({
  name: form.values.name,
  description: form.values.description,
  price: form.values.price,
  images: imageUrls.map(res => res.data.url),
  stockQuantity: form.values.stock,
});
```

---

## 🚨 Important Notes

### Security
- Never expose API keys in frontend code
- Always validate user input before sending to API
- Store JWT tokens securely (httpOnly cookies preferred)
- Implement CSRF protection for authenticated requests

### Performance
- Use React Query for caching and automatic refetching
- Implement optimistic updates for better UX
- Lazy load images and components
- Use pagination for large lists

### Error Handling
- Always handle API errors gracefully
- Show user-friendly error messages
- Log errors to error tracking service (Sentry)
- Implement retry logic for failed requests

### Testing
- Test all API integrations thoroughly
- Mock API responses in development
- Test error scenarios
- Test with slow network conditions

---

**API Base URL (Production):** `https://api.shopwithagm.com/api/v1`

**API Documentation:** https://docs.shopwithagm.com/api

**Support:** support@shopwithagm.com