import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { tasks, insertTaskSchema } from '../shared/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

async function testTaskCRUD() {
  console.log('🚀 Starting task CRUD test...');
  
  try {
    // Create a new pool of connections
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create a Drizzle instance
    const db = drizzle(pool);

    // 1. Verify the tasks table structure
    console.log('\n🔍 Checking tasks table structure...');
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'tasks';
    `);
    
    console.log('✅ Tasks table structure:');
    console.table(tableInfo.rows);

    // 2. Create a test task
    console.log('\n➕ Creating a test task...');
    const testTask = {
      title: 'Test Task',
      description: 'This is a test task',
      priority: 1,
      userId: 'd007a62b-b8fc-43e2-b331-9221798b7d7f' // Using the admin user ID from earlier
    };

    // Validate the task data against our schema
    const validatedTask = insertTaskSchema.parse(testTask);
    
    // Insert the task
    const [newTask] = await db.insert(tasks)
      .values(validatedTask)
      .returning();
    
    console.log('✅ Created task:', newTask);

    // 3. Read the task
    console.log('\n📖 Reading the created task...');
    const [savedTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, newTask.id))
      .limit(1);
    
    console.log('✅ Retrieved task:', savedTask);

    // 4. Update the task
    console.log('\n✏️ Updating the task...');
    const [updatedTask] = await db
      .update(tasks)
      .set({ completed: true, priority: 2 })
      .where(eq(tasks.id, newTask.id))
      .returning();
    
    console.log('✅ Updated task:', updatedTask);

    // 5. List all tasks
    console.log('\n📋 Listing all tasks...');
    const allTasks = await db.select().from(tasks);
    console.log('✅ All tasks:', allTasks);

    // 6. Delete the test task (cleanup)
    console.log('\n🧹 Deleting the test task...');
    await db.delete(tasks).where(eq(tasks.id, newTask.id));
    console.log('✅ Test task deleted');

  } catch (error) {
    console.error('❌ Error during task CRUD test:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testTaskCRUD();
