import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, handleSubscriptionError } from '@/lib/supabaseClient';
import { Message, ConnectedUser } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useRealtimeMessages(
  currentUserId: string | null,
  chatUserId: string | null,
  isOnline: boolean,
  setChatUserId: (id: string | null) => void,
  setChatUsername: (username: string | null) => void,
  setChatUserAvatar: (avatar: string | undefined) => void
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleIncomingMessage = useCallback(
    async (message: Message) => {
      if (!currentUserId || !isOnline) return;
      const isReceived = message.sender_id !== currentUserId;
      const otherUserId = isReceived ? message.sender_id : message.receiver_id;

      let enrichedMessage = { ...message };
      if (!message.sender) {
        const { data: senderProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, user_type')
          .eq('id', message.sender_id)
          .maybeSingle();
        if (profileError) {
          console.error('Error fetching sender profile:', profileError);
          toast.error('Failed to load sender profile.');
          return;
        }
        enrichedMessage = {
          ...message,
          sender: senderProfile
            ? {
                id: senderProfile.id,
                username: senderProfile.username || 'Unknown',
                avatar_url: senderProfile.avatar_url || '',
                user_type: senderProfile.user_type || 'student',
              }
            : undefined,
        };
      }

      if (otherUserId === chatUserId) {
        queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => {
          if (!old || old.some((msg) => msg.id === message.id)) return old;
          return [...old, enrichedMessage];
        });
        if (isReceived) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', message.id);
          if (updateError) {
            console.error('Error marking message as read:', updateError);
            toast.error('Failed to mark message as read.');
          }
        }
      }

      queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
        if (!old) return old;
        const existingUserIndex = old.findIndex((u) => u.id === otherUserId);
        let updatedUsers = [...old];
        if (existingUserIndex !== -1) {
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            lastMessage: message.content.slice(0, 50),
            lastMessageTime: message.created_at,
            unreadCount:
              isReceived && otherUserId !== chatUserId
                ? updatedUsers[existingUserIndex].unreadCount + 1
                : updatedUsers[existingUserIndex].unreadCount,
          };
        } else {
          const fetchNewUserProfile = async () => {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id, username, avatar_url, user_type')
              .eq('id', otherUserId)
              .maybeSingle();
            if (error) {
              console.error('Error fetching new user profile:', error);
              toast.error('Failed to load user profile.');
              return;
            }
            if (profile) {
              const newUser: ConnectedUser = {
                id: otherUserId,
                username: profile.username || 'Unknown',
                avatar_url: profile.avatar_url || '',
                user_type: profile.user_type || 'student',
                unreadCount: isReceived ? 1 : 0,
                lastMessage: message.content.slice(0, 50),
                lastMessageTime: message.created_at,
              };
              updatedUsers = [...updatedUsers, newUser].sort(
                (a, b) =>
                  new Date(b.lastMessageTime || '0').getTime() -
                  new Date(a.lastMessageTime || '0').getTime()
              );
              queryClient.setQueryData(['connectedUsers', currentUserId], updatedUsers);
              if (!chatUserId && isReceived) {
                setChatUserId(otherUserId);
                setChatUsername(profile.username || 'Unknown');
                setChatUserAvatar(profile.avatar_url);
                router.push(`/messages?userId=${otherUserId}`);
              }
            }
          };
          fetchNewUserProfile();
        }
        return updatedUsers.sort(
          (a, b) =>
            new Date(b.lastMessageTime || '0').getTime() -
            new Date(a.lastMessageTime || '0').getTime()
        );
      });
    },
    [currentUserId, isOnline, queryClient, chatUserId, router, setChatUserId, setChatUsername, setChatUserAvatar]
  );

  useEffect(() => {
    if (!currentUserId || !isOnline) return;
    const sentChannel = supabase
      .channel(`messages:sent:${currentUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${currentUserId}` },
        async (payload) => await handleIncomingMessage(payload.new as Message)
      )
      .subscribe((status, error) => {
        if (error) {
          handleSubscriptionError(error);
          toast.error('Failed to subscribe to sent messages.');
        }
      });
    const receivedChannel = supabase
      .channel(`messages:received:${currentUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUserId}` },
        async (payload) => await handleIncomingMessage(payload.new as Message)
      )
      .subscribe((status, error) => {
        if (error) {
          handleSubscriptionError(error);
          toast.error('Failed to subscribe to received messages.');
        }
      });
    return () => {
      supabase.removeChannel(sentChannel);
      supabase.removeChannel(receivedChannel);
    };
  }, [currentUserId, isOnline, handleIncomingMessage]);
}