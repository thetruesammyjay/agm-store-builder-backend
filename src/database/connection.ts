/**
 * AGM Store Builder - Database Connection Singleton
 * Provides a single database connection instance
 */

import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getPool, transaction as poolTransaction } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Database connection class
 */
class DatabaseConnection {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Execute a query
   */
  async query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(
    sql: string,
    params?: any[]
  ): Promise<T> {
    try {
      const [results] = await this.pool.execute<T>(sql, params);
      return results;
    } catch (error) {
      logger.error('Database query error:', { sql, error });
      throw error;
    }
  }

  /**
   * Execute a query and return a single row
   */
  async queryOne<T extends RowDataPacket>(
    sql: string,
    params?: any[]
  ): Promise<T | null> {
    const results = await this.query<T[]>(sql, params);
    return results.length > 0 && results[0] ? results[0] : null;
  }

  /**
   * Execute a query and return multiple rows
   */
  async queryMany<T extends RowDataPacket>(
    sql: string,
    params?: any[]
  ): Promise<T[]> {
    return await this.query<T[]>(sql, params);
  }

  /**
   * Execute an insert query and return the inserted ID
   */
  async insert(sql: string, params?: any[]): Promise<string> {
    const result = await this.query<ResultSetHeader>(sql, params);
    return result.insertId.toString();
  }

  /**
   * Execute an update query and return affected rows
   */
  async update(sql: string, params?: any[]): Promise<number> {
    const result = await this.query<ResultSetHeader>(sql, params);
    return result.affectedRows;
  }

  /**
   * Execute a delete query and return affected rows
   */
  async delete(sql: string, params?: any[]): Promise<number> {
    const result = await this.query<ResultSetHeader>(sql, params);
    return result.affectedRows;
  }

  /**
   * Get a connection for transactions
   */
  async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    callback: (connection: PoolConnection) => Promise<T>
  ): Promise<T> {
    return await poolTransaction(callback);
  }

  /**
   * Check if a record exists
   */
  async exists(sql: string, params?: any[]): Promise<boolean> {
    const result = await this.queryOne<RowDataPacket>(sql, params);
    return result !== null;
  }

  /**
   * Count records
   */
  async count(sql: string, params?: any[]): Promise<number> {
    const result = await this.queryOne<RowDataPacket>(sql, params);
    return result ? (result.count as number) : 0;
  }

  /**
   * Paginate results
   */
  async paginate<T extends RowDataPacket>(
    sql: string,
    params: any[],
    page: number = 1,
    limit: number = 20
  ): Promise<{
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    // Get total count
    const countSql = `SELECT COUNT(*) as count FROM (${sql}) as countQuery`;
    const countResult = await this.queryOne<RowDataPacket>(countSql, params);
    const total = countResult?.count as number || 0;

    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
    const items = await this.queryMany<T>(paginatedSql, [...params, limit, offset]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}

// Export singleton instance
export const db = new DatabaseConnection();

// Export class for testing
export { DatabaseConnection };