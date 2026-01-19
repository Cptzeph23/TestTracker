// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, uuid, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const Role = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
} as const;

export type Role = typeof Role[keyof typeof Role];

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(Role.EMPLOYEE),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Task status enum
export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  policyNumber: varchar("policy_number", { length: 50 }),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default(TaskStatus.PENDING),
  dueDate: timestamp("due_date"),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertTaskSchema = createInsertSchema(tasks, {
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]]).default(TaskStatus.PENDING),
  dueDate: z.date().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true, // This should be set by the server
});

export const updateTaskSchema = insertTaskSchema.partial();

// Types
export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;