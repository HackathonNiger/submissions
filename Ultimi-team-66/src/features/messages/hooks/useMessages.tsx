import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Message, RawMessage } from '@/lib/types';
import { toast } from 'sonner';

export function useMessages(currentUserId: string | null, chatUserId: string | null, isOnline: boolean) {
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<Message[], Error>({
    queryKey: ['messages', currentUserId, chatUserId],
    queryFn: async () => {
      if (!currentUserId || !chatUserId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select(
          `
          id, sender_id, receiver_id, content, parent_message_id, created_at, is_read,
          sender:profiles!messages_sender_id_fkey(id, username, avatar_url, user_type)
        `
        )
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${chatUserId}),and(sender_id.eq.${chatUserId},receiver_id.eq.${currentUserId})`
        )
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to load messages.');
      }
      const transformedData = data?.map((msg: RawMessage) => ({
        ...msg,
        sender: msg.sender?.[0]
          ? {
              id: msg.sender[0].id,
              username: msg.sender[0].username,
              avatar_url: msg.sender[0].avatar_url,
              user_type: msg.sender[0].user_type,
            }
          : undefined,
      })) as Message[];
      if (isOnline && transformedData?.length) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('receiver_id', currentUserId)
          .eq('sender_id', chatUserId)
          .eq('is_read', false);
        if (updateError) {
          console.error('Error marking messages as read:', updateError);
          toast.error('Failed to mark messages as read.');
        } else {
          queryClient.invalidateQueries({ queryKey: ['connectedUsers', currentUserId] });
        }
      }
      return transformedData || [];
    },
    enabled: !!currentUserId && !!chatUserId && isOnline,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  return messages;
}