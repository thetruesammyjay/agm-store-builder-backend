import { db } from '../connection';
import { logger } from '../../utils/logger';
import { hashPassword } from '../../utils/bcrypt';
import { v4 as uuid } from 'uuid';

export interface UserSeed {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
}

/**
 * Get sample users data
 */
export async function getUsersData(): Promise<UserSeed[]> {
  const hashedPassword = await hashPassword('password123');
  
  return [
    {
      id: uuid(),
      email: 'sammy@agmtech.com',
      password_hash: hashedPassword,
      full_name: 'Sammy Jay',
      phone: '+2348012345678',
      email_verified: true,
      phone_verified: true,
      is_active: true,
    },
    {
      id: uuid(),
      email: 'john@example.com',
      password_hash: hashedPassword,
      full_name: 'John Doe',
      phone: '+2348098765432',
      email_verified: true,
      phone_verified: true,
      is_active: true,
    },
    {
      id: uuid(),
      email: 'jane@example.com',
      password_hash: hashedPassword,
      full_name: 'Jane Smith',
      phone: '+2348087654321',
      email_verified: true,
      phone_verified: false,
      is_active: true,
    },
    {
      id: uuid(),
      email: 'mike@example.com',
      password_hash: hashedPassword,
      full_name: 'Mike Johnson',
      phone: '+2348076543210',
      email_verified: false,
      phone_verified: false,
      is_active: true,
    },
    {
      id: uuid(),
      email: 'sarah@example.com',
      password_hash: hashedPassword,
      full_name: 'Sarah Williams',
      phone: '+2348065432109',
      email_verified: true,
      phone_verified: true,
      is_active: true,
    },
  ];
}

/**
 * Seed users table
 */
export async function seedUsers(): Promise<Record<string, string>> {
  logger.info('👥 Seeding users...');
  
  const users = await getUsersData();
  const userIds: Record<string, string> = {};
  
  for (const user of users) {
    try {
      await db.query(
        `INSERT INTO users (
          id, email, password_hash, full_name, phone, 
          email_verified, phone_verified, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.email,
          user.password_hash,
          user.full_name,
          user.phone,
          user.email_verified,
          user.phone_verified,
          user.is_active,
        ]
      );
      
      userIds[user.email] = user.id;
      logger.info(`  ✓ Created user: ${user.email}`);
    } catch (error: any) {
      // Skip if user already exists
      if (error.code === 'ER_DUP_ENTRY') {
        logger.warn(`  ⚠ User already exists: ${user.email}`);
        // Get existing user ID
        const existing = await db.queryOne<any>(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );
        if (existing) {
          userIds[user.email] = existing.id;
        }
      } else {
        throw error;
      }
    }
  }
  
  logger.info(`✅ Seeded ${Object.keys(userIds).length} users`);
  logger.info(`   Default password: password123`);
  
  return userIds;
}

/**
 * Clear users table
 */
export async function clearUsers(): Promise<void> {
  logger.info('🗑️  Clearing users table...');
  await db.query('DELETE FROM users');
  logger.info('✅ Users table cleared');
}