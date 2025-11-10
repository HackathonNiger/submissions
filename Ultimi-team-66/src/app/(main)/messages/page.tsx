// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Check, CheckCheck, ChevronDown, Menu, Reply, Send, X } from 'lucide-react';
// import { getCurrentUser, handleSubscriptionError, supabase } from '@/lib/supabaseClient';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useRouter, useSearchParams } from 'next/navigation';

// import { Badge } from '@/components/ui/badge';
// import Box from '@/components/ui/box';
// import { Button } from '@/components/ui/button';
// import { RawMessage } from '@/lib/types';
// import { Skeleton } from '@/components/ui/skeleton';
// import Textarea from '@/components/ui/textarea';
// import { formatDistanceToNow } from 'date-fns';
// import { toast } from 'sonner';

// // Define interfaces
// interface Profile {
//   id: string;
//   username: string;
//   avatar_url?: string;
//   user_type: 'student' | 'sponsor';
// }

// interface Message {
//   id: string;
//   sender_id: string;
//   receiver_id: string;
//   content: string;
//   parent_message_id: string | null;
//   created_at: string;
//   is_read: boolean;
//   sender?: Profile;
// }

// interface ConnectedUser {
//   id: string;
//   username: string;
//   avatar_url?: string;
//   user_type: 'student' | 'sponsor';
//   unreadCount: number;
//   lastMessage?: string;
//   lastMessageTime?: string;
// }

// export default function Messages() {
//   // State
//   const [chatUserId, setChatUserId] = useState<string | null>(null);
//   const [chatUsername, setChatUsername] = useState<string | null>(null);
//   const [chatUserAvatar, setChatUserAvatar] = useState<string | undefined>(undefined); // New state for avatar
//   const [chatMessage, setChatMessage] = useState('');
//   const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [showScrollDown, setShowScrollDown] = useState(false);
//   const [isOnline, setIsOnline] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to false for mobile

//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messageContainerRef = useRef<HTMLDivElement>(null);
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   // Hooks
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // Sync online/offline state
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);
//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);
//     setIsOnline(navigator.onLine);
//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         isSidebarOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target as Node) &&
//         window.innerWidth < 768 // Only on mobile (md breakpoint)
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isSidebarOpen]);

//   // Fetch current user and select chat
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user = await getCurrentUser();
//         setCurrentUserId(user?.id || null);
//         const userId = searchParams.get('userId');
//         if (userId) {
//           setChatUserId(userId);
//           const { data: profile, error } = await supabase
//             .from('profiles')
//             .select('username, avatar_url, user_type')
//             .eq('id', userId)
//             .maybeSingle();
//           if (error) {
//             console.error('Error fetching profile:', error);
//             toast.error('Failed to load user profile.');
//             return;
//           }
//           setChatUsername(profile?.username || 'User');
//           setChatUserAvatar(profile?.avatar_url || undefined); // Set avatar URL
//         }
//       } catch (error) {
//         console.error('Error fetching current user:', error);
//         toast.error('Failed to load current user.');
//       }
//     };
//     fetchCurrentUser();
//   }, [searchParams]);

//   // Fetch connected users
//   const { data: connectedUsers = [], isLoading: isLoadingUsers } = useQuery<
//     ConnectedUser[],
//     Error
//   >({
//     queryKey: ['connectedUsers', currentUserId],
//     queryFn: async () => {
//       if (!currentUserId) return [];
//       const { data: messageUsers, error: messageError } = await supabase
//         .from('messages')
//         .select('sender_id, receiver_id')
//         .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
//       if (messageError) {
//         console.error('Error fetching message users:', messageError);
//         throw new Error('Failed to load chat users.');
//       }
//       const userIds = Array.from(
//         new Set(
//           messageUsers?.flatMap((msg) => [
//             msg.sender_id !== currentUserId ? msg.sender_id : null,
//             msg.receiver_id !== currentUserId ? msg.receiver_id : null,
//           ]).filter((id): id is string => id !== null)
//         )
//       );
//       if (!userIds.length) return [];
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username, avatar_url, user_type')
//         .in('id', userIds);
//       if (profileError) {
//         console.error('Error fetching profiles:', profileError);
//         throw new Error('Failed to load user profiles.');
//       }
//       const usersWithDetails = await Promise.all(
//         (profiles || []).map(async (profile) => {
//           const { data: unread, error: unreadError } = await supabase
//             .from('messages')
//             .select('id')
//             .eq('receiver_id', currentUserId)
//             .eq('sender_id', profile.id)
//             .eq('is_read', false);
//           if (unreadError) {
//             console.error('Error fetching unread messages:', unreadError);
//           }
//           const { data: lastMsg, error: lastMsgError } = await supabase
//             .from('messages')
//             .select('content, created_at')
//             .or(
//               `and(sender_id.eq.${currentUserId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUserId})`
//             )
//             .order('created_at', { ascending: false })
//             .limit(1)
//             .maybeSingle();
//           if (lastMsgError && lastMsgError.code !== 'PGRST116') {
//             console.error('Error fetching last message:', lastMsgError);
//           }
//           return {
//             id: profile.id,
//             username: profile.username || 'Unknown',
//             avatar_url: profile.avatar_url || '',
//             user_type: profile.user_type || 'student',
//             unreadCount: unread?.length || 0,
//             lastMessage: lastMsg?.content?.slice(0, 50) || '',
//             lastMessageTime: lastMsg?.created_at || '',
//           };
//         })
//       );
//       return usersWithDetails.sort(
//         (a, b) =>
//           new Date(b.lastMessageTime || '0').getTime() -
//           new Date(a.lastMessageTime || '0').getTime()
//       );
//     },
//     enabled: !!currentUserId && isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   // Auto-select most recent user
//   useEffect(() => {
//     if (!chatUserId && connectedUsers.length > 0 && isOnline) {
//       const mostRecentUser = connectedUsers[0];
//       setChatUserId(mostRecentUser.id);
//       setChatUsername(mostRecentUser.username);
//       setChatUserAvatar(mostRecentUser.avatar_url); // Set avatar URL
//       router.push(`/messages?userId=${mostRecentUser.id}`);
//     }
//   }, [connectedUsers, chatUserId, router, isOnline]);

