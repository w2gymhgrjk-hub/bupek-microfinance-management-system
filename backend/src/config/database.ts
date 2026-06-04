/**
 * Database configuration and connection setup
 */

import { Pool, PoolClient } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bupek_microfinance',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a query with parameters
 */
export const query = async <T = any>(text: string, params?: any[]): Promise<T[]> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Executed query', { duration, rowCount: result.rowCount });
    return result.rows;
  } catch (error) {
    console.error('[DB] Query error:', error);
    throw error;
  }
};

/**
 * Execute a single row query
 */
export const queryOne = async <T = any>(text: string, params?: any[]): Promise<T | null> => {
  const results = await query<T>(text, params);
  return results.length > 0 ? results[0] : null;
};

/**
 * Get a client for transaction handling
 */
export const getClient = async (): Promise<PoolClient> => {
  return pool.connect();
};

/**
 * Check database connection
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('[DB] Connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[DB] Connection failed:', error);
    return false;
  }
};

/**
 * Close the pool
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
  console.log('[DB] Pool closed');
};

export default pool;
