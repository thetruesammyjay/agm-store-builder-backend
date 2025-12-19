# AGM Store Builder - Backend API Endpoints (Part 2)

> Continuation of API endpoint reference - Frontend Integration Examples & Quick Start Guide

---

## Frontend Integration Examples (Continued)

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
  
  resendVerification: (email: string) =>
    apiClient.post('/auth/resend-verification', { email }),
};

// lib/api/users.ts
export const usersAPI = {
  getCurrentUser: () =>
    apiClient.get('/users/me'),
  
  updateProfile: (data: UpdateProfileData) =>
    apiClient.put('/users/me', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/users/change-password', { currentPassword, newPassword }),
  
  deleteAccount: () =>
    apiClient.delete('/users/me'),
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
  
  updateStock: (productId: string, stock_quantity: number, operation: 'set' | 'increment' | 'decrement' = 'set') =>
    apiClient.patch(`/products/${productId}/stock`, { stock_quantity, operation }),
  
  toggleStatus: (productId: string, is_active: boolean) =>
    apiClient.patch(`/products/${productId}/status`, { is_active }),
  
  delete: (productId: string) => 
    apiClient.delete(`/products/${productId}`),
  
  bulkUpdate: (product_ids: string[], updates: Partial<UpdateProductData>) =>
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
  
  updateStatus: (orderId: string, status: OrderStatus) => 
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
    apiClient.delete(`/upload/image/${encodeURIComponent(publicId)}`),
};