//   // Fetch messages
//   const { data: messages = [] } = useQuery<
//     Message[],
//     Error
//   >({
//     queryKey: ['messages', currentUserId, chatUserId],
//     queryFn: async () => {
//       if (!currentUserId || !chatUserId) return [];
//       const { data, error } = await supabase
//         .from('messages')
//         .select(
//           `
//           id, sender_id, receiver_id, content, parent_message_id, created_at, is_read,
//           sender:profiles!messages_sender_id_fkey(id, username, avatar_url, user_type)
//         `
//         )
//         .or(
//           `and(sender_id.eq.${currentUserId},receiver_id.eq.${chatUserId}),and(sender_id.eq.${chatUserId},receiver_id.eq.${currentUserId})`
//         )
//         .order('created_at', { ascending: true });
//       if (error) {
//         console.error('Error fetching messages:', error);
//         throw new Error('Failed to load messages.');
//       }

      
//       // Transform sender from array to single Profile or undefined
//       const transformedData = data?.map((msg: RawMessage) => ({
//         ...msg,
//         sender: msg.sender?.[0]
//           ? {
//               id: msg.sender[0].id,
//               username: msg.sender[0].username,
//               avatar_url: msg.sender[0].avatar_url,
//               user_type: msg.sender[0].user_type,
//             }
//           : undefined,
//       })) as Message[];
//       if (isOnline && transformedData?.length) {
//         const { error: updateError } = await supabase
//           .from('messages')
//           .update({ is_read: true })
//           .eq('receiver_id', currentUserId)
//           .eq('sender_id', chatUserId)
//           .eq('is_read', false);
//         if (updateError) {
//           console.error('Error marking messages as read:', updateError);
//           toast.error('Failed to mark messages as read.');
//         } else {
//           queryClient.invalidateQueries({ queryKey: ['connectedUsers', currentUserId] });
//         }
//       }
//       return transformedData || [];
//     },
//     enabled: !!currentUserId && !!chatUserId && isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   // Handle incoming messages
//   // const handleIncomingMessage = async (message: Message) => {
//   //   if (!currentUserId || !isOnline) return;
//   //   const isReceived = message.sender_id !== currentUserId;
//   //   const otherUserId = isReceived ? message.sender_id : message.receiver_id;

//   //   // Fetch sender profile if not included
//   //   let enrichedMessage = { ...message };
//   //   if (!message.sender) {
//   //     const { data: senderProfile, error: profileError } = await supabase
//   //       .from('profiles')
//   //       .select('id, username, avatar_url, user_type')
//   //       .eq('id', message.sender_id)
//   //       .maybeSingle();
//   //     if (profileError) {
//   //       console.error('Error fetching sender profile:', profileError);
//   //       toast.error('Failed to load sender profile.');
//   //       return;
//   //     }
//   //     enrichedMessage = {
//   //       ...message,
//   //       sender: senderProfile
//   //         ? {
//   //             id: senderProfile.id,
//   //             username: senderProfile.username || 'Unknown',
//   //             avatar_url: senderProfile.avatar_url || '',
//   //             user_type: senderProfile.user_type || 'student',
//   //           }
//   //         : undefined,
//   //     };
//   //   }

//   //   // Update messages for current chat
//   //   if (otherUserId === chatUserId) {
//   //     queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => {
//   //       if (!old || old.some((msg) => msg.id === message.id)) return old;
//   //       return [...old, enrichedMessage];
//   //     });
//   //     if (isReceived) {
//   //       const { error: updateError } = await supabase
//   //         .from('messages')
//   //         .update({ is_read: true })
//   //         .eq('id', message.id);
//   //       if (updateError) {
//   //         console.error('Error marking message as read:', updateError);
//   //         toast.error('Failed to mark message as read.');
//   //       }
//   //     }
//   //   }

