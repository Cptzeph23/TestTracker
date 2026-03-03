
import { db } from '../server/db';
import { users, Role } from '../shared/schema';
import bcrypt from 'bcryptjs';

async function createUsers() {
  try {
    // Create admin user
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('adminpassword', adminSalt);
    await db.insert(users).values({
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
      name: 'Admin User',
    });

    // Create normal user
    const userSalt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('userpassword', userSalt);
    await db.insert(users).values({
      username: 'user',
      password: userPassword,
      role: Role.EMPLOYEE,
      name: 'Normal User',
    });

    // Create test user
    const testUserSalt = await bcrypt.genSalt(10);
    const testUserPassword = await bcrypt.hash('testpassword', testUserSalt);
    await db.insert(users).values({
      username: 'testuser',
      password: testUserPassword,
      role: Role.EMPLOYEE,
      name: 'Test User',
    });

    console.log('Successfully created admin and user');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    process.exit();
  }
}

// createUsers();

// Create an additional employee user if needed
async function createAdditionalUser() {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('user2password', salt);
    await db.insert(users).values({
      username: 'user2',
      password,
      role: Role.EMPLOYEE,
      name: 'User Two',
    });
    console.log('Successfully created user2 (employee)');
  } catch (error) {
    console.error('Error creating user2:', error);
  } finally {
    process.exit();
  }
}

// Only create the additional user
createAdditionalUser();
