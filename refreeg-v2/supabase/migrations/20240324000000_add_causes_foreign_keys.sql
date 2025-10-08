-- Add foreign key relationships for causes table
ALTER TABLE causes
ADD CONSTRAINT fk_causes_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- Add index for better performance (only if it doesn't exist)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE indexname = 'idx_causes_user_id'
        AND tablename = 'causes'
) THEN CREATE INDEX idx_causes_user_id ON causes(user_id);
END IF;
END $$;