//   //   // Update connected users
//   //   queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
//   //     if (!old) return old;
//   //     const existingUserIndex = old.findIndex((u) => u.id === otherUserId);
//   //     let updatedUsers = [...old];
//   //     if (existingUserIndex !== -1) {
//   //       updatedUsers[existingUserIndex] = {
//   //         ...updatedUsers[existingUserIndex],
//   //         lastMessage: message.content.slice(0, 50),
//   //         lastMessageTime: message.created_at,
//   //         unreadCount:
//   //           isReceived && otherUserId !== chatUserId
//   //             ? updatedUsers[existingUserIndex].unreadCount + 1
//   //             : updatedUsers[existingUserIndex].unreadCount,
//   //       };
//   //     } else {
//   //       const fetchNewUserProfile = async () => {
//   //         const { data: profile, error } = await supabase
//   //           .from('profiles')
//   //           .select('id, username, avatar_url, user_type')
//   //           .eq('id', otherUserId)
//   //           .maybeSingle();
//   //         if (error) {
//   //           console.error('Error fetching new user profile:', error);
//   //           toast.error('Failed to load user profile.');
//   //           return;
//   //         }
//   //         if (profile) {
//   //           const newUser: ConnectedUser = {
//   //             id: otherUserId,
//   //             username: profile.username || 'Unknown',
//   //             avatar_url: profile.avatar_url || '',
//   //             user_type: profile.user_type || 'student',
//   //             unreadCount: isReceived ? 1 : 0,
//   //             lastMessage: message.content.slice(0, 50),
//   //             lastMessageTime: message.created_at,
//   //           };
//   //           updatedUsers = [...updatedUsers, newUser].sort(
//   //             (a, b) =>
//   //               new Date(b.lastMessageTime || '0').getTime() -
//   //               new Date(a.lastMessageTime || '0').getTime()
//   //           );
//   //           queryClient.setQueryData(['connectedUsers', currentUserId], updatedUsers);
//   //           if (!chatUserId && isReceived) {
//   //             setChatUserId(otherUserId);
//   //             setChatUsername(profile.username || 'Unknown');
//   //             setChatUserAvatar(profile.avatar_url); // Set avatar URL
//   //             router.push(`/messages?userId=${otherUserId}`);
//   //           }
//   //         }
//   //       };
//   //       fetchNewUserProfile();
//   //     }
//   //     return updatedUsers.sort(
//   //       (a, b) =>
//   //         new Date(b.lastMessageTime || '0').getTime() -
//   //         new Date(a.lastMessageTime || '0').getTime()
//   //     );
//   //   });
//   // };


//   const handleIncomingMessage = useCallback(async (message: Message) => {
//     if (!currentUserId || !isOnline) return;
//     const isReceived = message.sender_id !== currentUserId;
//     const otherUserId = isReceived ? message.sender_id : message.receiver_id;

//     // Fetch sender profile if not included
//     let enrichedMessage = { ...message };
//     if (!message.sender) {
//       const { data: senderProfile, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username, avatar_url, user_type')
//         .eq('id', message.sender_id)
//         .maybeSingle();
//       if (profileError) {
//         console.error('Error fetching sender profile:', profileError);
//         toast.error('Failed to load sender profile.');
//         return;
//       }
//       enrichedMessage = {
//         ...message,
//         sender: senderProfile
//           ? {
//               id: senderProfile.id,
//               username: senderProfile.username || 'Unknown',
//               avatar_url: senderProfile.avatar_url || '',
//               user_type: senderProfile.user_type || 'student',
//             }
//           : undefined,
//       };
//     }

//     // Update messages for current chat
//     if (otherUserId === chatUserId) {
//       queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => {
//         if (!old || old.some((msg) => msg.id === message.id)) return old;
//         return [...old, enrichedMessage];
//       });
//       if (isReceived) {
//         const { error: updateError } = await supabase
//           .from('messages')
//           .update({ is_read: true })
//           .eq('id', message.id);
//         if (updateError) {
//           console.error('Error marking message as read:', updateError);
//           toast.error('Failed to mark message as read.');
//         }
//       }
//     }

//     // Update connected users
//     queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
//       if (!old) return old;
//       const existingUserIndex = old.findIndex((u) => u.id === otherUserId);
//       let updatedUsers = [...old];
//       if (existingUserIndex !== -1) {
//         updatedUsers[existingUserIndex] = {
//           ...updatedUsers[existingUserIndex],
//           lastMessage: message.content.slice(0, 50),
//           lastMessageTime: message.created_at,
//           unreadCount:
//             isReceived && otherUserId !== chatUserId
//               ? updatedUsers[existingUserIndex].unreadCount + 1
//               : updatedUsers[existingUserIndex].unreadCount,
//         };
//       } else {
//         const fetchNewUserProfile = async () => {
//           const { data: profile, error } = await supabase
//             .from('profiles')
//             .select('id, username, avatar_url, user_type')
//             .eq('id', otherUserId)
//             .maybeSingle();
//           if (error) {
//             console.error('Error fetching new user profile:', error);
//             toast.error('Failed to load user profile.');
//             return;
//           }
//           if (profile) {
//             const newUser: ConnectedUser = {
//               id: otherUserId,
//               username: profile.username || 'Unknown',
//               avatar_url: profile.avatar_url || '',
//               user_type: profile.user_type || 'student',
//               unreadCount: isReceived ? 1 : 0,
//               lastMessage: message.content.slice(0, 50),
//               lastMessageTime: message.created_at,
//             };
//             updatedUsers = [...updatedUsers, newUser].sort(
//               (a, b) =>
//                 new Date(b.lastMessageTime || '0').getTime() -
//                 new Date(a.lastMessageTime || '0').getTime()
//             );
//             queryClient.setQueryData(['connectedUsers', currentUserId], updatedUsers);
//             if (!chatUserId && isReceived) {
//               setChatUserId(otherUserId);
//               setChatUsername(profile.username || 'Unknown');
//               setChatUserAvatar(profile.avatar_url); // Set avatar URL
//               router.push(`/messages?userId=${otherUserId}`);
//             }
//           }
//         };
//         fetchNewUserProfile();
//       }
//       return updatedUsers.sort(
//         (a, b) =>
//           new Date(b.lastMessageTime || '0').getTime() -
//           new Date(a.lastMessageTime || '0').getTime()
//       );
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps 
//   }, [])

//   // Send message mutation
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
//       // Transform sender to match Message interface
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
//     },
//   });

