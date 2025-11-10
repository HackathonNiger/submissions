// import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { PostgrestError, createClient } from '@supabase/supabase-js';

import { toast } from 'sonner';

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key must be defined in environment variables.'
  );
}

// Initialize Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Optimize for real-time messaging
      },
    },
  }
);

// Export PostgrestError for type annotations
export type { PostgrestError };

// Utility function to check authentication status
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
      toast.error('Failed to fetch user information.');
      return null;
    }
    return user;
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    toast.error('An unexpected error occurred.');
    return null;
  }
}

// Utility function to handle real-time subscription errors
// export function handleSubscriptionError(error: any) {
//   console.error('Real-time subscription error:', error);
//   toast.error('Real-time updates failed. Please refresh the page.');
// }
export function handleSubscriptionError(error: unknown) {
  console.error('Real-time subscription error:', error);

  const msg =
    (error as { response?: { message?: string } })?.response?.message ||
    (error as { message?: string })?.message ||
    'Real-time updates failed. Please refresh the page.';

  toast.error(msg);
}
