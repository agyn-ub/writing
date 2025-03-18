import { Pool } from 'pg';

// Create a singleton pool for database connections
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to get a client from the pool
export async function getClient() {
  return await pool.connect();
}

// Function to execute a query and release the client
export async function query(text: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
} 