//   // Subscribe to real-time messages
//   useEffect(() => {
//     if (!currentUserId || !isOnline) return;
//     const sentChannel = supabase
//       .channel(`messages:sent:${currentUserId}`)
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${currentUserId}` },
//         async (payload) => await handleIncomingMessage(payload.new as Message)
//       )
//       .subscribe((status, error) => {
//         if (error) {
//           handleSubscriptionError(error);
//           toast.error('Failed to subscribe to sent messages.');
//         }
//       });
//     const receivedChannel = supabase
//       .channel(`messages:received:${currentUserId}`)
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUserId}` },
//         async (payload) => await handleIncomingMessage(payload.new as Message)
//       )
//       .subscribe((status, error) => {
//         if (error) {
//           handleSubscriptionError(error);
//           toast.error('Failed to subscribe to received messages.');
//         }
//       });
//     return () => {
//       supabase.removeChannel(sentChannel);
//       supabase.removeChannel(receivedChannel);
//     };
//   }, [currentUserId, isOnline, queryClient, handleIncomingMessage]);

//   // Scroll to bottom
//   useEffect(() => {
//     if (messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (!currentUserId || !chatUserId || !chatMessage.trim() || !isOnline) {
//       if (!isOnline) toast.error('Cannot send message: No internet connection.');
//       return;
//     }
//     sendMessageMutation.mutate({ content: chatMessage, parentMessageId: replyToMessage?.id || null });
//     setChatMessage('');
//   };

//   // Handle reply
//   const handleReply = (message: Message) => {
//     setReplyToMessage(message);
//   };

//   // Handle Enter key
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Handle user selection
//   const handleUserSelect = (userId: string, username: string, avatarUrl?: string) => {
//     setChatUserId(userId);
//     setChatUsername(username);
//     setChatUserAvatar(avatarUrl); // Set avatar URL
//     setReplyToMessage(null);
//     router.push(`/messages?userId=${userId}`);
//     if (window.innerWidth < 768) {
//       setIsSidebarOpen(false); // Close sidebar on mobile after selection
//     }
//   };

//   // Detect scroll position
//   useEffect(() => {
//     const messageContainer = messageContainerRef.current;
//     if (!messageContainer) return;
//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = messageContainer;
//       setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
//     };
//     messageContainer.addEventListener('scroll', handleScroll);
//     return () => messageContainer.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full min-h-screen dark:bg-gray-900 relative">
//       {/* Mobile menu toggle button */}
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute top-5 left-[170px] z-50 md:hidden"
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
//         aria-expanded={isSidebarOpen}
//       >
//         {isSidebarOpen ? <Box className="" /> : <Menu className="h-6 w-6" />}
//       </Button>

