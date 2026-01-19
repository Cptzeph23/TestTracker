import { Router } from 'express';
import { db } from '../db';
import { tasks, TaskStatus, InsertTask, UpdateTask } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all tasks (with optional filtering)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    
    let query = db.select().from(tasks);
    
    // Apply filters if provided
    if (status) {
      query = query.where(eq(tasks.status, status as string));
    }
    
    if (assignedTo) {
      query = query.where(eq(tasks.assignedTo, assignedTo as string));
    }
    
    const allTasks = await query;
    res.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const taskData: InsertTask = {
      ...req.body,
      createdBy: req.user.id, // Set the creator to the authenticated user
    };
    
    const [newTask] = await db.insert(tasks).values(taskData).returning();
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: UpdateTask = req.body;
    
    // Only the creator can update the task
    const [task] = await db
      .update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(tasks.id, id),
          eq(tasks.createdBy, req.user.id)
        )
      )
      .returning();
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only the creator can delete the task
    const [deletedTask] = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, id),
          eq(tasks.createdBy, req.user.id)
        )
      )
      .returning();
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
