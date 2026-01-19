import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { users } from '../shared/schema';

dotenv.config();

async function testConnection() {
  try {
    console.log('Connecting to database...');
    
    // Create a new pool of connections
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create a Drizzle instance
    const db = drizzle(pool);

    // Test the connection by querying the users table
    console.log('Querying users table...');
    const result = await db.select().from(users).limit(1);
    
    console.log('✅ Database connection successful!');
    console.log('Users table sample row:', result[0] || 'No users found');
    
    // Close the connection pool
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
