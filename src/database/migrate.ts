import fs from 'fs';
import path from 'path';
import { db } from './connection';
import { logger } from '../utils/logger';

/**
 * Migration file interface
 */
interface Migration {
  id: string;
  name: string;
  filepath: string;
  sql: string;
}

/**
 * Get all migration files
 */
function getMigrationFiles(): Migration[] {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    logger.warn('Migrations directory not found');
    return [];
  }

  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'));
  
  return files
    .sort()
    .map((file) => {
      const filepath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filepath, 'utf-8');
      const parts = file.replace('.sql', '').split('_');
      const id = parts[0];
      const nameParts = parts.slice(1);
      
      if (!id) {
        throw new Error(`Invalid migration filename: ${file}. Expected format: XXX_name.sql`);
      }
      
      return {
        id,
        name: nameParts.join('_'),
        filepath,
        sql,
      };
    });
}

/**
 * Create migrations table if not exists
 */
async function createMigrationsTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  
  await db.query(sql);
  logger.info('✅ Migrations table ready');
}

/**
 * Get executed migrations
 */
async function getExecutedMigrations(): Promise<string[]> {
  const results = await db.queryMany<any>(
    'SELECT id FROM migrations ORDER BY id ASC'
  );
  
  return results.map((row) => row.id);
}

/**
 * Mark migration as executed
 */
async function markMigrationExecuted(migration: Migration): Promise<void> {
  await db.query(
    'INSERT INTO migrations (id, name) VALUES (?, ?)',
    [migration.id, migration.name]
  );
}

/**
 * Execute a single migration
 */
async function executeMigration(migration: Migration): Promise<void> {
  logger.info(`📝 Running migration: ${migration.id}_${migration.name}`);
  
  try {
    // Split SQL by semicolons and execute each statement
    const statements = migration.sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);
    
    for (const statement of statements) {
      await db.query(statement);
    }
    
    await markMigrationExecuted(migration);
    logger.info(`✅ Migration completed: ${migration.id}_${migration.name}`);
  } catch (error) {
    logger.error(`❌ Migration failed: ${migration.id}_${migration.name}`, error);
    throw error;
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  try {
    logger.info('🚀 Starting database migrations...');
    
    // Create migrations table
    await createMigrationsTable();
    
    // Get all migrations
    const allMigrations = getMigrationFiles();
    
    if (allMigrations.length === 0) {
      logger.info('ℹ️  No migration files found');
      return;
    }
    
    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    
    // Find pending migrations
    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration.id)
    );
    
    if (pendingMigrations.length === 0) {
      logger.info('✅ All migrations are up to date');
      return;
    }
    
    logger.info(`📋 Found ${pendingMigrations.length} pending migrations`);
    
    // Execute pending migrations
    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }
    
    logger.info('✅ All migrations completed successfully');
  } catch (error) {
    logger.error('❌ Migration process failed:', error);
    throw error;
  }
}

/**
 * Rollback last migration (if rollback SQL exists)
 */
export async function rollbackMigration(): Promise<void> {
  try {
    logger.info('🔄 Rolling back last migration...');
    
    const executedMigrations = await getExecutedMigrations();
    
    if (executedMigrations.length === 0) {
      logger.info('ℹ️  No migrations to rollback');
      return;
    }
    
    const lastMigrationId = executedMigrations[executedMigrations.length - 1];
    
    // Check for rollback file
    const rollbackFile = path.join(
      __dirname,
      'migrations',
      `${lastMigrationId}_rollback.sql`
    );
    
    if (!fs.existsSync(rollbackFile)) {
      logger.error(`❌ Rollback file not found: ${rollbackFile}`);
      return;
    }
    
    const rollbackSql = fs.readFileSync(rollbackFile, 'utf-8');
    
    // Execute rollback
    const statements = rollbackSql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);
    
    for (const statement of statements) {
      await db.query(statement);
    }
    
    // Remove from migrations table
    await db.query('DELETE FROM migrations WHERE id = ?', [lastMigrationId]);
    
    logger.info(`✅ Rolled back migration: ${lastMigrationId}`);
  } catch (error) {
    logger.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  total: number;
  executed: number;
  pending: number;
  migrations: Array<{
    id: string;
    name: string;
    status: 'executed' | 'pending';
    executedAt?: string;
  }>;
}> {
  const allMigrations = getMigrationFiles();
  const executedMigrations = await db.queryMany<any>(
    'SELECT id, name, executed_at FROM migrations ORDER BY id ASC'
  );
  
  const executedIds = new Set(executedMigrations.map((m) => m.id));
  
  const migrations = allMigrations.map((migration) => {
    const executed = executedMigrations.find((m) => m.id === migration.id);
    
    return {
      id: migration.id,
      name: migration.name,
      status: executedIds.has(migration.id) ? 'executed' as const : 'pending' as const,
      executedAt: executed?.executed_at,
    };
  });
  
  return {
    total: allMigrations.length,
    executed: executedMigrations.length,
    pending: allMigrations.length - executedMigrations.length,
    migrations,
  };
}

/**
 * CLI runner
 */
if (require.main === module) {
  const command = process.argv[2];
  
  (async () => {
    try {
      switch (command) {
        case 'up':
          await runMigrations();
          break;
        
        case 'down':
          await rollbackMigration();
          break;
        
        case 'status':
          const status = await getMigrationStatus();
          console.log('\n📊 Migration Status:');
          console.log(`   Total: ${status.total}`);
          console.log(`   Executed: ${status.executed}`);
          console.log(`   Pending: ${status.pending}\n`);
          
          console.log('📋 Migrations:');
          status.migrations.forEach((m) => {
            const icon = m.status === 'executed' ? '✅' : '⏳';
            console.log(`   ${icon} ${m.id}_${m.name} (${m.status})`);
          });
          console.log('');
          break;
        
        default:
          console.log('Usage:');
          console.log('  npm run migrate up       - Run pending migrations');
          console.log('  npm run migrate down     - Rollback last migration');
          console.log('  npm run migrate status   - Show migration status');
      }
      
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}