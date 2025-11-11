// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabaseClient';
// import { Message, ConnectedUser } from '@/lib/types';
// import { toast } from 'sonner';

// export function useSendMessage(
//   currentUserId: string | null,
//   chatUserId: string | null,
//   isOnline: boolean,
//   setChatMessage: (value: string) => void,
//   setReplyToMessage: (message: Message | null) => void
// ) {
//   const queryClient = useQueryClient();

//   const sendMessageMutation = useMutation<
//     Message,
//     Error,
//     { content: string; parentMessageId: string | null },
//     { previousMessages?: Message[] }
//   >({
//     mutationFn: async ({ content, parentMessageId }) => {
//       if (!currentUserId || !chatUserId) {
//         throw new Error('User not authenticated or no chat selected.');
//       }
//       if (!isOnline) {
//         throw new Error('No internet connection.');
//       }
//       const { data: insertedMessage, error } = await supabase
//         .from('messages')
//         .insert({
//           sender_id: currentUserId,
//           receiver_id: chatUserId,
//           content,
//           parent_message_id: parentMessageId,
//         })
//         .select(
//           `
//           id, sender_id, receiver_id, content, parent_message_id, created_at, is_read,
//           sender:profiles!messages_sender_id_fkey(id, username, avatar_url, user_type)
//         `
//         )
//         .maybeSingle();
//       if (error || !insertedMessage) {
//         console.error('Error sending message:', error);
//         throw new Error('Failed to send message.');
//       }
//       return {
//         ...insertedMessage,
//         sender: insertedMessage.sender?.[0]
//           ? {
//               id: insertedMessage.sender[0].id,
//               username: insertedMessage.sender[0].username,
//               avatar_url: insertedMessage.sender[0].avatar_url,
//               user_type: insertedMessage.sender[0].user_type,
//             }
//           : undefined,
//       } as Message;
//     },
//     onMutate: async ({ content, parentMessageId }) => {
//       await queryClient.cancelQueries({ queryKey: ['messages', currentUserId, chatUserId] });
//       const previousMessages = queryClient.getQueryData(['messages', currentUserId, chatUserId]) as
//         | Message[]
//         | undefined;
//       const tempMessage: Message = {
//         id: `temp-${Date.now()}`,
//         sender_id: currentUserId!,
//         receiver_id: chatUserId!,
//         content,
//         parent_message_id: parentMessageId,
//         created_at: new Date().toISOString(),
//         is_read: false,
//         type: 'text',
//         sender: { id: currentUserId!, username: 'You', avatar_url: '', user_type: 'student' },
//       };
//       queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => [
//         ...(old || []),
//         tempMessage,
//       ]);
//       return { previousMessages };
//     },
//     onError: (err, _vars, context) => {
//       console.error('Error in sendMessage mutation:', err);
//       toast.error(err.message || 'Failed to send message.');
//       queryClient.setQueryData(['messages', currentUserId, chatUserId], context?.previousMessages);
//     },
//     onSuccess: (insertedMessage) => {
//       queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) =>
//         old?.map((m) => (m.id === insertedMessage.id || m.id.startsWith('temp-') ? insertedMessage : m)) || [
//           insertedMessage,
//         ]
//       );
//       queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
//         if (!old) return old;
//         const existing = old.find((u) => u.id === chatUserId);
//         if (!existing) {
//           const fetchReceiverProfile = async () => {
//             const { data: receiverProfile, error } = await supabase
//               .from('profiles')
//               .select('id, username, avatar_url, user_type')
//               .eq('id', chatUserId)
//               .maybeSingle();
//             if (error) {
//               console.error('Error fetching receiver profile:', error);
//               toast.error('Failed to load receiver profile.');
//               return old;
//             }
//             if (receiverProfile) {
//               const newUser: ConnectedUser = {
//                 id: chatUserId!,
//                 username: receiverProfile.username || 'Unknown',
//                 avatar_url: receiverProfile.avatar_url || '',
//                 user_type: receiverProfile.user_type || 'student',
//                 unreadCount: 0,
//                 lastMessage: insertedMessage.content.slice(0, 50),
//                 lastMessageTime: insertedMessage.created_at,
//               };
//               return [...old, newUser].sort(
//                 (a, b) =>
//                   new Date(b.lastMessageTime || '0').getTime() -
//                   new Date(a.lastMessageTime || '0').getTime()
//               );
//             }
//             return old;
//           };
//           fetchReceiverProfile().then((updated) => {
//             if (updated) queryClient.setQueryData(['connectedUsers', currentUserId], updated);
//           });
//           return old;
//         }
//         return old
//           .map((u) =>
//             u.id === chatUserId
//               ? {
//                   ...u,
//                   lastMessage: insertedMessage.content.slice(0, 50),
//                   lastMessageTime: insertedMessage.created_at,
//                   unreadCount: 0,
//                 }
//               : u
//           )
//           .sort(
//             (a, b) =>
//               new Date(b.lastMessageTime || '0').getTime() -
//               new Date(a.lastMessageTime || '0').getTime()
//           );
//       });
//       const sendNotification = async () => {
//         try {
//           const { data: receiver, error: receiverError } = await supabase
//             .from('profiles')
//             .select('username')
//             .eq('id', chatUserId)
//             .maybeSingle();
//           if (receiverError) {
//             console.error('Error fetching receiver profile:', receiverError);
//             return;
//           }
//           if (receiver) {
//             const { error: notificationError } = await supabase
//               .from('notifications')
//               .insert({
//                 user_id: chatUserId,
//                 type: 'message',
//                 from_user_id: currentUserId,
//                 message: `New message from ${receiver.username || 'User'}`,
//                 status: 'pending',
//               });
//             if (notificationError) {
//               console.error('Error sending notification:', notificationError);
//             }
//           }
//         } catch (error) {
//           console.error('Error sending notification:', error);
//         }
//       };
//       sendNotification();
//       toast.success('Message sent!');
//       setReplyToMessage(null);
//       setChatMessage('');
//     },
//   });

