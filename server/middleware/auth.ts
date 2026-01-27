// server/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

// Export the extended request type
export interface RequestWithUser extends Request {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  if (process.env.DEMO_AUTH === 'true') {
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      username: 'demo',
      role: 'admin',
    };
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    
    if (process.env.DEMO_AUTH === 'true') {
      req.user = {
        id: decoded.id,
        username: 'demo',
        role: 'admin',
      };
      return next();
    }

    // Fetch the user from the database
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Attach the user to the request object
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
