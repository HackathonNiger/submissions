-- Add tx_signature column to crypto_donations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'crypto_donations' 
        AND column_name = 'tx_signature'
    ) THEN
        ALTER TABLE crypto_donations ADD COLUMN tx_signature TEXT;
    END IF;
END $$;

-- Add NOT NULL constraint if the column was just added
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'crypto_donations' 
        AND column_name = 'tx_signature'
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE crypto_donations ALTER COLUMN tx_signature SET NOT NULL;
    END IF;
END $$; 