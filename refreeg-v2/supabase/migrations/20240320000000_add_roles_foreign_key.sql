-- Add foreign key constraint to roles table
ALTER TABLE roles
ADD CONSTRAINT fk_roles_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
-- Add index to improve performance (only if it doesn't exist)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE indexname = 'idx_roles_user_id'
        AND tablename = 'roles'
) THEN CREATE INDEX idx_roles_user_id ON roles(user_id);
END IF;
END $$;