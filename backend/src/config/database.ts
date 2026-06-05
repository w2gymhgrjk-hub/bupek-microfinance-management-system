import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'bupek_microfinance',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const checkConnection = async (): Promise<boolean> => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✓ Database connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
};

export const query = async (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getConnection = async (): Promise<PoolClient> => {
  return pool.connect();
};

export const transaction = async (callback: (client: PoolClient) => Promise<any>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closePool = async () => {
  await pool.end();
};

export default pool;