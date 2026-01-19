-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  priority INTEGER NOT NULL DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE
);

-- Add index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Add index on completed for filtering tasks by completion status
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Add index on priority for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Add index on due_date for filtering tasks by due date
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Add trigger to update updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
