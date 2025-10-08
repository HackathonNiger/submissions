-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
        bucket_id = 'cause-images'
        AND auth.uid()::text = split_part(name, '-', 1)
    );
-- Create a policy to allow public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'cause-images');
-- Create a policy to allow users to update their own images
CREATE POLICY "Allow users to update their own images" ON storage.objects FOR
UPDATE TO authenticated USING (
        bucket_id = 'cause-images'
        AND auth.uid()::text = split_part(name, '-', 1)
    );
-- Create a policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'cause-images'
    AND auth.uid()::text = split_part(name, '-', 1)
);