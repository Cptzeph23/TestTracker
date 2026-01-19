import { Router } from 'express';
import { db } from '../db';
import { users, Role } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { authenticateToken, RequestWithUser } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all users
export const getUsers = async () => {
  return await db.select().from(users);
};

// Get current user
router.get('/me', authenticateToken, async (req: RequestWithUser, res) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't return password hash
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const allUsers = await getUsers();
    // Remove password hashes from response
    const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a new user (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { username, password, role = Role.EMPLOYEE, name, avatar } = req.body;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        role: role as Role,
        name,
        avatar,
      })
      .returning();
    
    // Don't return password hash
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;
