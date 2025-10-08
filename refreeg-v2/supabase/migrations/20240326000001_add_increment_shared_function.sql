-- Create function to increment shared count
CREATE OR REPLACE FUNCTION increment_cause_shared(cause_id UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN
UPDATE causes
SET shared = shared + 1
WHERE id = cause_id;
END;
$$;