import { db } from '../connection';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

export interface StoreSeed {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  template_id: 'products' | 'bookings' | 'portfolio';
  custom_colors: string;
  custom_fonts?: string;
  social_links?: string;
  is_active: boolean;
}

/**
 * Get sample stores data
 */
export function getStoresData(userIds: Record<string, string>): StoreSeed[] {
  // Validate required user IDs exist
  const sammyUserId = userIds['sammy@agmtech.com'];
  const johnUserId = userIds['john@example.com'];
  const janeUserId = userIds['jane@example.com'];
  const mikeUserId = userIds['mike@example.com'];
  const sarahUserId = userIds['sarah@example.com'];

  if (!sammyUserId || !johnUserId || !janeUserId || !mikeUserId || !sarahUserId) {
    throw new Error('Required user IDs not found. Please seed users first.');
  }

  return [
    {
      id: uuid(),
      user_id: sammyUserId,
      username: 'sammyshop',
      display_name: 'Sammy\'s Tech Store',
      description: 'Quality tech products at affordable prices. Your one-stop shop for the latest gadgets, computers, and electronics in Nigeria.',
      logo_url: 'https://via.placeholder.com/200x200?text=ST',
      banner_url: 'https://via.placeholder.com/1200x400?text=Tech+Store',
      template_id: 'products',
      custom_colors: JSON.stringify({
        primary: '#3b82f6',
        secondary: '#eab308',
        accent: '#ef4444',
      }),
      custom_fonts: JSON.stringify({
        heading: 'Inter',
        body: 'Inter',
      }),
      social_links: JSON.stringify({
        facebook: 'https://facebook.com/sammyshop',
        instagram: 'https://instagram.com/sammyshop',
        twitter: 'https://twitter.com/sammyshop',
        whatsapp: '+2348012345678',
      }),
      is_active: true,
    },
    {
      id: uuid(),
      user_id: johnUserId,
      username: 'johnfashion',
      display_name: 'John\'s Fashion House',
      description: 'Latest fashion trends for everyone. Discover stylish clothing, shoes, and accessories for men and women.',
      logo_url: 'https://via.placeholder.com/200x200?text=JF',
      banner_url: 'https://via.placeholder.com/1200x400?text=Fashion+House',
      template_id: 'products',
      custom_colors: JSON.stringify({
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#f59e0b',
      }),
      custom_fonts: JSON.stringify({
        heading: 'Playfair Display',
        body: 'Lato',
      }),
      social_links: JSON.stringify({
        instagram: 'https://instagram.com/johnfashion',
        whatsapp: '+2348098765432',
      }),
      is_active: true,
    },
    {
      id: uuid(),
      user_id: janeUserId,
      username: 'janebeauty',
      display_name: 'Jane\'s Beauty Corner',
      description: 'Natural beauty products for you. Premium skincare, makeup, and wellness products for the modern Nigerian woman.',
      logo_url: 'https://via.placeholder.com/200x200?text=JB',
      banner_url: 'https://via.placeholder.com/1200x400?text=Beauty+Corner',
      template_id: 'products',
      custom_colors: JSON.stringify({
        primary: '#ec4899',
        secondary: '#f97316',
        accent: '#8b5cf6',
      }),
      custom_fonts: JSON.stringify({
        heading: 'Poppins',
        body: 'Open Sans',
      }),
      social_links: JSON.stringify({
        instagram: 'https://instagram.com/janebeauty',
        facebook: 'https://facebook.com/janebeauty',
        whatsapp: '+2348087654321',
      }),
      is_active: true,
    },
    {
      id: uuid(),
      user_id: mikeUserId,
      username: 'mikesports',
      display_name: 'Mike\'s Sports Hub',
      description: 'Everything sports and fitness. From jerseys to equipment, get authentic sports gear at great prices.',
      logo_url: 'https://via.placeholder.com/200x200?text=MS',
      template_id: 'products',
      custom_colors: JSON.stringify({
        primary: '#10b981',
        secondary: '#f59e0b',
        accent: '#3b82f6',
      }),
      is_active: true,
    },
    {
      id: uuid(),
      user_id: sarahUserId,
      username: 'sarahkitchen',
      display_name: 'Sarah\'s Kitchen Essentials',
      description: 'Make cooking easier with premium kitchen tools, appliances, and utensils.',
      logo_url: 'https://via.placeholder.com/200x200?text=SK',
      template_id: 'products',
      custom_colors: JSON.stringify({
        primary: '#f59e0b',
        secondary: '#ef4444',
        accent: '#8b5cf6',
      }),
      is_active: true,
    },
  ];
}

/**
 * Seed stores table
 */
export async function seedStores(userIds: Record<string, string>): Promise<Record<string, string>> {
  logger.info('🏪 Seeding stores...');
  
  const stores = getStoresData(userIds);
  const storeIds: Record<string, string> = {};
  
  for (const store of stores) {
    try {
      await db.query(
        `INSERT INTO stores (
          id, user_id, username, display_name, description, 
          logo_url, banner_url, template_id, custom_colors, 
          custom_fonts, social_links, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          store.id,
          store.user_id,
          store.username,
          store.display_name,
          store.description,
          store.logo_url || null,
          store.banner_url || null,
          store.template_id,
          store.custom_colors,
          store.custom_fonts || null,
          store.social_links || null,
          store.is_active,
        ]
      );
      
      storeIds[store.username] = store.id;
      logger.info(`  ✓ Created store: ${store.username} (${store.display_name})`);
    } catch (error: any) {
      // Skip if store already exists
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn(`  ⚠ Store already exists: ${store.username}`);
        // Get existing store ID
        const existing = await db.queryOne<any>(
          'SELECT id FROM stores WHERE username = ?',
          [store.username]
        );
        if (existing) {
          storeIds[store.username] = existing.id;
        }
      } else {
        throw error;
      }
    }
  }
  
  logger.info(`✅ Seeded ${Object.keys(storeIds).length} stores`);
  
  return storeIds;
}

/**
 * Clear stores table
 */
export async function clearStores(): Promise<void> {
  logger.info('🗑️  Clearing stores table...');
  await db.query('DELETE FROM stores');
  logger.info('✅ Stores table cleared');
}