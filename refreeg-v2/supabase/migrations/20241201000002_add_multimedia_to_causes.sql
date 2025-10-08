-- Add multimedia column to causes table for storing image URLs
ALTER TABLE causes
ADD COLUMN IF NOT EXISTS multimedia TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add index for better performance (optional)
-- CREATE INDEX IF NOT EXISTS idx_causes_multimedia ON causes USING GIN (multimedia);