//       {/* Overlay for mobile when sidebar is open */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar */}
//       <Box
//         as="aside"
//         ref={sidebarRef}
//         className={`
//           h-screen bg-white dark:bg-gray-800 shadow-lg overflow-y-auto
//           fixed top-0 left-0 transform transition-transform duration-300 z-40
//           w-64 sm:w-72 md:w-80
//           md:static md:translate-x-0
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h3>
//         </div>
//         {isLoadingUsers ? (
//           <div className="p-4 space-y-4">
//             {[...Array(5)].map((_, idx) => (
//               <Skeleton key={idx} className="h-14 w-full rounded-none" />
//             ))}
//           </div>
//         ) : connectedUsers.length === 0 ? (
//           <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
//             No chats yet. Send a message to start one!
//           </p>
//         ) : (
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             {connectedUsers.map((user) => (
//               <li
//                 key={user.id}
//                 className={`p-3 cursor-pointer transition-all ${
//                   chatUserId === user.id ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//                 onClick={() => handleUserSelect(user.id, user.username, user.avatar_url)}
//               >
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={user.avatar_url || ''} alt={user.username} />
//                     <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <p
//                         className={`text-sm font-medium text-gray-900 dark:text-white ${
//                           user.unreadCount > 0 ? 'font-bold' : ''
//                         }`}
//                       >
//                         {user.username}
//                       </p>
//                       <Badge
//                         className={`text-xs ${
//                           user.user_type === 'student' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
//                         }`}
//                       >
//                         {user.user_type === 'student' ? 'Student' : 'Sponsor'}
//                       </Badge>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.lastMessage || ''}</p>
//                   </div>
//                   <div className="flex flex-col items-end gap-1">
//                     <p className="text-xs text-gray-400 dark:text-gray-500">
//                     {user.lastMessage
//                       ? user.lastMessage.split(" ").slice(0, 3).join(" ") + "..."
//                       : ""}
//                     </p>
//                     {user.unreadCount > 0 && (
//                       <Badge className="bg-green-500 text-white text-xs">{user.unreadCount}</Badge>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </Box>

//       {/* Main content */}
//       <main className="flex flex-col h-screen w-full relative">
//         {chatUserId && (
//           <Box
//             as="div"
//             className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10"
//           >
//             <Box as="div" className="flex items-center gap-3 max-w-4xl mx-auto w-full">
//               <Avatar className="h-12 w-12">
//                 <AvatarImage src={chatUserAvatar || ''} alt={chatUsername || 'User'} />
//                 <AvatarFallback>{chatUsername?.[0] || 'U'}</AvatarFallback>
//               </Avatar>
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{chatUsername || 'User'}</h2>
//             </Box>
//           </Box>
//         )}
//         <div
//           ref={messageContainerRef}
//           className="flex-1 overflow-y-auto p-4 bg-[url('/whatsapp-bg.png')] bg-repeat bg-contain"
//         >
//           {!chatUserId ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20">
//               Select a chat to start messaging.
//             </p>
//           ) : messages.length === 0 ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20">
//               No messages yet. Say hello!
//             </p>
//           ) : (
//             <div className="space-y-3 max-w-4xl mx-auto">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-[70%] p-3 rounded-lg shadow-sm relative ${
//                       msg.sender_id === currentUserId
//                         ? 'bg-green-200 text-gray-900 rounded-br-none'
//                         : 'bg-white text-gray-900 rounded-bl-none'
//                     }`}
//                   >
//                     {msg.parent_message_id && (
//                       <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg mb-2">
//                         <p className="text-xs text-gray-600 dark:text-gray-400">
//                           Replying to:{' '}
//                           {messages.find((m) => m.id === msg.parent_message_id)?.content.slice(0, 50) || 'Message'}
//                         </p>
//                       </div>
//                     )}
//                     <p className="text-sm">{msg.content}</p>
//                     <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
//                       <span>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
//                       {msg.sender_id === currentUserId &&
//                         (msg.is_read ? (
//                           <CheckCheck className="h-4 w-4 text-blue-500" />
//                         ) : (
//                           <Check className="h-4 w-4 text-gray-500" />
//                         ))}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="ml-2"
//                         onClick={() => handleReply(msg)}
//                       >
//                         <Reply className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//           {showScrollDown && (
//             <Button
//               variant="outline"
//               size="icon"
//               className="absolute bottom-44 right-4 rounded-full shadow-md sm:bottom-24"
//               onClick={scrollToBottom}
//             >
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//         {chatUserId && (
//           <div className="p-4 bg-blue-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sticky bottom-0 z-10">
//             {replyToMessage && (
//               <div className="flex items-center gap-2 mb-2 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 p-2 rounded">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Replying to: {replyToMessage.content.slice(0, 50)}
//                 </p>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setReplyToMessage(null)}
//                   className="ml-auto"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
//             <div className="flex gap-2 max-w-4xl mx-auto  pb-[75px] sm:pb-[0px]">
//               <Textarea
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Type a message..."
//                 className="flex-1 resize-none min-h-[44px] max-h-[100px] rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!isOnline}
//               />
//               <Button
//                 size="icon"
//                 onClick={handleSendMessage}
//                 className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
//                 disabled={sendMessageMutation.isPending || !isOnline}
//               >
//                 <Send className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }






// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Check, CheckCheck, ChevronDown, Menu, Reply, Send, X } from 'lucide-react';
// import { getCurrentUser, handleSubscriptionError, supabase } from '@/lib/supabaseClient';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useRouter, useSearchParams } from 'next/navigation';

// import { Badge } from '@/components/ui/badge';
// import Box from '@/components/ui/box';
// import { Button } from '@/components/ui/button';
// import { RawMessage } from '@/lib/types';
// import { Skeleton } from '@/components/ui/skeleton';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import Textarea from '@/components/ui/textarea';
// import { formatDistanceToNow } from 'date-fns';
// import { toast } from 'sonner';

// // Define interfaces
// interface Profile {
//   id: string;
//   username: string;
//   avatar_url?: string;
//   user_type: 'student' | 'sponsor';
// }

// interface Message {
//   id: string;
//   sender_id: string;
//   receiver_id: string;
//   content: string;
//   parent_message_id: string | null;
//   created_at: string;
//   is_read: boolean;
//   sender?: Profile;
// }

// interface ConnectedUser {
//   id: string;
//   username: string;
//   avatar_url?: string;
//   user_type: 'student' | 'sponsor';
//   unreadCount: number;
//   lastMessage?: string;
//   lastMessageTime?: string;
// }

// export default function Messages() {
//   // State
//   const [chatUserId, setChatUserId] = useState<string | null>(null);
//   const [chatUsername, setChatUsername] = useState<string | null>(null);
//   const [chatUserAvatar, setChatUserAvatar] = useState<string | undefined>(undefined);
//   const [chatMessage, setChatMessage] = useState('');
//   const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [showScrollDown, setShowScrollDown] = useState(false);
//   const [isOnline, setIsOnline] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messageContainerRef = useRef<HTMLDivElement>(null);
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   // Hooks
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // Sync online/offline state
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);
//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);
//     setIsOnline(navigator.onLine);
//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         isSidebarOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target as Node) &&
//         window.innerWidth < 768
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isSidebarOpen]);

//   // Fetch current user and select chat
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user = await getCurrentUser();
//         setCurrentUserId(user?.id || null);
//         const userId = searchParams.get('userId');
//         if (userId) {
//           setChatUserId(userId);
//           const { data: profile, error } = await supabase
//             .from('profiles')
//             .select('username, avatar_url, user_type')
//             .eq('id', userId)
//             .maybeSingle();
//           if (error) {
//             console.error('Error fetching profile:', error);
//             toast.error('Failed to load user profile.');
//             return;
//           }
//           setChatUsername(profile?.username || 'User');
//           setChatUserAvatar(profile?.avatar_url || undefined);
//         }
//       } catch (error) {
//         console.error('Error fetching current user:', error);
//         toast.error('Failed to load current user.');
//       }
//     };
//     fetchCurrentUser();
//   }, [searchParams]);

