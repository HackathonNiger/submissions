-- Add crypto_wallets column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS crypto_wallets JSONB DEFAULT '{}'::jsonb;

-- Add RLS policy for crypto_wallets
CREATE POLICY "Users can update their own crypto_wallets"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add RLS policy for reading crypto_wallets
CREATE POLICY "Users can read their own crypto_wallets"
ON profiles
FOR SELECT
USING (auth.uid() = id); 