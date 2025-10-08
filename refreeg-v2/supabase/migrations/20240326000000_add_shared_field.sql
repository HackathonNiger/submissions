-- Add shared field to causes table
ALTER TABLE causes
ADD COLUMN IF NOT EXISTS shared INTEGER DEFAULT 0;