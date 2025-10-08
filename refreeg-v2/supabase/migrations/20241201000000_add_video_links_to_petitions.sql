
-- Add video_links column to petitions table for storing video URLs (YouTube, TikTok, etc.)
ALTER TABLE public.petitions 
ADD COLUMN IF NOT EXISTS video_links TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add video_links column to causes table if it doesn't exist (for consistency)
ALTER TABLE public.causes 
ADD COLUMN IF NOT EXISTS video_links TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_petitions_video_links ON public.petitions USING GIN (video_links);
CREATE INDEX IF NOT EXISTS idx_causes_video_links ON public.causes USING GIN (video_links);
