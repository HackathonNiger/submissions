-- Add video_links column to causes table for storing video URLs (YouTube, TikTok, etc.)
ALTER TABLE causes
ADD COLUMN IF NOT EXISTS video_links TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Optionally, add an index for searching video links (if needed)
-- CREATE INDEX IF NOT EXISTS idx_causes_video_links ON causes USING GIN (video_links);
