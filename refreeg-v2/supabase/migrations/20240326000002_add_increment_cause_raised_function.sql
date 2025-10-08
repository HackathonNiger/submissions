-- Create function to increment cause raised amount
CREATE OR REPLACE FUNCTION increment_cause_raised(cause_id UUID, amount DECIMAL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ 
BEGIN
  UPDATE causes
  SET raised = raised + amount
  WHERE id = cause_id;
END;
$$; 