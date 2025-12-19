/**
 * AGM Store Builder - API Types
 * Types for API requests and responses
 */

/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: PaginationMeta;
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * Query Parameters
 */
export interface QueryParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Paginated Result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Token Pair
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string | null;
    email_verified: boolean;
    phone_verified: boolean;
  };
  tokens: TokenPair;
}

/**
 * Success Response
 */
export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * Database Query Result Types
 */
export interface DbRow {
  [key: string]: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}