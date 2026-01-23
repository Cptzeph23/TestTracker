import { Router } from 'express';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (process.env.DEMO_AUTH === 'true') {
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        username,
        role: 'admin',
        name: username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };
      const token = jwt.sign(
        { id: demoUser.id, username: demoUser.username, role: demoUser.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.json({ token, user: demoUser });
    }

    // Find user by username
    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userData } = user;
    res.json({ 
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
