-- Add is_blocked column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
-- Add index to improve is_blocked lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON profiles(is_blocked);