//   // Fetch connected users
//   const { data: connectedUsers = [], isLoading: isLoadingUsers } = useQuery<
//     ConnectedUser[],
//     Error
//   >({
//     queryKey: ['connectedUsers', currentUserId],
//     queryFn: async () => {
//       if (!currentUserId) return [];
//       const { data: messageUsers, error: messageError } = await supabase
//         .from('messages')
//         .select('sender_id, receiver_id')
//         .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
//       if (messageError) {
//         console.error('Error fetching message users:', messageError);
//         throw new Error('Failed to load chat users.');
//       }
//       const userIds = Array.from(
//         new Set(
//           messageUsers?.flatMap((msg) => [
//             msg.sender_id !== currentUserId ? msg.sender_id : null,
//             msg.receiver_id !== currentUserId ? msg.receiver_id : null,
//           ]).filter((id): id is string => id !== null)
//         )
//       );
//       if (!userIds.length) return [];
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username, avatar_url, user_type')
//         .in('id', userIds);
//       if (profileError) {
//         console.error('Error fetching profiles:', profileError);
//         throw new Error('Failed to load user profiles.');
//       }
//       const usersWithDetails = await Promise.all(
//         (profiles || []).map(async (profile) => {
//           const { data: unread, error: unreadError } = await supabase
//             .from('messages')
//             .select('id')
//             .eq('receiver_id', currentUserId)
//             .eq('sender_id', profile.id)
//             .eq('is_read', false);
//           if (unreadError) {
//             console.error('Error fetching unread messages:', unreadError);
//           }
//           const { data: lastMsg, error: lastMsgError } = await supabase
//             .from('messages')
//             .select('content, created_at')
//             .or(
//               `and(sender_id.eq.${currentUserId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUserId})`
//             )
//             .order('created_at', { ascending: false })
//             .limit(1)
//             .maybeSingle();
//           if (lastMsgError && lastMsgError.code !== 'PGRST116') {
//             console.error('Error fetching last message:', lastMsgError);
//           }
//           return {
//             id: profile.id,
//             username: profile.username || 'Unknown',
//             avatar_url: profile.avatar_url || '',
//             user_type: profile.user_type || 'student',
//             unreadCount: unread?.length || 0,
//             lastMessage: lastMsg?.content?.slice(0, 50) || '',
//             lastMessageTime: lastMsg?.created_at || '',
//           };
//         })
//       );
//       return usersWithDetails.sort(
//         (a, b) =>
//           new Date(b.lastMessageTime || '0').getTime() -
//           new Date(a.lastMessageTime || '0').getTime()
//       );
//     },
//     enabled: !!currentUserId && isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Auto-select most recent user
//   useEffect(() => {
//     if (!chatUserId && connectedUsers.length > 0 && isOnline) {
//       const mostRecentUser = connectedUsers[0];
//       setChatUserId(mostRecentUser.id);
//       setChatUsername(mostRecentUser.username);
//       setChatUserAvatar(mostRecentUser.avatar_url);
//       router.push(`/messages?userId=${mostRecentUser.id}`);
//     }
//   }, [connectedUsers, chatUserId, router, isOnline]);

//   // Fetch messages
//   const { data: messages = [] } = useQuery<
//     Message[],
//     Error
//   >({
//     queryKey: ['messages', currentUserId, chatUserId],
//     queryFn: async () => {
//       if (!currentUserId || !chatUserId) return [];
//       const { data, error } = await supabase
//         .from('messages')
//         .select(
//           `
//           id, sender_id, receiver_id, content, parent_message_id, created_at, is_read,
//           sender:profiles!messages_sender_id_fkey(id, username, avatar_url, user_type)
//         `
//         )
//         .or(
//           `and(sender_id.eq.${currentUserId},receiver_id.eq.${chatUserId}),and(sender_id.eq.${chatUserId},receiver_id.eq.${currentUserId})`
//         )
//         .order('created_at', { ascending: true });
//       if (error) {
//         console.error('Error fetching messages:', error);
//         throw new Error('Failed to load messages.');
//       }
//       const transformedData = data?.map((msg: RawMessage) => ({
//         ...msg,
//         sender: msg.sender?.[0]
//           ? {
//               id: msg.sender[0].id,
//               username: msg.sender[0].username,
//               avatar_url: msg.sender[0].avatar_url,
//               user_type: msg.sender[0].user_type,
//             }
//           : undefined,
//       })) as Message[];
//       if (isOnline && transformedData?.length) {
//         const { error: updateError } = await supabase
//           .from('messages')
//           .update({ is_read: true })
//           .eq('receiver_id', currentUserId)
//           .eq('sender_id', chatUserId)
//           .eq('is_read', false);
//         if (updateError) {
//           console.error('Error marking messages as read:', updateError);
//           toast.error('Failed to mark messages as read.');
//         } else {
//           queryClient.invalidateQueries({ queryKey: ['connectedUsers', currentUserId] });
//         }
//       }
//       return transformedData || [];
//     },
//     enabled: !!currentUserId && !!chatUserId && isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Handle incoming messages
//   const handleIncomingMessage = useCallback(async (message: Message) => {
//     if (!currentUserId || !isOnline) return;
//     const isReceived = message.sender_id !== currentUserId;
//     const otherUserId = isReceived ? message.sender_id : message.receiver_id;

//     let enrichedMessage = { ...message };
//     if (!message.sender) {
//       const { data: senderProfile, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username, avatar_url, user_type')
//         .eq('id', message.sender_id)
//         .maybeSingle();
//       if (profileError) {
//         console.error('Error fetching sender profile:', profileError);
//         toast.error('Failed to load sender profile.');
//         return;
//       }
//       enrichedMessage = {
//         ...message,
//         sender: senderProfile
//           ? {
//               id: senderProfile.id,
//               username: senderProfile.username || 'Unknown',
//               avatar_url: senderProfile.avatar_url || '',
//               user_type: senderProfile.user_type || 'student',
//             }
//           : undefined,
//       };
//     }

