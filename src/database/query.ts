import { RowDataPacket } from 'mysql2/promise';
import { db } from './connection';

/**
 * Query builder interface
 */
interface QueryBuilder {
  table: string;
  select?: string[];
  where?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

/**
 * Build WHERE clause from object
 */
function buildWhereClause(where: Record<string, any>): { sql: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  Object.entries(where).forEach(([key, value]) => {
    if (value === null) {
      conditions.push(`${key} IS NULL`);
    } else if (Array.isArray(value)) {
      conditions.push(`${key} IN (${value.map(() => '?').join(', ')})`);
      params.push(...value);
    } else {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  });

  return {
    sql: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
}

/**
 * Find one record by criteria
 */
export async function findOne<T extends RowDataPacket>(
  table: string,
  where: Record<string, any>
): Promise<T | null> {
  const { sql: whereClause, params } = buildWhereClause(where);
  const query = `SELECT * FROM ${table} ${whereClause} LIMIT 1`;
  return await db.queryOne<T>(query, params);
}

/**
 * Find one record by ID
 */
export async function findById<T extends RowDataPacket>(
  table: string,
  id: string
): Promise<T | null> {
  return await findOne<T>(table, { id });
}

/**
 * Find all records by criteria
 */
export async function findMany<T extends RowDataPacket>(
  table: string,
  where?: Record<string, any>,
  orderBy?: string,
  limit?: number
): Promise<T[]> {
  let query = `SELECT * FROM ${table}`;
  let params: any[] = [];

  if (where) {
    const { sql: whereClause, params: whereParams } = buildWhereClause(where);
    query += ` ${whereClause}`;
    params = whereParams;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ?`;
    params.push(limit);
  }

  return await db.queryMany<T>(query, params);
}

/**
 * Find all records in a table
 */
export async function findAll<T extends RowDataPacket>(
  table: string,
  orderBy?: string
): Promise<T[]> {
  return await findMany<T>(table, undefined, orderBy);
}

/**
 * Create a new record
 */
export async function create(
  table: string,
  data: Record<string, any>
): Promise<string> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(', ');

  const query = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;

  const result = await db.query<any>(query, values);
  return result.insertId || data.id;
}

/**
 * Update a record by ID
 */
export async function updateById(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<number> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col) => `${col} = ?`).join(', ');

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  return await db.update(query, [...values, id]);
}

/**
 * Update records by criteria
 */
export async function updateMany(
  table: string,
  where: Record<string, any>,
  data: Record<string, any>
): Promise<number> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col) => `${col} = ?`).join(', ');

  const { sql: whereClause, params: whereParams } = buildWhereClause(where);
  const query = `UPDATE ${table} SET ${setClause} ${whereClause}`;

  return await db.update(query, [...values, ...whereParams]);
}

/**
 * Delete a record by ID
 */
export async function deleteById(table: string, id: string): Promise<number> {
  const query = `DELETE FROM ${table} WHERE id = ?`;
  return await db.delete(query, [id]);
}

/**
 * Delete records by criteria
 */
export async function deleteMany(
  table: string,
  where: Record<string, any>
): Promise<number> {
  const { sql: whereClause, params } = buildWhereClause(where);
  const query = `DELETE FROM ${table} ${whereClause}`;
  return await db.delete(query, params);
}

/**
 * Count records by criteria
 */
export async function count(
  table: string,
  where?: Record<string, any>
): Promise<number> {
  let query = `SELECT COUNT(*) as count FROM ${table}`;
  let params: any[] = [];

  if (where) {
    const { sql: whereClause, params: whereParams } = buildWhereClause(where);
    query += ` ${whereClause}`;
    params = whereParams;
  }

  return await db.count(query, params);
}

/**
 * Check if a record exists
 */
export async function exists(
  table: string,
  where: Record<string, any>
): Promise<boolean> {
  const recordCount = await count(table, where);
  return recordCount > 0;
}

/**
 * Soft delete (set is_active = false)
 */
export async function softDelete(table: string, id: string): Promise<number> {
  return await updateById(table, id, { is_active: false });
}

/**
 * Restore soft deleted record
 */
export async function restore(table: string, id: string): Promise<number> {
  return await updateById(table, id, { is_active: true });
}

/**
 * Paginate records
 */
export async function paginate<T extends RowDataPacket>(
  builder: QueryBuilder,
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
  const { table, select, where, orderBy } = builder;
  const selectClause = select ? select.join(', ') : '*';

  let query = `SELECT ${selectClause} FROM ${table}`;
  let params: any[] = [];

  if (where) {
    const { sql: whereClause, params: whereParams } = buildWhereClause(where);
    query += ` ${whereClause}`;
    params = whereParams;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  return await db.paginate<T>(query, params, page, limit);
}

/**
 * Execute raw SQL query
 */
export async function raw<T extends RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  return await db.queryMany<T>(sql, params);
}

/**
 * Begin a transaction
 */
export async function transaction<T>(
  callback: (connection: any) => Promise<T>
): Promise<T> {
  return await db.transaction(callback);
}

/**
 * Search with FULLTEXT index
 */
export async function fullTextSearch<T extends RowDataPacket>(
  table: string,
  columns: string[],
  searchTerm: string,
  where?: Record<string, any>,
  limit: number = 20
): Promise<T[]> {
  const columnsStr = columns.join(', ');
  let query = `
    SELECT *, MATCH(${columnsStr}) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
    FROM ${table}
    WHERE MATCH(${columnsStr}) AGAINST(? IN NATURAL LANGUAGE MODE)
  `;
  let params: any[] = [searchTerm, searchTerm];

  if (where) {
    const { sql: whereClause, params: whereParams } = buildWhereClause(where);
    query += ` AND ${whereClause.replace('WHERE', '')}`;
    params.push(...whereParams);
  }

  query += ` ORDER BY relevance DESC LIMIT ?`;
  params.push(limit);

  return await db.queryMany<T>(query, params);
}

/**
 * Increment a numeric field
 */
export async function increment(
  table: string,
  id: string,
  field: string,
  value: number = 1
): Promise<number> {
  const query = `UPDATE ${table} SET ${field} = ${field} + ? WHERE id = ?`;
  return await db.update(query, [value, id]);
}

/**
 * Decrement a numeric field
 */
export async function decrement(
  table: string,
  id: string,
  field: string,
  value: number = 1
): Promise<number> {
  const query = `UPDATE ${table} SET ${field} = ${field} - ? WHERE id = ?`;
  return await db.update(query, [value, id]);
}