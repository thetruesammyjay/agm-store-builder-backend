import { db } from './connection';
import { logger } from '../utils/logger';
import { seedUsers, clearUsers } from './seed/users.seed';
import { seedStores, clearStores } from './seed/stores.seed';
import { seedProducts, clearProducts } from './seed/products.seed';

/**
 * Clear all tables (DANGEROUS - dev only)
 */
async function clearAllTables(): Promise<void> {
  logger.warn('🗑️  Clearing all tables...');
  
  // Disable foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  
  // Clear in reverse order of dependencies
  await clearProducts();
  await clearStores();
  await clearUsers();
  
  // Also clear other tables
  const otherTables = [
    'activity_logs',
    'notifications',
    'reviews',
    'store_analytics',
    'payouts',
    'bank_accounts',
    'payments',
    'orders',
    'sessions',
    'password_resets',
    'otp_verifications',
  ];
  
  for (const table of otherTables) {
    await db.query(`DELETE FROM ${table}`);
  }
  
  // Re-enable foreign key checks
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
  
  logger.info('✅ All tables cleared');
}

/**
 * Run all seeders
 */
export async function seed(clearFirst: boolean = false): Promise<void> {
  try {
    logger.info('🌱 Starting database seeding...');
    logger.info('');
    
    if (clearFirst) {
      await clearAllTables();
      logger.info('');
    }
    
    // Seed in order of dependencies
    const userIds = await seedUsers();
    logger.info('');
    
    const storeIds = await seedStores(userIds);
    logger.info('');
    
    await seedProducts(storeIds);
    logger.info('');
    
    logger.info('✅ Database seeding completed successfully');
    logger.info('');
    logger.info('📋 Seeded Data Summary:');
    logger.info('   • 5 Users (password: password123)');
    logger.info('   • 5 Stores');
    logger.info('   • 14 Products');
    logger.info('');
    logger.info('🔐 Test Accounts:');
    logger.info('   • sammy@agmtech.com / password123');
    logger.info('   • john@example.com / password123');
    logger.info('   • jane@example.com / password123');
    logger.info('');
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * CLI runner
 */
if (require.main === module) {
  const clearFirst = process.argv.includes('--clear');
  
  (async () => {
    try {
      await seed(clearFirst);
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}