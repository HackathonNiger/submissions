-- Add days_active column to causes table
ALTER TABLE causes
ADD COLUMN IF NOT EXISTS days_active INTEGER;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_causes_days_active ON causes(days_active); 