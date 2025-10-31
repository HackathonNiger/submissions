-- Create table for storing training data
CREATE TABLE public.training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  target_text TEXT NOT NULL,
  language_pair TEXT NOT NULL DEFAULT 'en-hausa',
  data_type TEXT NOT NULL DEFAULT 'text',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for translation history
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  input_language TEXT NOT NULL DEFAULT 'english',
  output_language TEXT NOT NULL DEFAULT 'hausa',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for API usage)
CREATE POLICY "Enable read access for all users" 
ON public.training_data 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.training_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.translations 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_training_data_updated_at
BEFORE UPDATE ON public.training_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_training_data_language ON public.training_data(language_pair);
CREATE INDEX idx_translations_created ON public.translations(created_at DESC);
