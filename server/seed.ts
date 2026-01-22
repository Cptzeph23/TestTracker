import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await db.select().from(users).where(eq(users.username, adminUsername)).limit(1);
  if (existing.length === 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      name: adminName,
    });
    console.log('Seeded admin user:', adminUsername);
  } else {
    console.log('Admin user exists:', adminUsername);
  }

  await pool.end();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
