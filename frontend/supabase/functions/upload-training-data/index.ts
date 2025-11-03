import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        throw new Error('No file provided');
      }

      console.log('Processing file upload:', file.name);

      const content = await file.text();
      const lines = content.split('\n').filter(line => line.trim());

      // Parse and insert training data
      for (const line of lines) {
        // Assuming format: "English text | Hausa translation"
        const parts = line.split('|').map(p => p.trim());
        if (parts.length === 2) {
          await supabase.from('training_data').insert({
            source_text: parts[0],
            target_text: parts[1],
            language_pair: 'en-hausa',
            data_type: 'file',
            file_url: file.name,
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: `Processed ${lines.length} entries` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Handle text data
      const { text } = await req.json();
      
      if (!text) {
        throw new Error('No text provided');
      }

      console.log('Processing text data');

      const lines = text.split('\n').filter((line: string) => line.trim());

      for (const line of lines) {
        const parts = line.split('|').map((p: string) => p.trim());
        if (parts.length === 2) {
          await supabase.from('training_data').insert({
            source_text: parts[0],
            target_text: parts[1],
            language_pair: 'en-hausa',
            data_type: 'text',
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: `Processed ${lines.length} entries` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
