-- Create cause_shares table
CREATE TABLE IF NOT EXISTS cause_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cause_id UUID NOT NULL REFERENCES causes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        platform VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_cause_shares_cause_id FOREIGN KEY (cause_id) REFERENCES causes(id) ON DELETE CASCADE
);
-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_cause_shares_cause_id ON cause_shares(cause_id);
CREATE INDEX IF NOT EXISTS idx_cause_shares_user_id ON cause_shares(user_id);