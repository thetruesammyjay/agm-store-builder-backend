import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { config } from './env';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

/**
 * Database configuration
 */
const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // SSL configuration for Railway
  ...(config.nodeEnv === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

/**
 * Create database connection pool
 */
export function createPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    logger.info('Database pool created');
  }
  return pool;
}

/**
 * Get database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    return createPool();
  }
  return pool;
}

/**
 * Connect to database and verify connection
 */
export async function connectDatabase(): Promise<void> {
  try {
    const poolInstance = getPool();
    
    // Test connection
    const connection = await poolInstance.getConnection();
    await connection.ping();
    connection.release();
    
    logger.info(' Database connected successfully');
    logger.info(` Database: ${config.database.name}`);
    logger.info(` Host: ${config.database.host}:${config.database.port}`);
  } catch (error) {
    logger.error(' Database connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      logger.info(' Database disconnected successfully');
    } catch (error) {
      logger.error(' Error disconnecting from database:', error);
      throw error;
    }
  }
}

/**
 * Execute a query with automatic connection management
 */
export async function query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(
  sql: string,
  params?: any[]
): Promise<T> {
  const poolInstance = getPool();
  const [results] = await poolInstance.execute<T>(sql, params);
  return results;
}

/**
 * Get a connection from the pool for transactions
 */
export async function getConnection(): Promise<PoolConnection> {
  const poolInstance = getPool();
  return await poolInstance.getConnection();
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const poolInstance = getPool();
    const connection = await poolInstance.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
}

// Export pool for direct access if needed
export { pool };