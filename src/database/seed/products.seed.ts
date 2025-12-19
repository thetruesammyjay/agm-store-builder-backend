/**
 * AGM Store Builder - Products Seed
 * Seeds sample products for development
 */

import { db } from '../connection';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

export interface ProductSeed {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string;
  variations?: string;
  stock_quantity: number;
  sku?: string;
  category: string;
  tags: string;
  is_active: boolean;
  is_featured: boolean;
}

/**
 * Get sample products data
 */
export function getProductsData(storeIds: Record<string, string>): ProductSeed[] {
  // Validate required store IDs exist
  const sammyShopId = storeIds['sammyshop'];
  const johnFashionId = storeIds['johnfashion'];
  const janeBeautyId = storeIds['janebeauty'];
  const mikeSportsId = storeIds['mikesports'];
  const sarahKitchenId = storeIds['sarahkitchen'];

  if (!sammyShopId || !johnFashionId || !janeBeautyId || !mikeSportsId || !sarahKitchenId) {
    throw new Error('Required store IDs not found. Please seed stores first.');
  }

  const products: ProductSeed[] = [];

  // Sammy's Tech Store Products
  products.push({
    id: uuid(),
    store_id: sammyShopId,
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.7-inch Super Retina XDR display with ProMotion.',
    price: 1200000,
    compare_at_price: 1500000,
    images: JSON.stringify([
      'https://via.placeholder.com/600x600?text=iPhone+15+Pro+Max',
      'https://via.placeholder.com/600x600?text=iPhone+Camera',
      'https://via.placeholder.com/600x600?text=iPhone+Display',
    ]),
    variations: JSON.stringify([
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'] },
    ]),
    stock_quantity: 15,
    sku: 'TECH-IPH15PM-001',
    category: 'Phones',
    tags: JSON.stringify(['iphone', 'apple', 'smartphone', 'flagship']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: sammyShopId,
    name: 'MacBook Air M2',
    description: 'Powerful and portable laptop with Apple M2 chip. Perfect for work, study, and creative projects. All-day battery life.',
    price: 950000,
    compare_at_price: 1100000,
    images: JSON.stringify([
      'https://via.placeholder.com/600x600?text=MacBook+Air+M2',
      'https://via.placeholder.com/600x600?text=MacBook+Display',
    ]),
    variations: JSON.stringify([
      { name: 'RAM', options: ['8GB', '16GB', '24GB'] },
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Space Gray', 'Silver', 'Midnight', 'Starlight'] },
    ]),
    stock_quantity: 8,
    sku: 'TECH-MBA-M2-001',
    category: 'Laptops',
    tags: JSON.stringify(['macbook', 'apple', 'laptop', 'portable']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: sammyShopId,
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced smartwatch with health monitoring, fitness tracking, and seamless connectivity.',
    price: 185000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Galaxy+Watch+6']),
    variations: JSON.stringify([
      { name: 'Size', options: ['40mm', '44mm'] },
      { name: 'Color', options: ['Black', 'Silver', 'Gold'] },
    ]),
    stock_quantity: 25,
    sku: 'TECH-GALW6-001',
    category: 'Wearables',
    tags: JSON.stringify(['samsung', 'smartwatch', 'fitness', 'health']),
    is_active: true,
    is_featured: false,
  });

  // John's Fashion House Products
  products.push({
    id: uuid(),
    store_id: johnFashionId,
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning. Perfect for everyday wear and athletic performance.',
    price: 45000,
    compare_at_price: 55000,
    images: JSON.stringify([
      'https://via.placeholder.com/600x600?text=Nike+Air+Max',
      'https://via.placeholder.com/600x600?text=Nike+Side+View',
    ]),
    variations: JSON.stringify([
      { name: 'Size', options: ['38', '39', '40', '41', '42', '43', '44', '45'] },
      { name: 'Color', options: ['Black/White', 'Blue/White', 'Red/White', 'All Black'] },
    ]),
    stock_quantity: 50,
    sku: 'FASH-NIKE-AM270-001',
    category: 'Shoes',
    tags: JSON.stringify(['nike', 'shoes', 'sports', 'sneakers', 'running']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: johnFashionId,
    name: 'Adidas Original Hoodie',
    description: 'Warm and stylish hoodie with iconic Adidas branding. Made from premium cotton blend for ultimate comfort.',
    price: 25000,
    compare_at_price: 32000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Adidas+Hoodie']),
    variations: JSON.stringify([
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Black', 'Gray', 'Navy', 'Maroon'] },
    ]),
    stock_quantity: 40,
    sku: 'FASH-ADIDAS-HOOD-001',
    category: 'Clothing',
    tags: JSON.stringify(['adidas', 'hoodie', 'fashion', 'streetwear']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: johnFashionId,
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans. Timeless style that never goes out of fashion.',
    price: 35000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Levis+Jeans']),
    variations: JSON.stringify([
      { name: 'Waist', options: ['28', '30', '32', '34', '36', '38'] },
      { name: 'Length', options: ['30', '32', '34'] },
      { name: 'Color', options: ['Blue', 'Black', 'Light Blue'] },
    ]),
    stock_quantity: 35,
    sku: 'FASH-LEVIS-501-001',
    category: 'Clothing',
    tags: JSON.stringify(['levis', 'jeans', 'denim', 'classic']),
    is_active: true,
    is_featured: false,
  });

  // Jane's Beauty Corner Products
  products.push({
    id: uuid(),
    store_id: janeBeautyId,
    name: 'Organic Face Cream',
    description: 'Natural face cream for all skin types. Enriched with shea butter, vitamin E, and botanical extracts. Made in Nigeria.',
    price: 15000,
    compare_at_price: 20000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Face+Cream']),
    stock_quantity: 100,
    sku: 'BEAUTY-CREAM-001',
    category: 'Skincare',
    tags: JSON.stringify(['skincare', 'organic', 'beauty', 'face cream', 'natural']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: janeBeautyId,
    name: 'Luxury Makeup Palette',
    description: '12-shade eyeshadow palette with highly pigmented colors. Includes matte, shimmer, and metallic finishes.',
    price: 28000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Makeup+Palette']),
    stock_quantity: 45,
    sku: 'BEAUTY-MAKEUP-PAL-001',
    category: 'Makeup',
    tags: JSON.stringify(['makeup', 'eyeshadow', 'palette', 'cosmetics']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: janeBeautyId,
    name: 'Argan Oil Hair Treatment',
    description: 'Premium argan oil for smooth, shiny, and healthy hair. Repairs damaged hair and prevents split ends.',
    price: 18000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Argan+Oil']),
    stock_quantity: 60,
    sku: 'BEAUTY-ARGAN-001',
    category: 'Hair Care',
    tags: JSON.stringify(['hair care', 'argan oil', 'treatment', 'natural']),
    is_active: true,
    is_featured: false,
  });

  // Mike's Sports Hub Products
  products.push({
    id: uuid(),
    store_id: mikeSportsId,
    name: 'Manchester United Home Jersey 2024',
    description: 'Official Manchester United home jersey. Made with breathable Adidas AEROREADY technology.',
    price: 32000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Man+Utd+Jersey']),
    variations: JSON.stringify([
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Customization', options: ['Plain', 'With Name & Number'] },
    ]),
    stock_quantity: 30,
    sku: 'SPORTS-MUFC-HOME-001',
    category: 'Jerseys',
    tags: JSON.stringify(['football', 'jersey', 'manchester united', 'premier league']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: mikeSportsId,
    name: 'Professional Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.',
    price: 12000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Yoga+Mat']),
    variations: JSON.stringify([
      { name: 'Color', options: ['Blue', 'Purple', 'Pink', 'Black', 'Green'] },
    ]),
    stock_quantity: 50,
    sku: 'SPORTS-YOGA-MAT-001',
    category: 'Fitness Equipment',
    tags: JSON.stringify(['yoga', 'fitness', 'exercise', 'mat']),
    is_active: true,
    is_featured: false,
  });

  // Sarah's Kitchen Essentials Products
  products.push({
    id: uuid(),
    store_id: sarahKitchenId,
    name: 'Non-Stick Cookware Set (10 Pieces)',
    description: 'Complete cookware set with frying pans, pots, and lids. Premium non-stick coating for easy cooking and cleaning.',
    price: 65000,
    compare_at_price: 85000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Cookware+Set']),
    stock_quantity: 20,
    sku: 'KITCHEN-COOK-SET-001',
    category: 'Cookware',
    tags: JSON.stringify(['cookware', 'kitchen', 'pots', 'pans', 'non-stick']),
    is_active: true,
    is_featured: true,
  });

  products.push({
    id: uuid(),
    store_id: sarahKitchenId,
    name: 'Electric Blender 1.5L',
    description: 'Powerful 500W blender for smoothies, soups, and more. Durable stainless steel blades.',
    price: 28000,
    images: JSON.stringify(['https://via.placeholder.com/600x600?text=Blender']),
    stock_quantity: 35,
    sku: 'KITCHEN-BLEND-001',
    category: 'Appliances',
    tags: JSON.stringify(['blender', 'kitchen', 'appliance', 'smoothie']),
    is_active: true,
    is_featured: true,
  });

  return products;
}

/**
 * Seed products table
 */
export async function seedProducts(storeIds: Record<string, string>): Promise<void> {
  logger.info('📦 Seeding products...');
  
  const products = getProductsData(storeIds);
  let seededCount = 0;
  
  for (const product of products) {
    try {
      await db.query(
        `INSERT INTO products (
          id, store_id, name, description, price, compare_at_price, 
          images, variations, stock_quantity, sku, category, tags, 
          is_active, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.store_id,
          product.name,
          product.description,
          product.price,
          product.compare_at_price || null,
          product.images,
          product.variations || null,
          product.stock_quantity,
          product.sku || null,
          product.category,
          product.tags,
          product.is_active,
          product.is_featured,
        ]
      );
      
      seededCount++;
      logger.info(`  ✓ Created product: ${product.name}`);
    } catch (error: any) {
      // Skip if product already exists
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn(`  ⚠ Product already exists: ${product.name}`);
      } else {
        throw error;
      }
    }
  }
  
  logger.info(`✅ Seeded ${seededCount} products`);
}

/**
 * Clear products table
 */
export async function clearProducts(): Promise<void> {
  logger.info('🗑️  Clearing products table...');
  await db.query('DELETE FROM products');
  logger.info('✅ Products table cleared');
}