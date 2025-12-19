/**
 * AGM Store Builder - Product Controller
 * HTTP request handlers for product management
 */

import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { asyncHandler, errors } from '../middleware/errorHandler';
import { validateParam } from '../utils/validators';

/**
 * POST /products
 * Create a new product
 */
export const createProduct = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const productData = req.body;
    const product = await productService.createProduct(productData, req.user.id);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  }
);

/**
 * GET /stores/:username/products
 * List products for a store (public)
 */
export const listProducts = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username = validateParam(req.params.username, 'Username');
    const filters = req.query;
    
    const result = await productService.listProducts(username, filters);

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  }
);

/**
 * GET /stores/:username/products/:productId
 * Get single product (public)
 */
export const getProduct = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const username = validateParam(req.params.username, 'Username');
    const productId = validateParam(req.params.productId, 'Product ID');
    
    const product = await productService.getProduct(username, productId);

    if (!product) {
      throw errors.notFound('Product');
    }

    res.json({
      success: true,
      data: product,
    });
  }
);

/**
 * GET /products/:productId
 * Get product by ID (authenticated)
 */
export const getProductById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const productId = validateParam(req.params.productId, 'Product ID');
    
    const product = await productService.getProductById(productId);

    if (!product) {
      throw errors.notFound('Product');
    }

    res.json({
      success: true,
      data: product,
    });
  }
);

/**
 * PUT /products/:productId
 * Update product
 */
export const updateProduct = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const productId = validateParam(req.params.productId, 'Product ID');
    const product = await productService.updateProduct(productId, req.user.id, req.body);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  }
);

/**
 * DELETE /products/:productId
 * Delete product
 */
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const productId = validateParam(req.params.productId, 'Product ID');
    await productService.deleteProduct(productId, req.user.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
);

/**
 * PATCH /products/:productId/stock
 * Update product stock
 */
export const updateStock = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized();
    }

    const productId = validateParam(req.params.productId, 'Product ID');
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || stock_quantity === null) {
      throw errors.badRequest('Stock quantity is required');
    }

    const product = await productService.updateStock(productId, req.user.id, stock_quantity);

    res.json({
      success: true,
      data: product,
      message: 'Stock updated successfully',
    });
  }
);