
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  console.log('Using connection string:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected!');
    
    console.log('Adding amount column...');
    await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS amount integer');
    console.log('Column added successfully!');
    
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
