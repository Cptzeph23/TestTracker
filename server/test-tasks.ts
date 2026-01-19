import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function checkTables() {
  try {
    console.log('Connecting to database...');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    // Check if tasks table exists
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'tasks';
    `);

    if (tablesResult.rows.length > 0) {
      console.log('✅ Tasks table exists!');
      
      // Show sample tasks if any
      const tasks = await pool.query('SELECT * FROM tasks LIMIT 5');
      console.log('Sample tasks:', tasks.rows);
    } else {
      console.log('❌ Tasks table does not exist. You need to create it.');
      console.log('\nTo create the tasks table, you need to:');
      console.log('1. Add the task schema to shared/schema.ts');
      console.log('2. Run database migrations using: npm run db:push');
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkTables();