//   return sendMessageMutation;
// }


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Message, ConnectedUser } from '@/lib/types';
import { toast } from 'sonner';

export function useSendMessage(
  currentUserId: string | null,
  chatUserId: string | null,
  isOnline: boolean,
  setChatMessage: (value: string) => void,
  setReplyToMessage: (message: Message | null) => void
) {
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation<
    Message,
    Error,
    { content: string; parentMessageId: string | null; type: string },
    { previousMessages?: Message[] }
  >({
    mutationFn: async ({ content, parentMessageId, type }) => {
      if (!currentUserId || !chatUserId) {
        throw new Error('User not authenticated or no chat selected.');
      }
      if (!isOnline) {
        throw new Error('No internet connection.');
      }
      const { data: insertedMessage, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: chatUserId,
          content,
          parent_message_id: parentMessageId,
          type,
        })
        .select(
          `
          id, sender_id, receiver_id, content, parent_message_id, created_at, is_read, type,
          sender:profiles!messages_sender_id_fkey(id, username, avatar_url, user_type)
        `
        )
        .maybeSingle();
      if (error || !insertedMessage) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message.');
      }
      return {
        ...insertedMessage,
        sender: insertedMessage.sender?.[0]
          ? {
              id: insertedMessage.sender[0].id,
              username: insertedMessage.sender[0].username,
              avatar_url: insertedMessage.sender[0].avatar_url,
              user_type: insertedMessage.sender[0].user_type,
            }
          : undefined,
      } as Message;
    },
    onMutate: async ({ content, parentMessageId, type }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', currentUserId, chatUserId] });
      const previousMessages = queryClient.getQueryData(['messages', currentUserId, chatUserId]) as
        | Message[]
        | undefined;
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender_id: currentUserId!,
        receiver_id: chatUserId!,
        content,
        parent_message_id: parentMessageId,
        created_at: new Date().toISOString(),
        is_read: false,
        type,
        avatar_url: null,
        is_deleted: false,
        sender: { id: currentUserId!, username: 'You', avatar_url: '', user_type: 'student' },
      };
      queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => [
        ...(old || []),
        tempMessage,
      ]);
      return { previousMessages };
    },
    onError: (err, _vars, context) => {
      console.error('Error in sendMessage mutation:', err);
      toast.error(err.message || 'Failed to send message.');
      queryClient.setQueryData(['messages', currentUserId, chatUserId], context?.previousMessages);
    },
    onSuccess: (insertedMessage) => {
      queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) =>
        old?.map((m) => (m.id === insertedMessage.id || m.id.startsWith('temp-') ? insertedMessage : m)) || [
          insertedMessage,
        ]
      );
      queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
        if (!old) return old;
        const existing = old.find((u) => u.id === chatUserId);
        if (!existing) {
          const fetchReceiverProfile = async () => {
            const { data: receiverProfile, error } = await supabase
              .from('profiles')
              .select('id, username, avatar_url, user_type')
              .eq('id', chatUserId)
              .maybeSingle();
            if (error) {
              console.error('Error fetching receiver profile:', error);
              toast.error('Failed to load receiver profile.');
              return old;
            }
            if (receiverProfile) {
              const newUser: ConnectedUser = {
                id: chatUserId!,
                username: receiverProfile.username || 'Unknown',
                avatar_url: receiverProfile.avatar_url || '',
                user_type: receiverProfile.user_type || 'student',
                unreadCount: 0,
                lastMessage: insertedMessage.type === 'audio' ? 'Audio message' : insertedMessage.content.slice(0, 50),
                lastMessageTime: insertedMessage.created_at,
              };
              return [...old, newUser].sort(
                (a, b) =>
                  new Date(b.lastMessageTime || '0').getTime() -
                  new Date(a.lastMessageTime || '0').getTime()
              );
            }
            return old;
          };
          fetchReceiverProfile().then((updated) => {
            if (updated) queryClient.setQueryData(['connectedUsers', currentUserId], updated);
          });
          return old;
        }
        return old
          .map((u) =>
            u.id === chatUserId
              ? {
                  ...u,
                  lastMessage: insertedMessage.type === 'audio' ? 'Audio message' : insertedMessage.content.slice(0, 50),
                  lastMessageTime: insertedMessage.created_at,
                  unreadCount: 0,
                }
              : u
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageTime || '0').getTime() -
              new Date(a.lastMessageTime || '0').getTime()
          );
      });
      const sendNotification = async () => {
        try {
          const { data: receiver, error: receiverError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', chatUserId)
            .maybeSingle();
          if (receiverError) {
            console.error('Error fetching receiver profile:', receiverError);
            return;
          }
          if (receiver) {
            const { error: notificationError } = await supabase
              .from('notifications')
              .insert({
                user_id: chatUserId,
                type: 'message',
                from_user_id: currentUserId,
                message: `New ${insertedMessage.type === 'audio' ? 'audio' : 'text'} message from ${receiver.username || 'User'}`,
                status: 'pending',
              });
            if (notificationError) {
              console.error('Error sending notification:', notificationError);
            }
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      };
      sendNotification();
      toast.success(`${insertedMessage.type === 'audio' ? 'Audio' : 'Message'} sent!`);
      setReplyToMessage(null);
      if (insertedMessage.type !== 'audio') {
        setChatMessage('');
      }
    },
  });

  return sendMessageMutation;
}