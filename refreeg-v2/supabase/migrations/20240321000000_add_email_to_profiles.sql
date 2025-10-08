-- Add email column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;
-- Add unique constraint to email column
ALTER TABLE profiles
ADD CONSTRAINT unique_email UNIQUE (email);
-- Add index to improve email lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);