//     if (otherUserId === chatUserId) {
//       queryClient.setQueryData(['messages', currentUserId, chatUserId], (old: Message[] | undefined) => {
//         if (!old || old.some((msg) => msg.id === message.id)) return old;
//         return [...old, enrichedMessage];
//       });
//       if (isReceived) {
//         const { error: updateError } = await supabase
//           .from('messages')
//           .update({ is_read: true })
//           .eq('id', message.id);
//         if (updateError) {
//           console.error('Error marking message as read:', updateError);
//           toast.error('Failed to mark message as read.');
//         }
//       }
//     }

//     queryClient.setQueryData(['connectedUsers', currentUserId], (old: ConnectedUser[] | undefined) => {
//       if (!old) return old;
//       const existingUserIndex = old.findIndex((u) => u.id === otherUserId);
//       let updatedUsers = [...old];
//       if (existingUserIndex !== -1) {
//         updatedUsers[existingUserIndex] = {
//           ...updatedUsers[existingUserIndex],
//           lastMessage: message.content.slice(0, 50),
//           lastMessageTime: message.created_at,
//           unreadCount:
//             isReceived && otherUserId !== chatUserId
//               ? updatedUsers[existingUserIndex].unreadCount + 1
//               : updatedUsers[existingUserIndex].unreadCount,
//         };
//       } else {
//         const fetchNewUserProfile = async () => {
//           const { data: profile, error } = await supabase
//             .from('profiles')
//             .select('id, username, avatar_url, user_type')
//             .eq('id', otherUserId)
//             .maybeSingle();
//           if (error) {
//             console.error('Error fetching new user profile:', error);
//             toast.error('Failed to load user profile.');
//             return;
//           }
//           if (profile) {
//             const newUser: ConnectedUser = {
//               id: otherUserId,
//               username: profile.username || 'Unknown',
//               avatar_url: profile.avatar_url || '',
//               user_type: profile.user_type || 'student',
//               unreadCount: isReceived ? 1 : 0,
//               lastMessage: message.content.slice(0, 50),
//               lastMessageTime: message.created_at,
//             };
//             updatedUsers = [...updatedUsers, newUser].sort(
//               (a, b) =>
//                 new Date(b.lastMessageTime || '0').getTime() -
//                 new Date(a.lastMessageTime || '0').getTime()
//             );
//             queryClient.setQueryData(['connectedUsers', currentUserId], updatedUsers);
//             if (!chatUserId && isReceived) {
//               setChatUserId(otherUserId);
//               setChatUsername(profile.username || 'Unknown');
//               setChatUserAvatar(profile.avatar_url);
//               router.push(`/messages?userId=${otherUserId}`);
//             }
//           }
//         };
//         fetchNewUserProfile();
//       }
//       return updatedUsers.sort(
//         (a, b) =>
//           new Date(b.lastMessageTime || '0').getTime() -
//           new Date(a.lastMessageTime || '0').getTime()
//       );
//     });
//   }, [currentUserId, isOnline, queryClient, chatUserId, router]);

//   // Send message mutation
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
//     },
//   });

//   // Subscribe to real-time messages
//   useEffect(() => {
//     if (!currentUserId || !isOnline) return;
//     const sentChannel = supabase
//       .channel(`messages:sent:${currentUserId}`)
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${currentUserId}` },
//         async (payload) => await handleIncomingMessage(payload.new as Message)
//       )
//       .subscribe((status, error) => {
//         if (error) {
//           handleSubscriptionError(error);
//           toast.error('Failed to subscribe to sent messages.');
//         }
//       });
//     const receivedChannel = supabase
//       .channel(`messages:received:${currentUserId}`)
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUserId}` },
//         async (payload) => await handleIncomingMessage(payload.new as Message)
//       )
//       .subscribe((status, error) => {
//         if (error) {
//           handleSubscriptionError(error);
//           toast.error('Failed to subscribe to received messages.');
//         }
//       });
//     return () => {
//       supabase.removeChannel(sentChannel);
//       supabase.removeChannel(receivedChannel);
//     };
//   }, [currentUserId, isOnline, queryClient, handleIncomingMessage]);

//   // Scroll to bottom
//   useEffect(() => {
//     if (messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (!currentUserId || !chatUserId || !chatMessage.trim() || !isOnline) {
//       if (!isOnline) toast.error('Cannot send message: No internet connection.');
//       return;
//     }
//     sendMessageMutation.mutate({ content: chatMessage, parentMessageId: replyToMessage?.id || null });
//     setChatMessage('');
//   };

//   // Handle reply
//   const handleReply = (message: Message) => {
//     setReplyToMessage(message);
//   };

//   // Handle Enter key
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Handle user selection
//   const handleUserSelect = (userId: string, username: string, avatarUrl?: string) => {
//     setChatUserId(userId);
//     setChatUsername(username);
//     setChatUserAvatar(avatarUrl);
//     setReplyToMessage(null);
//     router.push(`/messages?userId=${userId}`);
//     if (window.innerWidth < 768) {
//       setIsSidebarOpen(false);
//     }
//   };

//   // Detect scroll position
//   useEffect(() => {
//     const messageContainer = messageContainerRef.current;
//     if (!messageContainer) return;
//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = messageContainer;
//       setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
//     };
//     messageContainer.addEventListener('scroll', handleScroll);
//     return () => messageContainer.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full min-h-screen dark:bg-gray-900 relative">
//       {/* Main content */}
//       <main className="flex flex-col h-screen w-[100%] absolute">
//         {chatUserId && (
//           <Box
//             as="div"
//             className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10"
//           >
//           <DropdownMenu >
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label="Open chats"
//             className='relative z-100000 left-[10px]'
//           >
//             <Menu className="h-6 w-6 " />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent
//           side="left"
//           align="start"
//           className="w-64 md:w-80 max-h-[90vh] overflow-y-auto p-0"
//         >
//           <DropdownMenuLabel className="p-4 text-lg font-semibold text-gray-900 dark:text-white">
//             Chats
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />

