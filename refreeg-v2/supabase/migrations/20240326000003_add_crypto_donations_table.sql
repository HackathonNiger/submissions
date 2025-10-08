-- Create crypto_donations table
CREATE TABLE IF NOT EXISTS crypto_donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cause_id UUID REFERENCES causes(id) ON DELETE CASCADE,
  tx_signature TEXT NOT NULL,
  amount_in_sol DECIMAL(20, 6),
  amount_in_naira DECIMAL(20, 2),
  wallet_address TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  network TEXT NOT NULL,
  currency TEXT NOT NULL,
  wallet_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crypto_donations_cause_id ON crypto_donations(cause_id);
CREATE INDEX IF NOT EXISTS idx_crypto_donations_user_id ON crypto_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_donations_tx_signature ON crypto_donations(tx_signature);
CREATE INDEX IF NOT EXISTS idx_crypto_donations_created_at ON crypto_donations(created_at);

-- Enable RLS
ALTER TABLE crypto_donations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own crypto donations" ON crypto_donations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crypto donations" ON crypto_donations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all crypto donations" ON crypto_donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.role = 'admin'
    )
  ); 