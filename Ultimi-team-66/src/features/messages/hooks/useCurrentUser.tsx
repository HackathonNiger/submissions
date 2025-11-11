import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentUser, supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<string >('');
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [chatUsername, setChatUsername] = useState<string | null>(null);
  const [chatUserAvatar, setChatUserAvatar] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user?.id ?? '');
        const userId = searchParams.get('userId');
        if (userId) {
          setChatUserId(userId);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, avatar_url, user_type')
            .eq('id', userId)
            .maybeSingle();
          if (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load user profile.');
            return;
          }
          setChatUsername(profile?.username || 'User');
          setChatUserAvatar(profile?.avatar_url || undefined);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast.error('Failed to load current user.');
      }
    };
    fetchCurrentUser();
  }, [searchParams]);

  return { currentUserId, setCurrentUserId, chatUserId, setChatUserId, chatUsername, setChatUsername, chatUserAvatar, setChatUserAvatar };
}