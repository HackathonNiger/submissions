-- Add bio column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add social media columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_bio ON profiles(bio) WHERE bio IS NOT NULL; 