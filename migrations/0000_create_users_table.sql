-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an admin user (you'll want to change this password in production)
-- Default password: admin123 (hashed with bcrypt)
INSERT INTO users (username, password, email)
VALUES (
  'admin',
  '$2b$10$DYAd5YdqSp7zWNzCySGr3.nmmIG9MFOTKm0QyBfBrOWnr4BffoRCe',
  'admin@example.com'
)
ON CONFLICT (username) DO NOTHING;

-- Create the update_updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