//           {isLoadingUsers ? (
//             <div className="p-4 space-y-4">
//               {[...Array(5)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-14 w-full rounded-lg" />
//               ))}
//             </div>
//           ) : connectedUsers.length === 0 ? (
//             <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
//               No chats yet. Send a message to start one!
//             </p>
//           ) : (
//             connectedUsers.map((user) => (
//               <DropdownMenuItem
//                 key={user.id}
//                 onClick={() =>
//                   handleUserSelect(user.id, user.username, user.avatar_url)
//                 }
//                 className={`
//                   cursor-pointer flex items-center gap-3 p-3 rounded-md
//                   ${chatUserId === user.id
//                     ? 'bg-gray-100 dark:bg-gray-700'
//                     : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
//                 `}
//               >
//                 <Avatar className="h-10 w-10">
//                   <AvatarImage src={user.avatar_url || ''} alt={user.username} />
//                   <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <p
//                       className={`text-sm font-medium text-gray-900 dark:text-white ${
//                         user.unreadCount > 0 ? 'font-bold' : ''
//                       }`}
//                     >
//                       {user.username}
//                     </p>
//                     <Badge
//                       className={`text-xs ${
//                         user.user_type === 'student'
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-purple-500 text-white'
//                       }`}
//                     >
//                       {user.user_type}
//                     </Badge>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                     {user.lastMessage || ''}
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-end gap-1">
//                   <p className="text-xs text-gray-400 dark:text-gray-500">
//                     {user.lastMessage
//                       ? user.lastMessage.split(' ').slice(0, 3).join(' ') + '...'
//                       : ''}
//                   </p>
//                   {user.unreadCount > 0 && (
//                     <Badge className="bg-green-500 text-white text-xs">
//                       {user.unreadCount}
//                     </Badge>
//                   )}
//                 </div>
//               </DropdownMenuItem>
//             ))
//           )}
//         </DropdownMenuContent>
//           </DropdownMenu>

//             <Box as="div" className="flex items-center gap-3 max-w-4xl mx-auto w-full ml-[10px]">
//               <Avatar className="h-12 w-12">
//                 <AvatarImage src={chatUserAvatar || ''} alt={chatUsername || 'User'} />
//                 <AvatarFallback>{chatUsername?.[0] || 'U'}</AvatarFallback>
//               </Avatar>
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{chatUsername || 'User'}</h2>
//             </Box>
//           </Box>
//         )}
//         <div
//           ref={messageContainerRef}
//           className="flex-1 overflow-y-auto p-4 bg-[url('/whatsapp-bg.png')] bg-repeat bg-contain"
//         >
//           {!chatUserId ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20">
//               Select a chat to start messaging.
//             </p>
//           ) : messages.length === 0 ? (
//             <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-20">
//               No messages yet. Say hello!
//             </p>
//           ) : (
//             <div className="space-y-3 max-w-4xl mx-auto">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-[70%] p-3 rounded-lg shadow-sm relative ${
//                       msg.sender_id === currentUserId
//                         ? 'bg-green-200 text-gray-900 rounded-br-none'
//                         : 'bg-white text-gray-900 rounded-bl-none'
//                     }`}
//                   >
//                     {msg.parent_message_id && (
//                       <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg mb-2">
//                         <p className="text-xs text-gray-600 dark:text-gray-400">
//                           Replying to:{' '}
//                           {messages.find((m) => m.id === msg.parent_message_id)?.content.slice(0, 50) || 'Message'}
//                         </p>
//                       </div>
//                     )}
//                     <p className="text-sm">{msg.content}</p>
//                     <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
//                       <span>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
//                       {msg.sender_id === currentUserId &&
//                         (msg.is_read ? (
//                           <CheckCheck className="h-4 w-4 text-blue-500" />
//                         ) : (
//                           <Check className="h-4 w-4 text-gray-500" />
//                         ))}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="ml-2"
//                         onClick={() => handleReply(msg)}
//                       >
//                         <Reply className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//           {showScrollDown && (
//             <Button
//               variant="outline"
//               size="icon"
//               className="absolute bottom-4 right-4 rounded-full shadow-md sm:bottom-24"
//               onClick={scrollToBottom}
//             >
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//         {chatUserId && (
//           <div className="p-4 bg-blue-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sticky bottom-0 z-10">
//             {replyToMessage && (
//               <div className="flex items-center gap-2 mb-2 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 p-2 rounded">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Replying to: {replyToMessage.content.slice(0, 50)}
//                 </p>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setReplyToMessage(null)}
//                   className="ml-auto"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
//             <div className="flex gap-2 max-w-4xl mx-auto pb-[75px] sm:pb-0">
//               <Textarea
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Type a message..."
//                 className="flex-1 resize-none min-h-[44px] max-h-[100px] rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
//                 disabled={!isOnline}
//               />
//               <Button
//                 size="icon"
//                 onClick={handleSendMessage}
//                 className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
//                 disabled={sendMessageMutation.isPending || !isOnline}
//               >
//                 <Send className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



import MessageModule from "@/features/messages/messages.module"
import React from "react"
export default function Messages() {
   return( <MessageModule/>)
}