-- Function to update days_active for approved causes
CREATE OR REPLACE FUNCTION update_days_active_for_approved_causes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cause_record RECORD;
    days_elapsed INTEGER;
    new_days_active INTEGER;
BEGIN
    -- Loop through all approved causes
    FOR cause_record IN 
        SELECT 
            id, 
            days_active, 
            updated_at,
            EXTRACT(EPOCH FROM (NOW() - updated_at)) / 86400 as days_elapsed
        FROM causes 
        WHERE status = 'approved' 
        AND days_active > 0
    LOOP
        -- Calculate days elapsed since approval (updated_at)
        days_elapsed := FLOOR(cause_record.days_elapsed);
        
        -- Calculate new days_active
        new_days_active := GREATEST(0, cause_record.days_active - days_elapsed);
        
        -- Update the cause with new days_active
        UPDATE causes 
        SET 
            days_active = new_days_active,
            updated_at = NOW()
        WHERE id = cause_record.id;
        
        -- If days_active reaches 0, change status to 'expired'
        IF new_days_active = 0 THEN
            UPDATE causes 
            SET status = 'expired'
            WHERE id = cause_record.id;
        END IF;
        
    END LOOP;
END;
$$;

-- Create a cron job to run every day at midnight
SELECT cron.schedule(
    'update-days-active-daily',
    '0 0 * * *', -- Every day at 00:00
    'SELECT update_days_active_for_approved_causes();'
);

-- Add index for better performance on the cron job query
CREATE INDEX IF NOT EXISTS idx_causes_status_days_active_updated_at 
ON causes(status, days_active, updated_at) 
WHERE status = 'approved' AND days_active > 0;
