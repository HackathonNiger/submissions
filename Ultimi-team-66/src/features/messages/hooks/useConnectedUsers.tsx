import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import  {ConnectedUser}  from '@/lib/types';

export function useConnectedUsers(currentUserId: string | null, isOnline: boolean) {
  const { data: connectedUsers = [], isLoading: isLoadingUsers } = useQuery<
    ConnectedUser[],
    Error
  >({
    queryKey: ['connectedUsers', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data: messageUsers, error: messageError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
      if (messageError) {
        console.error('Error fetching message users:', messageError);
        throw new Error('Failed to load chat users.');
      }
      const userIds = Array.from(
        new Set(
          messageUsers?.flatMap((msg) => [
            msg.sender_id !== currentUserId ? msg.sender_id : null,
            msg.receiver_id !== currentUserId ? msg.receiver_id : null,
          ]).filter((id): id is string => id !== null)
        )
      );
      if (!userIds.length) return [];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, user_type')
        .in('id', userIds);
      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw new Error('Failed to load user profiles.');
      }
      const usersWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: unread, error: unreadError } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', currentUserId)
            .eq('sender_id', profile.id)
            .eq('is_read', false);
          if (unreadError) {
            console.error('Error fetching unread messages:', unreadError);
          }
          const { data: lastMsg, error: lastMsgError } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(
              `and(sender_id.eq.${currentUserId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUserId})`
            )
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (lastMsgError && lastMsgError.code !== 'PGRST116') {
            console.error('Error fetching last message:', lastMsgError);
          }
          return {
            id: profile.id,
            username: profile.username || 'Unknown',
            avatar_url: profile.avatar_url || '',
            user_type: profile.user_type || 'student',
            unreadCount: unread?.length || 0,
            lastMessage: lastMsg?.content?.slice(0, 50) || '',
            lastMessageTime: lastMsg?.created_at || '',
          };
        })
      );
      return usersWithDetails.sort(
        (a, b) =>
          new Date(b.lastMessageTime || '0').getTime() -
          new Date(a.lastMessageTime || '0').getTime()
      );
    },
    enabled: !!currentUserId && isOnline,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  return { connectedUsers, isLoadingUsers };
}