import { Pool } from 'pg';

// Create a connection pool for better performance
let pool: Pool | null = null;

export function getDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
    });
  }
  
  return pool;
}

// Helper function to execute a query
export async function query(text: string, params?: unknown[]) {
  const db = getDatabase();
  const client = await db.connect();
  
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release(); // Return client to the pool
  }
}

// Helper function to execute a query and get first row
export async function queryRow(text: string, params?: unknown[]) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

// Helper function to execute a query and get all rows
export async function queryRows(text: string, params?: unknown[]) {
  const result = await query(text, params);
  return result.rows;
}

// Clean up function for when the app shuts down
export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}