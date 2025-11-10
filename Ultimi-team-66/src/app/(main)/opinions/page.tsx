// 'use client';

// import { ArrowDown, Heart, MessageCircle, ThumbsDown, Plus } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
// import { Card, CardContent } from '@/components/ui/card';
// import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
// import {
//   UseMutationResult,
//   UseQueryResult,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
// import { getCurrentUser, supabase } from '@/lib/supabaseClient';
// import { Button } from '@/components/ui/button';
// import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
// import { Skeleton } from '@/components/ui/skeleton';
// import Textarea from '@/components/ui/textarea';
// import { toast } from 'sonner';
// import { reactions, getPopularReactions } from '@/lib/reactions';
//  import { motion, AnimatePresence } from 'framer-motion';

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/ popover';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // Define interfaces
// interface User {
//   username: string;
//   avatar_url?: string | null;
// }



// interface OpinionReaction {
//   id: string;
//   opinion_id: string;
//   user_id: string;
//   emoji: string;
//   created_at: string;
// }

// interface CommentReaction {
//   id: string;
//   comment_id: string;
//   user_id: string;
//   emoji: string;
//   created_at: string;
// }


// interface Comment {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
//   reactions: CommentReaction[];
//   user: User | null;
//   replies?: Comment[];
// }

// interface Opinion {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   updated_at: string;
//   user: User | null;
//   likes: { user_id: string }[];
//   dislikes: { user_id: string }[];
//   reactions: OpinionReaction[];
//   comments: Comment[];
// }

// interface OpinionPayload {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   updated_at: string;
// }

// interface CommentPayload {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   opinion_id: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
// }

// interface LikeDislikePayload {
//   opinion_id?: string;
//   comment_id?: string;
//   user_id: string;
// }

// interface SupabaseUser {
//   username: string;
//   avatar_url?: string | null;
// }

// interface SupabaseComment {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
//   reactions: CommentReaction[];
//   user: SupabaseUser | null;
// }

// interface CurrentUser {
//   id: string;
//   username?: string;
//   avatar_url?: string | null;
// }

// interface GroupedOpinions {
//   date: string;
//   label: string;
//   opinions: Opinion[];
// }

// // Helper function for mutual exclusivity in Supabase
// const ensureMutualExclusivity = async (
//   table: 'opinion_likes' | 'opinion_dislikes' | 'opinion_comments',
//   idField: 'opinion_id' | 'comment_id',
//   idValue: string,
//   userId: string,
//   isLike: boolean
// ) => {
//   if (table === 'opinion_comments') {
//     const { data: comment, error: fetchError } = await supabase
//       .from('opinion_comments')
//       .select('likes, dislikes')
//       .eq('id', idValue)
//       .single();
//     if (fetchError || !comment) {
//       console.error('Error fetching comment:', fetchError);
//       throw new Error('Failed to fetch comment.');
//     }

//     const updatedLikes = isLike
//       ? comment.likes.includes(userId)
//         ? comment.likes.filter((id: string) => id !== userId)
//         : [...comment.likes, userId]
//       : comment.likes.filter((id: string) => id !== userId);
//     const updatedDislikes = !isLike
//       ? comment.dislikes.includes(userId)
//         ? comment.dislikes.filter((id: string) => id !== userId)
//         : [...comment.dislikes, userId]
//       : comment.dislikes.filter((id: string) => id !== userId);

//     const { error: updateError } = await supabase
//       .from('opinion_comments')
//       .update({ likes: updatedLikes, dislikes: updatedDislikes })
//       .eq('id', idValue);
//     if (updateError) {
//       console.error(`Error updating comment ${isLike ? 'likes' : 'dislikes'}:`, updateError);
//       throw new Error(`Failed to update comment ${isLike ? 'likes' : 'dislikes'}.`);
//     }
//   } else {
//     const oppositeTable = table === 'opinion_likes' ? 'opinion_dislikes' : 'opinion_likes';
//     const [deleteResult, insertResult] = await Promise.all([
//       supabase
//         .from(oppositeTable)
//         .delete()
//         .eq(idField, idValue)
//         .eq('user_id', userId),
//       supabase
//         .from(table)
//         .upsert([{ [idField]: idValue, user_id: userId }], { onConflict: `${idField},user_id` }),
//     ]);

//     if (deleteResult.error) {
//       console.error(`Error removing from ${oppositeTable}:`, deleteResult.error);
//       throw new Error(`Failed to remove ${isLike ? 'dislike' : 'like'}.`);
//     }
//     if (insertResult.error) {
//       console.error(`Error adding to ${table}:`, insertResult.error);
//       throw new Error(`Failed to ${isLike ? 'like' : 'dislike'}.`);
//     }
//   }
// };

// // Helper to nest comments
// const nestComments = (comments: SupabaseComment[]): Comment[] => {
//   const commentMap = new Map<string, Comment>();
//   const topLevel: Comment[] = [];

//   comments.forEach(comment => {
//     const typedComment: Comment = {
//       ...comment,
//       replies: [],
//       reactions: comment.reactions || [],
//       user: comment.user || { username: 'Unknown', avatar_url: null },
//     };
//     commentMap.set(comment.id, typedComment);
//   });

//   comments.forEach(comment => {
//     if (comment.parent_comment_id) {
//       const parent = commentMap.get(comment.parent_comment_id);
//       if (parent) {
//         parent.replies = parent.replies || [];
//         parent.replies.push({
//           ...comment,
//           replies: [],
//           reactions: comment.reactions || [],
//           user: comment.user || { username: 'Unknown', avatar_url: null },
//         });
//       }
//     } else {
//       topLevel.push(commentMap.get(comment.id)!);
//     }
//   });

//   return topLevel;
// };

// // Group reactions by emoji
// const groupReactions = (reactions: OpinionReaction[] | CommentReaction[]) => {
//   const grouped = reactions.reduce((acc, reaction) => {
//     if (!acc[reaction.emoji]) {
//       acc[reaction.emoji] = [];
//     }
//     acc[reaction.emoji].push(reaction);
//     return acc;
//   }, {} as Record<string, (OpinionReaction | CommentReaction)[]>);

//   return Object.entries(grouped)
//     .map(([emoji, reactions]) => ({ emoji, count: reactions.length, reactions }))
//     .sort((a, b) => b.count - a.count);
// };

// export default function Opinions() {
//   const [newOpinion, setNewOpinion] = useState<string>('');
//   const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [isOnline, setIsOnline] = useState<boolean>(true);
//   const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
//   const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);
//   const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
//   const [openReactionPopover, setOpenReactionPopover] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const opinionsContainerRef = useRef<HTMLDivElement>(null);

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

//   // Track scroll position for auto-scroll and button visibility
//   useEffect(() => {
//     const container = opinionsContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
//       setShouldAutoScroll(isNearBottom);
//       setShowScrollButton(!isNearBottom);
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user: CurrentUser | null = await getCurrentUser();
//         setCurrentUser(user || null);
//       } catch (error: unknown) {
//         console.error('Error fetching current user:', error);
//         toast.error('Failed to load current user.');
//       }
//     };
//     fetchCurrentUser();
//   }, []);

//   // Fetch opinions
//   const { data: opinions = [], isLoading: isLoadingOpinions }: UseQueryResult<Opinion[], Error> = useQuery({
//     queryKey: ['opinions'],
//     queryFn: async (): Promise<Opinion[]> => {
//       const { data, error } = await supabase
//         .from('opinions')
//         .select(
//           `
//           id, user_id, content, created_at, updated_at,
//           user:profiles!opinions_user_id_fkey(username, avatar_url),
//           likes:opinion_likes(user_id),
//           dislikes:opinion_dislikes(user_id),
//           reactions:opinion_reactions(id, user_id, emoji, created_at),
//           comments:opinion_comments(
//             id, user_id, content, created_at, parent_comment_id, likes, dislikes,
//             reactions:comment_reactions(id, user_id, emoji, created_at),
//             user:profiles!opinion_comments_user_id_fkey(username, avatar_url)
//           )
//         `
//         )
//         .order('created_at', { ascending: true });
//       if (error) {
//         console.error('Error fetching opinions:', error);
//         throw new Error('Failed to load opinions.');
//       }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const nestedData = ((data as any[]) || []).map(opinion => ({
//         ...opinion,
//         user: opinion.user || { username: 'Unknown', avatar_url: null },
//         reactions: opinion.reactions || [],
//         comments: nestComments(opinion.comments || []),
//       }));
//       return nestedData as Opinion[];
//     },
//     enabled: isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Group opinions by date
//   const groupedOpinions: GroupedOpinions[] = opinions.reduce(
//     (acc: GroupedOpinions[], opinion) => {
//       const date = new Date(opinion.created_at);
//       let label: string;
//       if (isToday(date)) {
//         label = 'Today';
//       } else if (isYesterday(date)) {
//         label = 'Yesterday';
//       } else {
//         label = format(date, 'MMMM d, yyyy');
//       }
//       const existingGroup = acc.find(group => group.date === label);
//       if (existingGroup) {
//         existingGroup.opinions.push(opinion);
//       } else {
//         acc.push({ date: label, label, opinions: [opinion] });
//       }
//       return acc;
//     },
//     []
//   );

//   // Scroll to the most recent opinion or bottom
//   const scrollToBottom = () => {
//     if (opinionsContainerRef.current) {
//       if (opinions.length > 0) {
//         const lastOpinion = opinionsContainerRef.current.querySelector(
//           `[data-opinion-id="${opinions[opinions.length - 1].id}"]`
//         );
//         if (lastOpinion) {
//           lastOpinion.scrollIntoView({ behavior: 'smooth' });
//           return;
//         }
//       }
//       opinionsContainerRef.current.scrollTop = opinionsContainerRef.current.scrollHeight;
//     }
//   };

//   // Auto-scroll on new content if near bottom
//   const autoScrollOnNewContent = () => {
//     if (shouldAutoScroll) {
//       scrollToBottom();
//     }
//   };

//   // Trigger auto-scroll on new opinions/comments
//   useEffect(() => {
//     if (opinions.length > 0) {
//       autoScrollOnNewContent();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps 
//   }, [opinions]);

//   // Handle incoming opinion
//   const handleIncomingOpinion = async (payload: { new: OpinionPayload }) => {
//     if (!isOnline || payload.new.user_id === currentUser?.id) return;

//     const { data: userData, error: userError } = await supabase
//       .from('profiles')
//       .select('username, avatar_url')
//       .eq('id', payload.new.user_id)
//       .single();

//     if (userError || !userData) {
//       console.error('Error fetching user for opinion:', userError);
//       toast.error('Failed to load user profile.');
//       return;
//     }

//     const newOpinion: Opinion = {
//       ...payload.new,
//       user: userData,
//       likes: [],
//       dislikes: [],
//       reactions: [],
//       comments: [],
//     };

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return [newOpinion];
//       if (old.some(op => op.id === newOpinion.id)) return old;
//       const updated = [...old, newOpinion];
//       setTimeout(autoScrollOnNewContent, 100);
//       return updated;
//     });
//   };

//   // Handle incoming opinion like
//   const handleIncomingOpinionLike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (payload.new && op.id === payload.new.opinion_id) {
//           if (op.likes.some(l => l.user_id === payload.new!.user_id)) return op;
//           return {
//             ...op,
//             likes: [...op.likes, { user_id: payload.new!.user_id }],
//             dislikes: op.dislikes.filter(d => d.user_id !== payload.new!.user_id),
//           };
//         }
//         if (payload.old && op.id === payload.old.opinion_id) {
//           return {
//             ...op,
//             likes: op.likes.filter(l => l.user_id !== payload.old!.user_id),
//           };
//         }
//         return op;
//       });
//       return updated;
//     });
//   };

//   // Handle incoming opinion dislike
//   const handleIncomingOpinionDislike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (payload.new && op.id === payload.new.opinion_id) {
//           if (op.dislikes.some(d => d.user_id === payload.new!.user_id)) return op;
//           return {
//             ...op,
//             dislikes: [...op.dislikes, { user_id: payload.new!.user_id }],
//             likes: op.likes.filter(l => l.user_id !== payload.new!.user_id),
//           };
//         }
//         if (payload.old && op.id === payload.old.opinion_id) {
//           return {
//             ...op,
//             dislikes: op.dislikes.filter(d => d.user_id !== payload.old!.user_id),
//           };
//         }
//         return op;
//       });
//       return updated;
//     });
//   };

//   // Handle incoming comment
//   const handleIncomingComment = async (payload: { new: CommentPayload }) => {
//     if (!isOnline || payload.new.user_id === currentUser?.id) return;

//     const { data: userData } = await supabase
//       .from('profiles')
//       .select('username, avatar_url')
//       .eq('id', payload.new.user_id)
//       .single();

//     const newComment: Comment = {
//       ...payload.new,
//       user: userData || { username: 'Unknown', avatar_url: null },
//       likes: payload.new.likes || [],
//       dislikes: payload.new.dislikes || [],
//       reactions: [],
//       parent_comment_id: payload.new.parent_comment_id,
//     };

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (op.id !== payload.new.opinion_id) return op;
//         const comments = nestComments([...op.comments, newComment]);
//         return { ...op, comments };
//       });
//       setTimeout(autoScrollOnNewContent, 100);
//       return updated;
//     });
//   };

//   // Handle incoming comment like/dislike
//   const handleIncomingCommentLikeDislike = (payload: { new?: CommentPayload; old?: CommentPayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (op.id !== (payload.new?.opinion_id || payload.old?.opinion_id)) return op;
//         const comments = op.comments.map(c => {
//           if (c.id !== (payload.new?.id || payload.old?.id)) return c;
//           return {
//             ...c,
//             likes: payload.new ? payload.new.likes : c.likes,
//             dislikes: payload.new ? payload.new.dislikes : c.dislikes,
//           };
//         });
//         return { ...op, comments: nestComments(comments) };
//       });
//       return updated;
//     });
//   };

//   // Subscribe to real-time changes
//   useEffect(() => {
//     if (!isOnline || !currentUser?.id) return;

//     const opinionsChannel = supabase
//       .channel('opinions')
//       .on('postgres_changes' , { event: 'INSERT', schema: 'public', table: 'opinions' }, handleIncomingOpinion )
//       .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//         if (err) toast.error('Failed to subscribe to opinions.');
//       });

//     const likesChannel = supabase
//       .channel('opinion_likes')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'opinion_likes' }, handleIncomingOpinionLike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void)
//       .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//         if (err) toast.error('Failed to subscribe to likes.');
//       });

//     // const dislikesChannel = supabase
//     //   .channel('opinion_dislikes')
//     //   .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'opinion_dislikes' }, handleIncomingOpinionDislike)
//     //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     //     if (err) toast.error('Failed to subscribe to dislikes.');
//     //   });
//     const dislikesChannel = supabase
//     .channel('opinion_dislikes')
//     .on(
//       'postgres_changes',
//       { event: '*', schema: 'public', table: 'opinion_dislikes' },
//       handleIncomingOpinionDislike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void
//     )
//     .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//       if (err) toast.error('Failed to subscribe to dislikes.');
//     });

//     // const commentsChannel = supabase
//     //   .channel('opinion_comments')
//     //   .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table: 'opinion_comments' }, handleIncomingComment)
//     //   .on('postgres_changes' as any, { event: 'UPDATE', schema: 'public', table: 'opinion_comments' }, handleIncomingCommentLikeDislike)
//     //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     //     if (err) toast.error('Failed to subscribe to comments.');
//     //   });
//     const commentsChannel = supabase
//   .channel('opinion_comments')
//   .on(
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'opinion_comments' },
//     handleIncomingComment as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
//   )
//   .on(
//     'postgres_changes',
//     { event: 'UPDATE', schema: 'public', table: 'opinion_comments' },
//     handleIncomingCommentLikeDislike as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
//   )
//   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     if (err) toast.error('Failed to subscribe to comments.');
//   });

//     return () => {
//       supabase.removeChannel(opinionsChannel);
//       supabase.removeChannel(likesChannel);
//       supabase.removeChannel(dislikesChannel);
//       supabase.removeChannel(commentsChannel);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOnline, currentUser, queryClient]);

//   // Post opinion mutation
//   const postOpinionMutation: UseMutationResult<Opinion, Error, { content: string }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ content }: { content: string }): Promise<Opinion> => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser.id)
//           .single();
//         if (userError || !userData) {
//           throw new Error('Failed to fetch user profile.');
//         }
//         const { data: insertedOpinion, error } = await supabase
//           .from('opinions')
//           .insert({ user_id: currentUser.id, content })
//           .select(
//             `
//             id, user_id, content, created_at, updated_at,
//             user:profiles!opinions_user_id_fkey(username, avatar_url),
//             likes:opinion_likes(user_id),
//             dislikes:opinion_dislikes(user_id),
//             reactions:opinion_reactions(id, user_id, emoji, created_at),
//             comments:opinion_comments(id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url))
//           `
//           )
//           .single();
//         if (error || !insertedOpinion) {
//           throw new Error('Failed to post opinion.');
//         }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         function normalizeComments(rawComments: any[]): SupabaseComment[] {
//           return (rawComments ?? []).map((c) => ({
//             id: c.id,
//             user_id: c.user_id,
//             content: c.content,
//             created_at: c.created_at,
//             parent_comment_id: c.parent_comment_id ?? null,
//             likes: c.likes ?? [],
//             dislikes: c.dislikes ?? [],
//             reactions: c.reactions ?? [],
//             user: c.user?.[0] || { username: 'Unknown', avatar_url: null },
//           }));
//         }

//         return {
//           ...insertedOpinion,
//           user: insertedOpinion.user?.[0] || { username: 'Unknown', avatar_url: null },
//           reactions: insertedOpinion.reactions || [],
//           comments: nestComments(normalizeComments(insertedOpinion.comments || [])),
//         } as Opinion;
//       },
//       onMutate: async ({ content }: { content: string }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         const { data: userData } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser?.id)
//           .single();
//         const tempOpinion: Opinion = {
//           id: `temp-${Date.now()}`,
//           user_id: currentUser!.id,
//           content,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//           user: userData || { username: 'Unknown', avatar_url: null },
//           likes: [],
//           dislikes: [],
//           reactions: [],
//           comments: [],
//         };
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = [...(old || []), tempOpinion];
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, _vars, context) => {
//         toast.error(err.message || 'Failed to post opinion.');
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (insertedOpinion: Opinion) => {
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old
//             ? old.filter(op => !op.id.startsWith('temp-')).concat(insertedOpinion)
//             : [insertedOpinion];
//           setTimeout(autoScrollOnNewContent, 100);
//           return updated;
//         });
//         toast.success('Opinion posted!');
//         setNewOpinion('');
//       },
//     });

//   // Like/unlike opinion mutation
//   const likeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_likes', 'opinion_id', opinionId, currentUser.id, !isLiked);
//       },
//       onMutate: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op =>
//             op.id === opinionId
//               ? {
//                   ...op,
//                   likes: isLiked
//                     ? op.likes.filter(l => l.user_id !== currentUser!.id)
//                     : [...op.likes, { user_id: currentUser!.id }],
//                   dislikes: isLiked ? op.dislikes : op.dislikes.filter(d => d.user_id !== currentUser!.id),
//                 }
//               : op
//           );
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isLiked }, context) => {
//         toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} opinion.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isLiked }: { opinionId: string; isLiked: boolean }) => {
//         toast.success(isLiked ? 'Opinion unliked!' : 'Opinion liked!');
//       },
//     });

//   // Dislike/undislike opinion mutation
//   const dislikeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId }: { opinionId: string; isDisliked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_dislikes', 'opinion_id', opinionId, currentUser.id, false);
//       },
//       onMutate: async ({ opinionId, isDisliked }: { opinionId: string; isDisliked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op =>
//             op.id === opinionId
//               ? {
//                   ...op,
//                   dislikes: isDisliked
//                     ? op.dislikes.filter(d => d.user_id !== currentUser!.id)
//                     : [...op.dislikes, { user_id: currentUser!.id }],
//                   likes: isDisliked ? op.likes : op.likes.filter(l => l.user_id !== currentUser!.id),
//                 }
//               : op
//           );
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isDisliked }, context) => {
//         toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} opinion.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isDisliked }: { opinionId: string; isDisliked: boolean }) => {
//         toast.success(isDisliked ? 'Opinion undisliked!' : 'Opinion disliked!');
//       },
//     });

//   // Add reaction to opinion mutation
//   const addOpinionReactionMutation = useMutation({
//     mutationFn: async ({ opinionId, emoji }: { opinionId: string; emoji: string }) => {
//       if (!currentUser?.id || !isOnline) {
//         throw new Error('User not authenticated or offline.');
//       }

//       // Check if user already reacted with this emoji
//       const { data: existingReaction } = await supabase
//         .from('opinion_reactions')
//         .select('id')
//         .eq('opinion_id', opinionId)
//         .eq('user_id', currentUser.id)
//         .eq('emoji', emoji)
//         .single();

//       if (existingReaction) {
//         // Remove reaction
//         const { error } = await supabase
//           .from('opinion_reactions')
//           .delete()
//           .eq('id', existingReaction.id);
//         if (error) throw new Error('Failed to remove reaction.');
//       } else {
//         // Add reaction
//         const { error } = await supabase
//           .from('opinion_reactions')
//           .insert({
//             opinion_id: opinionId,
//             user_id: currentUser.id,
//             emoji,
//           });
//         if (error) throw new Error('Failed to add reaction.');
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['opinions'] });
//       setOpenReactionPopover(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update reaction.');
//     },
//   });

//   // Add reaction to comment mutation
//   const addCommentReactionMutation = useMutation({
//     mutationFn: async ({ commentId, emoji }: { commentId: string; emoji: string }) => {
//       if (!currentUser?.id || !isOnline) {
//         throw new Error('User not authenticated or offline.');
//       }

//       // Check if user already reacted with this emoji
//       const { data: existingReaction } = await supabase
//         .from('comment_reactions')
//         .select('id')
//         .eq('comment_id', commentId)
//         .eq('user_id', currentUser.id)
//         .eq('emoji', emoji)
//         .single();

//       if (existingReaction) {
//         // Remove reaction
//         const { error } = await supabase
//           .from('comment_reactions')
//           .delete()
//           .eq('id', existingReaction.id);
//         if (error) throw new Error('Failed to remove reaction.');
//       } else {
//         // Add reaction
//         const { error } = await supabase
//           .from('comment_reactions')
//           .insert({
//             comment_id: commentId,
//             user_id: currentUser.id,
//             emoji,
//           });
//         if (error) throw new Error('Failed to add reaction.');
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['opinions'] });
//       setOpenReactionPopover(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update reaction.');
//     },
//   });

//   // Post comment mutation
//   const postCommentMutation: UseMutationResult<Comment, Error, { opinionId: string; content: string; parentCommentId?: string }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }): Promise<Comment> => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser.id)
//           .single();
//         if (userError || !userData) {
//           throw new Error('Failed to fetch user profile.');
//         }
//         const { data: insertedComment, error } = await supabase
//           .from('opinion_comments')
//           .insert({
//             opinion_id: opinionId,
//             user_id: currentUser.id,
//             content,
//             parent_comment_id: parentCommentId,
//             likes: [],
//             dislikes: [],
//           })
//           .select(
//             'id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url)'
//           )
//           .single();
//         if (error || !insertedComment) {
//           throw new Error('Failed to post comment.');
//         }
//         return {
//           ...insertedComment,
//           reactions: insertedComment.reactions || [],
//           user: userData || { username: 'Unknown', avatar_url: null },
//         } as Comment;
//       },
//       onMutate: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         const { data: userData } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser?.id)
//           .single();
//         const tempComment: Comment = {
//           id: `temp-${Date.now()}`,
//           user_id: currentUser!.id,
//           content,
//           created_at: new Date().toISOString(),
//           user: userData || { username: 'Unknown', avatar_url: null },
//           likes: [],
//           dislikes: [],
//           reactions: [],
//           parent_comment_id: parentCommentId,
//           replies: [],
//         };
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => {
//             if (op.id !== opinionId) return op;
//             let comments = [...op.comments];
//             if (parentCommentId) {
//               comments = comments.map(c =>
//                 c.id === parentCommentId
//                   ? { ...c, replies: [...(c.replies || []), tempComment] }
//                   : c
//               );
//             } else {
//               comments.push(tempComment);
//             }
//             return { ...op, comments: nestComments(comments) };
//           });
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err, _variables, context) => {
//         toast.error(err.message || 'Failed to post comment.');
//         if (context?.previousOpinions) {
//           queryClient.setQueryData(['opinions'], context.previousOpinions);
//         }
//       },
//       onSuccess: (insertedComment: Comment, { opinionId, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => {
//             if (op.id !== opinionId) return op;
//             let comments = [...op.comments].filter(c => !c.id.startsWith('temp-'));
//             if (parentCommentId) {
//               comments = comments.map(c =>
//                 c.id === parentCommentId
//                   ? {
//                       ...c,
//                       replies: [...(c.replies || []).filter(r => !r.id.startsWith('temp-')), insertedComment],
//                     }
//                   : c
//               );
//             } else {
//               comments.push(insertedComment);
//             }
//             return { ...op, comments: nestComments(comments) };
//           });
//           setTimeout(autoScrollOnNewContent, 100);
//           return updated;
//         });
//         toast.success('Comment posted!');
//       },
//     });

//   // Like/unlike comment mutation
//   const likeCommentMutation: UseMutationResult<void, Error, { commentId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, !isLiked);
//       },
//       onMutate: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => ({
//             ...op,
//             comments: nestComments(
//               op.comments.map(c =>
//                 c.id === commentId
//                   ? {
//                       ...c,
//                       likes: isLiked ? c.likes.filter(id => id !== currentUser!.id) : [...c.likes, currentUser!.id],
//                       dislikes: isLiked ? c.dislikes : c.dislikes.filter(id => id !== currentUser!.id),
//                     }
//                   : c
//               )
//             ),
//           }));
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isLiked }, context) => {
//         toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} comment.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isLiked }: { commentId: string; isLiked: boolean }) => {
//         toast.success(isLiked ? 'Comment unliked!' : 'Comment liked!');
//       },
//     });

//   // Dislike/undislike comment mutation
//   const dislikeCommentMutation: UseMutationResult<void, Error, { commentId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ commentId }: { commentId: string; isDisliked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, false);
//       },
//       onMutate: async ({ commentId, isDisliked }: { commentId: string; isDisliked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => ({
//             ...op,
//             comments: nestComments(
//               op.comments.map(c =>
//                 c.id === commentId
//                   ? {
//                       ...c,
//                       dislikes: isDisliked
//                         ? c.dislikes.filter(id => id !== currentUser!.id)
//                         : [...c.dislikes, currentUser!.id],
//                       likes: isDisliked ? c.likes : c.likes.filter(id => id !== currentUser!.id),
//                     }
//                   : c
//               )
//             ),
//           }));
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isDisliked }, context) => {
//         toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} comment.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isDisliked }: { commentId: string; isDisliked: boolean }) => {
//         toast.success(isDisliked ? 'Comment undisliked!' : 'Comment disliked!');
//       },
//     });

//   // Handle submitting a new opinion
//   const handleSubmitOpinion = () => {
//     if (!newOpinion.trim() || !isOnline) {
//       toast.error(isOnline ? 'Please enter an opinion.' : 'Cannot post opinion: No internet connection.');
//       return;
//     }
//     postOpinionMutation.mutate({ content: newOpinion });
//   };

//   // Handle Enter key for opinion submission
//   const handleOpinionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmitOpinion();
//     }
//   };

//   // Handle liking/unliking an opinion
//   const handleLikeOpinion = (opinionId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot like opinion: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(o => o.id === opinionId);
//     const isLiked = opinion?.likes.some(like => like.user_id === currentUser.id);
//     likeOpinionMutation.mutate({ opinionId, isLiked: !!isLiked });
//   };

//   // Handle disliking/undisliking an opinion
//   const handleDislikeOpinion = (opinionId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot dislike opinion: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(o => o.id === opinionId);
//     const isDisliked = opinion?.dislikes.some(dislike => dislike.user_id === currentUser.id);
//     dislikeOpinionMutation.mutate({ opinionId, isDisliked: !!isDisliked });
//   };

//   // Handle submitting a comment
//   const handleSubmitComment = (opinionId: string, parentCommentId?: string) => {
//     const key = opinionId + (parentCommentId || '');
//     const content = commentContent[key]?.trim();
//     if (!content || !isOnline) {
//       toast.error(isOnline ? 'Please enter a comment.' : 'Cannot post comment: No internet connection.');
//       return;
//     }
//     postCommentMutation.mutate({ opinionId, content, parentCommentId });
//     setCommentContent(prev => ({ ...prev, [key]: '' }));
//   };

//   // Handle Enter key for comment submission
//   const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, opinionId: string, parentCommentId?: string) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmitComment(opinionId, parentCommentId);
//     }
//   };

//   // Handle liking/unliking a comment
//   const handleLikeComment = (commentId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot like comment: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
//     const comment = opinion?.comments.find(c => c.id === commentId);
//     const isLiked = comment?.likes.includes(currentUser!.id);
//     likeCommentMutation.mutate({ commentId, isLiked: !!isLiked });
//   };

//   // Handle disliking/undisliking a comment
//   const handleDislikeComment = (commentId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot dislike comment: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
//     const comment = opinion?.comments.find(c => c.id === commentId);
//     const isDisliked = comment?.dislikes.includes(currentUser!.id);
//     dislikeCommentMutation.mutate({ commentId, isDisliked: !!isDisliked });
//   };

//   // Toggle comments visibility
//   const toggleComments = (opinionId: string) => {
//     setShowComments(prev => ({
//       ...prev,
//       [opinionId]: !prev[opinionId],
//     }));
//     if (!showComments[opinionId]) {
//       setCommentContent(prev => ({
//         ...prev,
//         [opinionId]: prev[opinionId] || '',
//       }));
//     }
//   };

//   // Render reaction picker
//   const renderReactionPicker = (targetId: string, isComment: boolean = false) => (
//     <Popover open={openReactionPopover === targetId} onOpenChange={(open) => setOpenReactionPopover(open ? targetId : null)}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors duration-200"
//         >
//           <Plus className="h-4 w-4" />
//           <span className="text-xs">React</span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-4" align="start">
//         <Tabs defaultValue="popular" className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="popular">Popular</TabsTrigger>
//             <TabsTrigger value="positive">Positive</TabsTrigger>
//             <TabsTrigger value="fun">Fun</TabsTrigger>
//             <TabsTrigger value="all">All</TabsTrigger>
//           </TabsList>
//           <TabsContent value="popular" className="mt-4">
//             <div className="grid grid-cols-5 gap-2">
//               {getPopularReactions().map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-10 w-10 p-0 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="positive" className="mt-4">
//             <div className="grid grid-cols-5 gap-2">
//               {reactions.filter(r => r.category === 'positive').map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-10 w-10 p-0 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="fun" className="mt-4">
//             <div className="grid grid-cols-5 gap-2">
//               {reactions.filter(r => r.category === 'fun').map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-10 w-10 p-0 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="all" className="mt-4">
//             <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
//               {reactions.map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-10 w-10 p-0 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </PopoverContent>
//     </Popover>
//   );

//   // Render reactions display
//   const renderReactionsDisplay = (reactions: OpinionReaction[] | CommentReaction[], targetId: string, isComment: boolean = false) => {
//     const groupedReactions = groupReactions(reactions);
//     if (groupedReactions.length === 0) return null;

//     return (
//       <div className="flex flex-wrap gap-1 mt-2">
//         {groupedReactions.map(({ emoji, count, reactions }) => {
//           const userReacted = reactions.some(r => r.user_id === currentUser?.id);
//           return (
//             <Button
//               key={emoji}
//               variant="ghost"
//               size="sm"
//               className={`flex items-center gap-1 h-6 px-2 text-xs rounded-full border transition-colors duration-200 ${
//                 userReacted
//                   ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
//                   : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
//               }`}
//               onClick={() => {
//                 if (isComment) {
//                   addCommentReactionMutation.mutate({ commentId: targetId, emoji });
//                 } else {
//                   addOpinionReactionMutation.mutate({ opinionId: targetId, emoji });
//                 }
//               }}
//             >
//               <span className="text-sm">{emoji}</span>
//               <span>{count}</span>
//             </Button>
//           );
//         })}
//       </div>
//     );
//   };

//   // Render comment with replies
//   const renderComment = (comment: Comment, opinionId: string, level: number = 0) => (
//     <div key={comment.id} className={`flex items-start gap-3 ${level > 0 ? 'ml-8' : ''} py-2`}>
//       <Avatar className="h-6 w-6">
//         <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.username || 'Unknown'} />
//         <AvatarFallback className="text-xs font-medium">{comment.user?.username?.[0] || 'U'}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <p className="text-sm font-semibold text-gray-900 dark:text-white">
//             {comment.user?.username || 'Unknown'}
//             {comment.user_id === currentUser?.id && ' (You)'}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
//           </p>
//         </div>
//         <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{comment.content}</p>
//         {level === 0 && (
//           <>
//             <div className="flex gap-4 mt-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleLikeComment(comment.id)}
//                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${comment.likes.includes(currentUser?.id || '') ? 'text-green-500' : ''}`}
//                 disabled={likeCommentMutation.isPending || !isOnline}
//               >
//                 <Heart className="h-4 w-4" fill={comment.likes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
//                 <span className="text-xs">{comment.likes.length || ''}</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleDislikeComment(comment.id)}
//                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${comment.dislikes.includes(currentUser?.id || '') ? 'text-red-500' : ''}`}
//                 disabled={dislikeCommentMutation.isPending || !isOnline}
//               >
//                 <ThumbsDown className="h-4 w-4" fill={comment.dislikes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
//                 <span className="text-xs">{comment.dislikes.length || ''}</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                 onClick={() => setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: prev[opinionId + comment.id] || '' }))}
//               >
//                 <MessageCircle className="h-4 w-4" />
//                 <span className="text-xs">{comment.replies ? comment.replies.length : ''}</span>
//               </Button>
//               {renderReactionPicker(comment.id, true)}
//             </div>
//             {renderReactionsDisplay(comment.reactions, comment.id, true)}
//             {commentContent[opinionId + comment.id] !== undefined && (
//               <div className="mt-3 flex gap-2">
//                 <Textarea
//                   value={commentContent[opinionId + comment.id] || ''}
//                   onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                     setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: e.target.value }))
//                   }
//                   onKeyDown={(e) => handleCommentKeyDown(e, opinionId, comment.id)}
//                   placeholder="Reply to this comment..."
//                   className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900"
//                   disabled={!isOnline}
//                 />
//                 <Button
//                   size="sm"
//                   onClick={() => handleSubmitComment(opinionId, comment.id)}
//                   className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200"
//                   disabled={postCommentMutation.isPending || !isOnline}
//                 >
//                   Reply
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-3 space-y-3 border-l border-gray-200 dark:border-gray-800 pl-4">
//             {comment.replies.map(reply => renderComment(reply, opinionId, level + 1))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-screen bg-gray-100 dark:bg-gray-950 flex flex-col font-sans">
//       <head>
//         <title>Opinions/Reports | Ultimi</title>
//         <meta name="description" content="Learn more about us." />
//       </head>
//       <header className=" flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
//         <h1 className="text-xl font-bold text-gray-900 dark:text-white">Opinions</h1>
//       </header>
//       <main className="flex-1 overflow-y-auto p-4" ref={opinionsContainerRef}>
//         <div className="max-w-3xl mx-auto">
//           {isLoadingOpinions ? (
//             <div className="space-y-4">
//               {[...Array(5)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-[120px] w-full rounded-lg shadow-sm" />
//               ))}
//             </div>
//           ) : opinions.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">No opinions yet. Be the first to share one!</p>
//           ) : (
//             <div className="space-y-6">
//               {groupedOpinions.map(group => (
//                 <div key={group.date} className="space-y-4">
//                   <div className="relative my-6 flex items-center justify-center">
//                     <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-950">
//                       {group.label}
//                     </span>
//                     <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
//                   </div>
//                   {group.opinions.map(opinion => (
//                     <Card
//                       key={opinion.id}
//                       data-opinion-id={opinion.id}
//                       className="border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md bg-white dark:bg-gray-900"
//                     >
//                       <CardContent className="p-4">
//                         <div className="flex items-start gap-4">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={opinion.user?.avatar_url || undefined} alt={opinion.user?.username || 'Unknown'} />
//                             <AvatarFallback className="text-sm font-medium">{opinion.user?.username?.[0] || 'U'}</AvatarFallback>
//                           </Avatar>
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2">
//                               <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                                 {opinion.user?.username || 'Unknown'}
//                                 {opinion.user_id === currentUser?.id && ' (You)'}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {formatDistanceToNow(new Date(opinion.created_at), { addSuffix: true })}
//                               </p>
//                             </div>
//                             <p className="text-lg text-gray-900 dark:text-white mt-2 leading-relaxed">{opinion.content}</p>
//                             <div className="flex gap-4 mt-4">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleLikeOpinion(opinion.id)}
//                                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${
//                                   opinion.likes.some(like => like.user_id === currentUser?.id) ? 'text-green-500' : ''
//                                 }`}
//                                 disabled={likeOpinionMutation.isPending || !isOnline}
//                               >
//                                 <Heart
//                                   className="h-4 w-4"
//                                   fill={opinion.likes.some(like => like.user_id === currentUser?.id) ? 'currentColor' : 'none'}
//                                 />
//                                 <span className="text-sm">{opinion.likes.length || ''}</span>
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleDislikeOpinion(opinion.id)}
//                                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${
//                                   opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'text-red-500' : ''
//                                 }`}
//                                 disabled={dislikeOpinionMutation.isPending || !isOnline}
//                               >
//                                 <ThumbsDown
//                                   className="h-4 w-4"
//                                   fill={opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'currentColor' : 'none'}
//                                 />
//                                 <span className="text-sm">{opinion.dislikes.length || ''}</span>
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => toggleComments(opinion.id)}
//                                 className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                               >
//                                 <MessageCircle className="h-4 w-4" />
//                                 <span className="text-sm">{opinion.comments.length || ''} {opinion.comments.length === 1 ? 'Comment' : 'Comments'}</span>
//                               </Button>
//                               {renderReactionPicker(opinion.id)}
//                             </div>
//                             {renderReactionsDisplay(opinion.reactions, opinion.id)}
//                             {showComments[opinion.id] && (
//                               <div className="mt-4">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => toggleComments(opinion.id)}
//                                   className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mb-2"
//                                 >
//                                   Show less
//                                 </Button>
// {opinion.comments.length > 0 && (
//   <AnimatePresence>
    
//     {showComments[opinion.id] && ( 
//       <motion.div
//         initial={{ opacity: 0, height: 0, marginTop: 0 }}
//                 animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
        
//         exit={{ opacity: 0, height: 0, marginTop: 0 }}
        
//         transition={{ duration: 0.35, ease: "easeInOut" }}
//         className="overflow-hidden space-y-3 border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-1"
//       >
//         {opinion.comments.map(comment => renderComment(comment, opinion.id))}
//       </motion.div>
//     )}
//   </AnimatePresence>
// )}
//                                 <div className="mt-4 flex gap-2">
//                                   <Textarea
//                                     value={commentContent[opinion.id] || ''}
//                                     onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                                       setCommentContent(prev => ({ ...prev, [opinion.id]: e.target.value }))
//                                     }
//                                     onKeyDown={(e) => handleCommentKeyDown(e, opinion.id)}
//                                     placeholder="Write a comment..."
//                                     className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900"
//                                     disabled={!isOnline}
//                                   />
//                                   <Button
//                                     size="sm"
//                                     onClick={() => handleSubmitComment(opinion.id)}
//                                     className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200"
//                                     disabled={postCommentMutation.isPending || !isOnline}
//                                   >
//                                     Post
//                                   </Button>
//                                 </div>
//                               </div>
//                             )}
//                             {!showComments[opinion.id] && opinion.comments.length > 0 && (
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => toggleComments(opinion.id)}
//                                 className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mt-2"
//                               >
//                                 Show {opinion.comments.length} {opinion.comments.length === 1 ? 'comment' : 'comments'}
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 pb-[25px] sm:pb-[0px]">
//         <div className="max-w-3xl mx-auto flex gap-2">
//           <Textarea
//             value={newOpinion}
//             onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewOpinion(e.target.value)}
//             onKeyDown={handleOpinionKeyDown}
//             placeholder="Share your opinion..."
//             className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900"
//             disabled={!isOnline}
//           />
//           <Button
//             size="sm"
//             onClick={handleSubmitOpinion}
//             className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200"
//             disabled={postOpinionMutation.isPending || !newOpinion.trim() || !isOnline}
//           >
//             Post
//           </Button>
//         </div>
//       </footer>
//       {showScrollButton && (
//         <div className="fixed bottom-40 right-4 sm:bottom-20">
//           <Button
//             size="icon"
//             variant="secondary"
//             onClick={scrollToBottom}
//             className="rounded-full  bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             <ArrowDown className="h-6 w-6" />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { ArrowDown, Heart, MessageCircle, ThumbsDown, Plus, SmilePlus } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
// import { Card, CardContent } from '@/components/ui/card';
// import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
// import {
//   UseMutationResult,
//   UseQueryResult,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
// import { getCurrentUser, supabase } from '@/lib/supabaseClient';
// import { Button } from '@/components/ui/button';
// import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
// import { Skeleton } from '@/components/ui/skeleton';
// import Textarea from '@/components/ui/textarea';
// import { toast } from 'sonner';
// import { reactions, getPopularReactions } from '@/lib/reactions';
//  import { motion, AnimatePresence } from 'framer-motion';

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/ popover';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // Define interfaces
// interface User {
//   username: string;
//   avatar_url?: string | null;
// }



// interface OpinionReaction {
//   id: string;
//   opinion_id: string;
//   user_id: string;
//   emoji: string;
//   created_at: string;
// }

// interface CommentReaction {
//   id: string;
//   comment_id: string;
//   user_id: string;
//   emoji: string;
//   created_at: string;
// }


// interface Comment {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
//   reactions: CommentReaction[];
//   user: User | null;
//   replies?: Comment[];
// }

// interface Opinion {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   updated_at: string;
//   user: User | null;
//   likes: { user_id: string }[];
//   dislikes: { user_id: string }[];
//   reactions: OpinionReaction[];
//   comments: Comment[];
// }

// interface OpinionPayload {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   updated_at: string;
// }

// interface CommentPayload {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   opinion_id: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
// }

// interface LikeDislikePayload {
//   opinion_id?: string;
//   comment_id?: string;
//   user_id: string;
// }

// interface SupabaseUser {
//   username: string;
//   avatar_url?: string | null;
// }

// interface SupabaseComment {
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
//   parent_comment_id?: string | null;
//   likes: string[];
//   dislikes: string[];
//   reactions: CommentReaction[];
//   user: SupabaseUser | null;
// }

// interface CurrentUser {
//   id: string;
//   username?: string;
//   avatar_url?: string | null;
// }

// interface GroupedOpinions {
//   date: string;
//   label: string;
//   opinions: Opinion[];
// }

// // Helper function for mutual exclusivity in Supabase
// const ensureMutualExclusivity = async (
//   table: 'opinion_likes' | 'opinion_dislikes' | 'opinion_comments',
//   idField: 'opinion_id' | 'comment_id',
//   idValue: string,
//   userId: string,
//   isLike: boolean
// ) => {
//   if (table === 'opinion_comments') {
//     const { data: comment, error: fetchError } = await supabase
//       .from('opinion_comments')
//       .select('likes, dislikes')
//       .eq('id', idValue)
//       .single();
//     if (fetchError || !comment) {
//       console.error('Error fetching comment:', fetchError);
//       throw new Error('Failed to fetch comment.');
//     }

//     const updatedLikes = isLike
//       ? comment.likes.includes(userId)
//         ? comment.likes.filter((id: string) => id !== userId)
//         : [...comment.likes, userId]
//       : comment.likes.filter((id: string) => id !== userId);
//     const updatedDislikes = !isLike
//       ? comment.dislikes.includes(userId)
//         ? comment.dislikes.filter((id: string) => id !== userId)
//         : [...comment.dislikes, userId]
//       : comment.dislikes.filter((id: string) => id !== userId);

//     const { error: updateError } = await supabase
//       .from('opinion_comments')
//       .update({ likes: updatedLikes, dislikes: updatedDislikes })
//       .eq('id', idValue);
//     if (updateError) {
//       console.error(`Error updating comment ${isLike ? 'likes' : 'dislikes'}:`, updateError);
//       throw new Error(`Failed to update comment ${isLike ? 'likes' : 'dislikes'}.`);
//     }
//   } else {
//     const oppositeTable = table === 'opinion_likes' ? 'opinion_dislikes' : 'opinion_likes';
//     const [deleteResult, insertResult] = await Promise.all([
//       supabase
//         .from(oppositeTable)
//         .delete()
//         .eq(idField, idValue)
//         .eq('user_id', userId),
//       supabase
//         .from(table)
//         .upsert([{ [idField]: idValue, user_id: userId }], { onConflict: `${idField},user_id` }),
//     ]);

//     if (deleteResult.error) {
//       console.error(`Error removing from ${oppositeTable}:`, deleteResult.error);
//       throw new Error(`Failed to remove ${isLike ? 'dislike' : 'like'}.`);
//     }
//     if (insertResult.error) {
//       console.error(`Error adding to ${table}:`, insertResult.error);
//       throw new Error(`Failed to ${isLike ? 'like' : 'dislike'}.`);
//     }
//   }
// };

// // Helper to nest comments
// const nestComments = (comments: SupabaseComment[]): Comment[] => {
//   const commentMap = new Map<string, Comment>();
//   const topLevel: Comment[] = [];

//   comments.forEach(comment => {
//     const typedComment: Comment = {
//       ...comment,
//       replies: [],
//       reactions: comment.reactions || [],
//       user: comment.user || { username: 'Unknown', avatar_url: null },
//     };
//     commentMap.set(comment.id, typedComment);
//   });

//   comments.forEach(comment => {
//     if (comment.parent_comment_id) {
//       const parent = commentMap.get(comment.parent_comment_id);
//       if (parent) {
//         parent.replies = parent.replies || [];
//         parent.replies.push({
//           ...comment,
//           replies: [],
//           reactions: comment.reactions || [],
//           user: comment.user || { username: 'Unknown', avatar_url: null },
//         });
//       }
//     } else {
//       topLevel.push(commentMap.get(comment.id)!);
//     }
//   });

//   return topLevel;
// };

// // Group reactions by emoji
// const groupReactions = (reactions: OpinionReaction[] | CommentReaction[]) => {
//   const grouped = reactions.reduce((acc, reaction) => {
//     if (!acc[reaction.emoji]) {
//       acc[reaction.emoji] = [];
//     }
//     acc[reaction.emoji].push(reaction);
//     return acc;
//   }, {} as Record<string, (OpinionReaction | CommentReaction)[]>);

//   return Object.entries(grouped)
//     .map(([emoji, reactions]) => ({ emoji, count: reactions.length, reactions }))
//     .sort((a, b) => b.count - a.count);
// };

// export default function Opinions() {
//   const [newOpinion, setNewOpinion] = useState<string>('');
//   const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [isOnline, setIsOnline] = useState<boolean>(true);
//   const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
//   const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);
//   const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
//   const [openReactionPopover, setOpenReactionPopover] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const opinionsContainerRef = useRef<HTMLDivElement>(null);

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

//   // Track scroll position for auto-scroll and button visibility
//   useEffect(() => {
//     const container = opinionsContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
//       setShouldAutoScroll(isNearBottom);
//       setShowScrollButton(!isNearBottom);
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const user: CurrentUser | null = await getCurrentUser();
//         setCurrentUser(user || null);
//       } catch (error: unknown) {
//         console.error('Error fetching current user:', error);
//         toast.error('Failed to load current user.');
//       }
//     };
//     fetchCurrentUser();
//   }, []);

//   // Fetch opinions
//   const { data: opinions = [], isLoading: isLoadingOpinions }: UseQueryResult<Opinion[], Error> = useQuery({
//     queryKey: ['opinions'],
//     queryFn: async (): Promise<Opinion[]> => {
//       const { data, error } = await supabase
//         .from('opinions')
//         .select(
//           `
//           id, user_id, content, created_at, updated_at,
//           user:profiles!opinions_user_id_fkey(username, avatar_url),
//           likes:opinion_likes(user_id),
//           dislikes:opinion_dislikes(user_id),
//           reactions:opinion_reactions(id, user_id, emoji, created_at),
//           comments:opinion_comments(
//             id, user_id, content, created_at, parent_comment_id, likes, dislikes,
//             reactions:comment_reactions(id, user_id, emoji, created_at),
//             user:profiles!opinion_comments_user_id_fkey(username, avatar_url)
//           )
//         `
//         )
//         .order('created_at', { ascending: true });
//       if (error) {
//         console.error('Error fetching opinions:', error);
//         throw new Error('Failed to load opinions.');
//       }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const nestedData = ((data as any[]) || []).map(opinion => ({
//         ...opinion,
//         user: opinion.user || { username: 'Unknown', avatar_url: null },
//         reactions: opinion.reactions || [],
//         comments: nestComments(opinion.comments || []),
//       }));
//       return nestedData as Opinion[];
//     },
//     enabled: isOnline,
//     retry: 2,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Group opinions by date
//   const groupedOpinions: GroupedOpinions[] = opinions.reduce(
//     (acc: GroupedOpinions[], opinion) => {
//       const date = new Date(opinion.created_at);
//       let label: string;
//       if (isToday(date)) {
//         label = 'Today';
//       } else if (isYesterday(date)) {
//         label = 'Yesterday';
//       } else {
//         label = format(date, 'MMMM d, yyyy');
//       }
//       const existingGroup = acc.find(group => group.date === label);
//       if (existingGroup) {
//         existingGroup.opinions.push(opinion);
//       } else {
//         acc.push({ date: label, label, opinions: [opinion] });
//       }
//       return acc;
//     },
//     []
//   );

//   // Scroll to the most recent opinion or bottom
//   const scrollToBottom = () => {
//     if (opinionsContainerRef.current) {
//       if (opinions.length > 0) {
//         const lastOpinion = opinionsContainerRef.current.querySelector(
//           `[data-opinion-id="${opinions[opinions.length - 1].id}"]`
//         );
//         if (lastOpinion) {
//           lastOpinion.scrollIntoView({ behavior: 'smooth' });
//           return;
//         }
//       }
//       opinionsContainerRef.current.scrollTop = opinionsContainerRef.current.scrollHeight;
//     }
//   };

//   // Auto-scroll on new content if near bottom
//   const autoScrollOnNewContent = () => {
//     if (shouldAutoScroll) {
//       scrollToBottom();
//     }
//   };

//   // Trigger auto-scroll on new opinions/comments
//   useEffect(() => {
//     if (opinions.length > 0) {
//       autoScrollOnNewContent();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps 
//   }, [opinions]);

//   // Handle incoming opinion
//   const handleIncomingOpinion = async (payload: { new: OpinionPayload }) => {
//     if (!isOnline || payload.new.user_id === currentUser?.id) return;

//     const { data: userData, error: userError } = await supabase
//       .from('profiles')
//       .select('username, avatar_url')
//       .eq('id', payload.new.user_id)
//       .single();

//     if (userError || !userData) {
//       console.error('Error fetching user for opinion:', userError);
//       toast.error('Failed to load user profile.');
//       return;
//     }

//     const newOpinion: Opinion = {
//       ...payload.new,
//       user: userData,
//       likes: [],
//       dislikes: [],
//       reactions: [],
//       comments: [],
//     };

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return [newOpinion];
//       if (old.some(op => op.id === newOpinion.id)) return old;
//       const updated = [...old, newOpinion];
//       setTimeout(autoScrollOnNewContent, 100);
//       return updated;
//     });
//   };

//   // Handle incoming opinion like
//   const handleIncomingOpinionLike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (payload.new && op.id === payload.new.opinion_id) {
//           if (op.likes.some(l => l.user_id === payload.new!.user_id)) return op;
//           return {
//             ...op,
//             likes: [...op.likes, { user_id: payload.new!.user_id }],
//             dislikes: op.dislikes.filter(d => d.user_id !== payload.new!.user_id),
//           };
//         }
//         if (payload.old && op.id === payload.old.opinion_id) {
//           return {
//             ...op,
//             likes: op.likes.filter(l => l.user_id !== payload.old!.user_id),
//           };
//         }
//         return op;
//       });
//       return updated;
//     });
//   };

//   // Handle incoming opinion dislike
//   const handleIncomingOpinionDislike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (payload.new && op.id === payload.new.opinion_id) {
//           if (op.dislikes.some(d => d.user_id === payload.new!.user_id)) return op;
//           return {
//             ...op,
//             dislikes: [...op.dislikes, { user_id: payload.new!.user_id }],
//             likes: op.likes.filter(l => l.user_id !== payload.new!.user_id),
//           };
//         }
//         if (payload.old && op.id === payload.old.opinion_id) {
//           return {
//             ...op,
//             dislikes: op.dislikes.filter(d => d.user_id !== payload.old!.user_id),
//           };
//         }
//         return op;
//       });
//       return updated;
//     });
//   };

//   // Handle incoming comment
//   const handleIncomingComment = async (payload: { new: CommentPayload }) => {
//     if (!isOnline || payload.new.user_id === currentUser?.id) return;

//     const { data: userData } = await supabase
//       .from('profiles')
//       .select('username, avatar_url')
//       .eq('id', payload.new.user_id)
//       .single();

//     const newComment: Comment = {
//       ...payload.new,
//       user: userData || { username: 'Unknown', avatar_url: null },
//       likes: payload.new.likes || [],
//       dislikes: payload.new.dislikes || [],
//       reactions: [],
//       parent_comment_id: payload.new.parent_comment_id,
//     };

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (op.id !== payload.new.opinion_id) return op;
//         const comments = nestComments([...op.comments, newComment]);
//         return { ...op, comments };
//       });
//       setTimeout(autoScrollOnNewContent, 100);
//       return updated;
//     });
//   };

//   // Handle incoming comment like/dislike
//   const handleIncomingCommentLikeDislike = (payload: { new?: CommentPayload; old?: CommentPayload }) => {
//     const userId = payload.new?.user_id || payload.old?.user_id;
//     if (!isOnline || userId === currentUser?.id) return;

//     queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//       if (!old) return old;
//       const updated = old.map(op => {
//         if (op.id !== (payload.new?.opinion_id || payload.old?.opinion_id)) return op;
//         const comments = op.comments.map(c => {
//           if (c.id !== (payload.new?.id || payload.old?.id)) return c;
//           return {
//             ...c,
//             likes: payload.new ? payload.new.likes : c.likes,
//             dislikes: payload.new ? payload.new.dislikes : c.dislikes,
//           };
//         });
//         return { ...op, comments: nestComments(comments) };
//       });
//       return updated;
//     });
//   };

//   // Subscribe to real-time changes
//   useEffect(() => {
//     if (!isOnline || !currentUser?.id) return;

//     const opinionsChannel = supabase
//       .channel('opinions')
//       .on('postgres_changes' , { event: 'INSERT', schema: 'public', table: 'opinions' }, handleIncomingOpinion )
//       .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//         if (err) toast.error('Failed to subscribe to opinions.');
//       });

//     const likesChannel = supabase
//       .channel('opinion_likes')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'opinion_likes' }, handleIncomingOpinionLike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void)
//       .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//         if (err) toast.error('Failed to subscribe to likes.');
//       });

//     // const dislikesChannel = supabase
//     //   .channel('opinion_dislikes')
//     //   .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'opinion_dislikes' }, handleIncomingOpinionDislike)
//     //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     //     if (err) toast.error('Failed to subscribe to dislikes.');
//     //   });
//     const dislikesChannel = supabase
//     .channel('opinion_dislikes')
//     .on(
//       'postgres_changes',
//       { event: '*', schema: 'public', table: 'opinion_dislikes' },
//       handleIncomingOpinionDislike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void
//     )
//     .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//       if (err) toast.error('Failed to subscribe to dislikes.');
//     });

//     // const commentsChannel = supabase
//     //   .channel('opinion_comments')
//     //   .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table: 'opinion_comments' }, handleIncomingComment)
//     //   .on('postgres_changes' as any, { event: 'UPDATE', schema: 'public', table: 'opinion_comments' }, handleIncomingCommentLikeDislike)
//     //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     //     if (err) toast.error('Failed to subscribe to comments.');
//     //   });
//     const commentsChannel = supabase
//   .channel('opinion_comments')
//   .on(
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'opinion_comments' },
//     handleIncomingComment as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
//   )
//   .on(
//     'postgres_changes',
//     { event: 'UPDATE', schema: 'public', table: 'opinion_comments' },
//     handleIncomingCommentLikeDislike as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
//   )
//   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
//     if (err) toast.error('Failed to subscribe to comments.');
//   });

//     return () => {
//       supabase.removeChannel(opinionsChannel);
//       supabase.removeChannel(likesChannel);
//       supabase.removeChannel(dislikesChannel);
//       supabase.removeChannel(commentsChannel);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOnline, currentUser, queryClient]);

//   // Post opinion mutation
//   const postOpinionMutation: UseMutationResult<Opinion, Error, { content: string }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ content }: { content: string }): Promise<Opinion> => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser.id)
//           .single();
//         if (userError || !userData) {
//           throw new Error('Failed to fetch user profile.');
//         }
//         const { data: insertedOpinion, error } = await supabase
//           .from('opinions')
//           .insert({ user_id: currentUser.id, content })
//           .select(
//             `
//             id, user_id, content, created_at, updated_at,
//             user:profiles!opinions_user_id_fkey(username, avatar_url),
//             likes:opinion_likes(user_id),
//             dislikes:opinion_dislikes(user_id),
//             reactions:opinion_reactions(id, user_id, emoji, created_at),
//             comments:opinion_comments(id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url))
//           `
//           )
//           .single();
//         if (error || !insertedOpinion) {
//           throw new Error('Failed to post opinion.');
//         }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         function normalizeComments(rawComments: any[]): SupabaseComment[] {
//           return (rawComments ?? []).map((c) => ({
//             id: c.id,
//             user_id: c.user_id,
//             content: c.content,
//             created_at: c.created_at,
//             parent_comment_id: c.parent_comment_id ?? null,
//             likes: c.likes ?? [],
//             dislikes: c.dislikes ?? [],
//             reactions: c.reactions ?? [],
//             user: c.user?.[0] || { username: 'Unknown', avatar_url: null },
//           }));
//         }

//         return {
//           ...insertedOpinion,
//           user: insertedOpinion.user?.[0] || { username: 'Unknown', avatar_url: null },
//           reactions: insertedOpinion.reactions || [],
//           comments: nestComments(normalizeComments(insertedOpinion.comments || [])),
//         } as Opinion;
//       },
//       onMutate: async ({ content }: { content: string }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         const { data: userData } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser?.id)
//           .single();
//         const tempOpinion: Opinion = {
//           id: `temp-${Date.now()}`,
//           user_id: currentUser!.id,
//           content,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//           user: userData || { username: 'Unknown', avatar_url: null },
//           likes: [],
//           dislikes: [],
//           reactions: [],
//           comments: [],
//         };
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = [...(old || []), tempOpinion];
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, _vars, context) => {
//         toast.error(err.message || 'Failed to post opinion.');
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (insertedOpinion: Opinion) => {
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old
//             ? old.filter(op => !op.id.startsWith('temp-')).concat(insertedOpinion)
//             : [insertedOpinion];
//           setTimeout(autoScrollOnNewContent, 100);
//           return updated;
//         });
//         toast.success('Opinion posted!');
//         setNewOpinion('');
//       },
//     });

//   // Like/unlike opinion mutation
//   const likeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_likes', 'opinion_id', opinionId, currentUser.id, !isLiked);
//       },
//       onMutate: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op =>
//             op.id === opinionId
//               ? {
//                   ...op,
//                   likes: isLiked
//                     ? op.likes.filter(l => l.user_id !== currentUser!.id)
//                     : [...op.likes, { user_id: currentUser!.id }],
//                   dislikes: isLiked ? op.dislikes : op.dislikes.filter(d => d.user_id !== currentUser!.id),
//                 }
//               : op
//           );
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isLiked }, context) => {
//         toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} opinion.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isLiked }: { opinionId: string; isLiked: boolean }) => {
//         toast.success(isLiked ? 'Opinion unliked!' : 'Opinion liked!');
//       },
//     });

//   // Dislike/undislike opinion mutation
//   const dislikeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId }: { opinionId: string; isDisliked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_dislikes', 'opinion_id', opinionId, currentUser.id, false);
//       },
//       onMutate: async ({ opinionId, isDisliked }: { opinionId: string; isDisliked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op =>
//             op.id === opinionId
//               ? {
//                   ...op,
//                   dislikes: isDisliked
//                     ? op.dislikes.filter(d => d.user_id !== currentUser!.id)
//                     : [...op.dislikes, { user_id: currentUser!.id }],
//                   likes: isDisliked ? op.likes : op.likes.filter(l => l.user_id !== currentUser!.id),
//                 }
//               : op
//           );
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isDisliked }, context) => {
//         toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} opinion.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isDisliked }: { opinionId: string; isDisliked: boolean }) => {
//         toast.success(isDisliked ? 'Opinion undisliked!' : 'Opinion disliked!');
//       },
//     });

//   // Add reaction to opinion mutation
//   const addOpinionReactionMutation = useMutation({
//     mutationFn: async ({ opinionId, emoji }: { opinionId: string; emoji: string }) => {
//       if (!currentUser?.id || !isOnline) {
//         throw new Error('User not authenticated or offline.');
//       }

//       // Check if user already reacted with this emoji
//       const { data: existingReaction } = await supabase
//         .from('opinion_reactions')
//         .select('id')
//         .eq('opinion_id', opinionId)
//         .eq('user_id', currentUser.id)
//         .eq('emoji', emoji)
//         .single();

//       if (existingReaction) {
//         // Remove reaction
//         const { error } = await supabase
//           .from('opinion_reactions')
//           .delete()
//           .eq('id', existingReaction.id);
//         if (error) throw new Error('Failed to remove reaction.');
//       } else {
//         // Add reaction
//         const { error } = await supabase
//           .from('opinion_reactions')
//           .insert({
//             opinion_id: opinionId,
//             user_id: currentUser.id,
//             emoji,
//           });
//         if (error) throw new Error('Failed to add reaction.');
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['opinions'] });
//       setOpenReactionPopover(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update reaction.');
//     },
//   });

//   // Add reaction to comment mutation
//   const addCommentReactionMutation = useMutation({
//     mutationFn: async ({ commentId, emoji }: { commentId: string; emoji: string }) => {
//       if (!currentUser?.id || !isOnline) {
//         throw new Error('User not authenticated or offline.');
//       }

//       // Check if user already reacted with this emoji
//       const { data: existingReaction } = await supabase
//         .from('comment_reactions')
//         .select('id')
//         .eq('comment_id', commentId)
//         .eq('user_id', currentUser.id)
//         .eq('emoji', emoji)
//         .single();

//       if (existingReaction) {
//         // Remove reaction
//         const { error } = await supabase
//           .from('comment_reactions')
//           .delete()
//           .eq('id', existingReaction.id);
//         if (error) throw new Error('Failed to remove reaction.');
//       } else {
//         // Add reaction
//         const { error } = await supabase
//           .from('comment_reactions')
//           .insert({
//             comment_id: commentId,
//             user_id: currentUser.id,
//             emoji,
//           });
//         if (error) throw new Error('Failed to add reaction.');
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['opinions'] });
//       setOpenReactionPopover(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update reaction.');
//     },
//   });

//   // Post comment mutation
//   const postCommentMutation: UseMutationResult<Comment, Error, { opinionId: string; content: string; parentCommentId?: string }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }): Promise<Comment> => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser.id)
//           .single();
//         if (userError || !userData) {
//           throw new Error('Failed to fetch user profile.');
//         }
//         const { data: insertedComment, error } = await supabase
//           .from('opinion_comments')
//           .insert({
//             opinion_id: opinionId,
//             user_id: currentUser.id,
//             content,
//             parent_comment_id: parentCommentId,
//             likes: [],
//             dislikes: [],
//           })
//           .select(
//             'id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url)'
//           )
//           .single();
//         if (error || !insertedComment) {
//           throw new Error('Failed to post comment.');
//         }
//         return {
//           ...insertedComment,
//           reactions: insertedComment.reactions || [],
//           user: userData || { username: 'Unknown', avatar_url: null },
//         } as Comment;
//       },
//       onMutate: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         const { data: userData } = await supabase
//           .from('profiles')
//           .select('username, avatar_url')
//           .eq('id', currentUser?.id)
//           .single();
//         const tempComment: Comment = {
//           id: `temp-${Date.now()}`,
//           user_id: currentUser!.id,
//           content,
//           created_at: new Date().toISOString(),
//           user: userData || { username: 'Unknown', avatar_url: null },
//           likes: [],
//           dislikes: [],
//           reactions: [],
//           parent_comment_id: parentCommentId,
//           replies: [],
//         };
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => {
//             if (op.id !== opinionId) return op;
//             let comments = [...op.comments];
//             if (parentCommentId) {
//               comments = comments.map(c =>
//                 c.id === parentCommentId
//                   ? { ...c, replies: [...(c.replies || []), tempComment] }
//                   : c
//               );
//             } else {
//               comments.push(tempComment);
//             }
//             return { ...op, comments: nestComments(comments) };
//           });
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err, _variables, context) => {
//         toast.error(err.message || 'Failed to post comment.');
//         if (context?.previousOpinions) {
//           queryClient.setQueryData(['opinions'], context.previousOpinions);
//         }
//       },
//       onSuccess: (insertedComment: Comment, { opinionId, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => {
//             if (op.id !== opinionId) return op;
//             let comments = [...op.comments].filter(c => !c.id.startsWith('temp-'));
//             if (parentCommentId) {
//               comments = comments.map(c =>
//                 c.id === parentCommentId
//                   ? {
//                       ...c,
//                       replies: [...(c.replies || []).filter(r => !r.id.startsWith('temp-')), insertedComment],
//                     }
//                   : c
//               );
//             } else {
//               comments.push(insertedComment);
//             }
//             return { ...op, comments: nestComments(comments) };
//           });
//           setTimeout(autoScrollOnNewContent, 100);
//           return updated;
//         });
//         toast.success('Comment posted!');
//       },
//     });

//   // Like/unlike comment mutation
//   const likeCommentMutation: UseMutationResult<void, Error, { commentId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, !isLiked);
//       },
//       onMutate: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => ({
//             ...op,
//             comments: nestComments(
//               op.comments.map(c =>
//                 c.id === commentId
//                   ? {
//                       ...c,
//                       likes: isLiked ? c.likes.filter(id => id !== currentUser!.id) : [...c.likes, currentUser!.id],
//                       dislikes: isLiked ? c.dislikes : c.dislikes.filter(id => id !== currentUser!.id),
//                     }
//                   : c
//               )
//             ),
//           }));
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isLiked }, context) => {
//         toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} comment.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isLiked }: { commentId: string; isLiked: boolean }) => {
//         toast.success(isLiked ? 'Comment unliked!' : 'Comment liked!');
//       },
//     });

//   // Dislike/undislike comment mutation
//   const dislikeCommentMutation: UseMutationResult<void, Error, { commentId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
//     useMutation({
//       mutationFn: async ({ commentId }: { commentId: string; isDisliked: boolean }) => {
//         if (!currentUser?.id || !isOnline) {
//           throw new Error('User not authenticated or offline.');
//         }
//         await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, false);
//       },
//       onMutate: async ({ commentId, isDisliked }: { commentId: string; isDisliked: boolean }) => {
//         await queryClient.cancelQueries({ queryKey: ['opinions'] });
//         const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
//         queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
//           const updated = old?.map(op => ({
//             ...op,
//             comments: nestComments(
//               op.comments.map(c =>
//                 c.id === commentId
//                   ? {
//                       ...c,
//                       dislikes: isDisliked
//                         ? c.dislikes.filter(id => id !== currentUser!.id)
//                         : [...c.dislikes, currentUser!.id],
//                       likes: isDisliked ? c.likes : c.likes.filter(id => id !== currentUser!.id),
//                     }
//                   : c
//               )
//             ),
//           }));
//           return updated;
//         });
//         return { previousOpinions };
//       },
//       onError: (err: Error, { isDisliked }, context) => {
//         toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} comment.`);
//         queryClient.setQueryData(['opinions'], context?.previousOpinions);
//       },
//       onSuccess: (_: void, { isDisliked }: { commentId: string; isDisliked: boolean }) => {
//         toast.success(isDisliked ? 'Comment undisliked!' : 'Comment disliked!');
//       },
//     });

//   // Handle submitting a new opinion
//   const handleSubmitOpinion = () => {
//     if (!newOpinion.trim() || !isOnline) {
//       toast.error(isOnline ? 'Please enter an opinion.' : 'Cannot post opinion: No internet connection.');
//       return;
//     }
//     postOpinionMutation.mutate({ content: newOpinion });
//   };

//   // Handle Enter key for opinion submission
//   const handleOpinionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmitOpinion();
//     }
//   };

//   // Handle liking/unliking an opinion
//   const handleLikeOpinion = (opinionId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot like opinion: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(o => o.id === opinionId);
//     const isLiked = opinion?.likes.some(like => like.user_id === currentUser.id);
//     likeOpinionMutation.mutate({ opinionId, isLiked: !!isLiked });
//   };

//   // Handle disliking/undisliking an opinion
//   const handleDislikeOpinion = (opinionId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot dislike opinion: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(o => o.id === opinionId);
//     const isDisliked = opinion?.dislikes.some(dislike => dislike.user_id === currentUser.id);
//     dislikeOpinionMutation.mutate({ opinionId, isDisliked: !!isDisliked });
//   };

//   // Handle submitting a comment
//   const handleSubmitComment = (opinionId: string, parentCommentId?: string) => {
//     const key = opinionId + (parentCommentId || '');
//     const content = commentContent[key]?.trim();
//     if (!content || !isOnline) {
//       toast.error(isOnline ? 'Please enter a comment.' : 'Cannot post comment: No internet connection.');
//       return;
//     }
//     postCommentMutation.mutate({ opinionId, content, parentCommentId });
//     setCommentContent(prev => ({ ...prev, [key]: '' }));
//   };

//   // Handle Enter key for comment submission
//   const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, opinionId: string, parentCommentId?: string) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmitComment(opinionId, parentCommentId);
//     }
//   };

//   // Handle liking/unliking a comment
//   const handleLikeComment = (commentId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot like comment: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
//     const comment = opinion?.comments.find(c => c.id === commentId);
//     const isLiked = comment?.likes.includes(currentUser!.id);
//     likeCommentMutation.mutate({ commentId, isLiked: !!isLiked });
//   };

//   // Handle disliking/undisliking a comment
//   const handleDislikeComment = (commentId: string) => {
//     if (!currentUser?.id || !isOnline) {
//       toast.error('Cannot dislike comment: No internet connection or not logged in.');
//       return;
//     }
//     const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
//     const comment = opinion?.comments.find(c => c.id === commentId);
//     const isDisliked = comment?.dislikes.includes(currentUser!.id);
//     dislikeCommentMutation.mutate({ commentId, isDisliked: !!isDisliked });
//   };

//   // Toggle comments visibility
//   const toggleComments = (opinionId: string) => {
//     setShowComments(prev => ({
//       ...prev,
//       [opinionId]: !prev[opinionId],
//     }));
//     if (!showComments[opinionId]) {
//       setCommentContent(prev => ({
//         ...prev,
//         [opinionId]: prev[opinionId] || '',
//       }));
//     }
//   };

//   // Render reaction picker
//   const renderReactionPicker = (targetId: string, isComment: boolean = false) => (
//     <Popover open={openReactionPopover === targetId} onOpenChange={(open) => setOpenReactionPopover(open ? targetId : null)}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors duration-200"
//         >
//           {/* <Plus className="h-4 w-4" />
//           <span className="text-xs">React</span> */}
//             <motion.div whileHover={{ scale: 1.5 }}>
//               <SmilePlus  scale={1} />
//             </motion.div> 
//       </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full max-w-[320px] p-2 sm:w-80 sm:p-4" align="start">
//         <Tabs defaultValue="popular" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
//             <TabsTrigger value="popular">Popular</TabsTrigger>
//             <TabsTrigger value="positive">Positive</TabsTrigger>
//             <TabsTrigger value="fun">Fun</TabsTrigger>
//             <TabsTrigger value="all">All</TabsTrigger>
//           </TabsList>
//           <TabsContent value="popular" className="mt-2 sm:mt-4">
//             <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
//               {getPopularReactions().map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="positive" className="mt-2 sm:mt-4">
//             <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
//               {reactions.filter(r => r.category === 'positive').map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="fun" className="mt-2 sm:mt-4">
//             <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
//               {reactions.filter(r => r.category === 'fun').map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="all" className="mt-2 sm:mt-4">
//             <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
//               {reactions.map((reaction) => (
//                 <Button
//                   key={reaction.emoji}
//                   variant="ghost"
//                   size="sm"
//                   className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
//                   onClick={() => {
//                     if (isComment) {
//                       addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
//                     } else {
//                       addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
//                     }
//                   }}
//                   title={reaction.name}
//                 >
//                   {reaction.emoji}
//                 </Button>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </PopoverContent>
//     </Popover>
//   );

//   // Render reactions display
//   const renderReactionsDisplay = (reactions: OpinionReaction[] | CommentReaction[], targetId: string, isComment: boolean = false) => {
//     const groupedReactions = groupReactions(reactions);
//     if (groupedReactions.length === 0) return null;

//     return (
//       <div className="flex flex-wrap gap-1 mt-2">
//         {groupedReactions.map(({ emoji, count, reactions }) => {
//           const userReacted = reactions.some(r => r.user_id === currentUser?.id);
//           return (
//             <Button
//               key={emoji}
//               variant="ghost"
//               size="sm"
//               className={`flex items-center gap-1 h-6 px-2 text-xs rounded-full border transition-colors duration-200 ${
//                 userReacted
//                   ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
//                   : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
//               }`}
//               onClick={() => {
//                 if (isComment) {
//                   addCommentReactionMutation.mutate({ commentId: targetId, emoji });
//                 } else {
//                   addOpinionReactionMutation.mutate({ opinionId: targetId, emoji });
//                 }
//               }}
//             >
//               <span className="text-sm">{emoji}</span>
//               <span>{count}</span>
//             </Button>
//           );
//         })}
//       </div>
//     );
//   };

//   // Render comment with replies
//   const renderComment = (comment: Comment, opinionId: string, level: number = 0) => (
//     <div key={comment.id} className={`flex items-start gap-2 sm:gap-3 ${level > 0 ? 'ml-4 sm:ml-8' : ''} py-2`}>
//       <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
//         <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.username || 'Unknown'} />
//         <AvatarFallback className="text-xs font-medium">{comment.user?.username || 'U'}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//             {comment.user?.username || 'Unknown'}
//             {comment.user_id === currentUser?.id && ' (You)'}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
//           </p>
//         </div>
//         <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{comment.content}</p>
//         {level === 0 && (
//           <>
//             <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleLikeComment(comment.id)}
//                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${comment.likes.includes(currentUser?.id || '') ? 'text-green-500' : ''}`}
//                 disabled={likeCommentMutation.isPending || !isOnline}
//               >
//                 <Heart className="h-4 w-4" fill={comment.likes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
//                 <span className="text-xs">{comment.likes.length || ''}</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleDislikeComment(comment.id)}
//                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${comment.dislikes.includes(currentUser?.id || '') ? 'text-red-500' : ''}`}
//                 disabled={dislikeCommentMutation.isPending || !isOnline}
//               >
//                 <ThumbsDown className="h-4 w-4" fill={comment.dislikes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
//                 <span className="text-xs">{comment.dislikes.length || ''}</span>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                 onClick={() => setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: prev[opinionId + comment.id] || '' }))}
//               >
//                 <MessageCircle className="h-4 w-4" />
//                 <span className="text-xs">{comment.replies ? comment.replies.length : ''}</span>
//               </Button>
//               {renderReactionPicker(comment.id, true)}
//             </div>
//             {renderReactionsDisplay(comment.reactions, comment.id, true)}
//             {commentContent[opinionId + comment.id] !== undefined && (
//               <div className="mt-3 flex flex-col sm:flex-row gap-2">
//                 <Textarea
//                   value={commentContent[opinionId + comment.id] || ''}
//                   onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                     setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: e.target.value }))
//                   }
//                   onKeyDown={(e) => handleCommentKeyDown(e, opinionId, comment.id)}
//                   placeholder="Reply to this comment..."
//                   className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
//                   disabled={!isOnline}
//                 />
//                 <Button
//                   size="sm"
//                   onClick={() => handleSubmitComment(opinionId, comment.id)}
//                   className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
//                   disabled={postCommentMutation.isPending || !isOnline}
//                 >
//                   Reply
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-3 space-y-3 border-l border-gray-200 dark:border-gray-800 pl-2 sm:pl-4">
//             {comment.replies.map(reply => renderComment(reply, opinionId, level + 1))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-screen bg-gray-100 dark:bg-gray-950 flex flex-col font-sans">
//       <head>
//         <title>Opinions/Reports | Ultimi</title>
//         <meta name="description" content="Learn more about us." />
//       </head>
//       <header className=" flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4">
//         <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Opinions</h1>
//       </header>
//       <main className="flex-1 overflow-y-auto p-3 sm:p-4" ref={opinionsContainerRef}>
//         <div className="max-w-3xl mx-auto w-full">
//           {isLoadingOpinions ? (
//             <div className="space-y-4">
//               {[...Array(5)].map((_, idx) => (
//                 <Skeleton key={idx} className="h-[120px] w-full rounded-lg shadow-sm" />
//               ))}
//             </div>
//           ) : opinions.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">No opinions yet. Be the first to share one!</p>
//           ) : (
//             <div className="space-y-6">
//               {groupedOpinions.map(group => (
//                 <div key={group.date} className="space-y-4">
//                   <div className="relative my-6 flex items-center justify-center">
//                     <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-950">
//                       {group.label}
//                     </span>
//                     <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
//                   </div>
//                   {group.opinions.map(opinion => (
//                     <Card
//                       key={opinion.id}
//                       data-opinion-id={opinion.id}
//                       className="border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md bg-white dark:bg-gray-900"
//                     >
//                       <CardContent className="p-3 sm:p-4">
//                         <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
//                           <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
//                             <AvatarImage src={opinion?.user?.avatar_url || undefined} alt={opinion?.user?.username || 'Unknown'} />
//                             <AvatarFallback className="text-sm font-medium">{opinion.user?.username || 'U'}</AvatarFallback>
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2">
//                               <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                                 {opinion.user?.username || 'Unknown'}
//                                 {opinion.user_id === currentUser?.id && ' (You)'}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {formatDistanceToNow(new Date(opinion.created_at), { addSuffix: true })}
//                               </p>
//                             </div>
//                             <p className="text-base sm:text-lg text-gray-900 dark:text-white mt-2 leading-relaxed">{opinion.content}</p>
//                             <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleLikeOpinion(opinion.id)}
//                                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${
//                                   opinion.likes.some(like => like.user_id === currentUser?.id) ? 'text-green-500' : ''
//                                 }`}
//                                 disabled={likeOpinionMutation.isPending || !isOnline}
//                               >
//                                 <Heart
//                                   className="h-4 w-4"
//                                   fill={opinion.likes.some(like => like.user_id === currentUser?.id) ? 'currentColor' : 'none'}
//                                 />
//                                 <span className="text-sm">{opinion.likes.length || ''}</span>
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleDislikeOpinion(opinion.id)}
//                                 className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${
//                                   opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'text-red-500' : ''
//                                 }`}
//                                 disabled={dislikeOpinionMutation.isPending || !isOnline}
//                               >
//                                 <ThumbsDown
//                                   className="h-4 w-4"
//                                   fill={opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'currentColor' : 'none'}
//                                 />
//                                 <span className="text-sm">{opinion.dislikes.length || ''}</span>
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => toggleComments(opinion.id)}
//                                 className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
//                               >
//                                 <MessageCircle className="h-4 w-4" />
//                                 <span className="text-sm">{opinion.comments.length || ''} {opinion.comments.length === 1 ? 'Comment' : 'Comments'}</span>
//                               </Button>
//                               {renderReactionPicker(opinion.id)}
//                             </div>
//                             {renderReactionsDisplay(opinion.reactions, opinion.id)}
//                             {showComments[opinion.id] && (
//                               <div className="mt-4">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => toggleComments(opinion.id)}
//                                   className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mb-2"
//                                 >
//                                   Show less
//                                 </Button>
// {opinion.comments.length > 0 && (
//   <AnimatePresence>
    
//     {showComments[opinion.id] && ( 
//       <motion.div
//         initial={{ opacity: 0, height: 0, marginTop: 0 }}
//                 animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
        
//         exit={{ opacity: 0, height: 0, marginTop: 0 }}
        
//         transition={{ duration: 0.35, ease: "easeInOut" }}
//         className="overflow-hidden space-y-3 border-l-4 border-gray-200 dark:border-gray-700 pl-2 sm:pl-4 py-1"
//       >
//         {opinion.comments.map(comment => renderComment(comment, opinion.id))}
//       </motion.div>
//     )}
//   </AnimatePresence>
// )}
//                                 <div className="mt-4 flex flex-col sm:flex-row gap-2">
//                                   <Textarea
//                                     value={commentContent[opinion.id] || ''}
//                                     onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
//                                       setCommentContent(prev => ({ ...prev, [opinion.id]: e.target.value }))
//                                     }
//                                     onKeyDown={(e) => handleCommentKeyDown(e, opinion.id)}
//                                     placeholder="Write a comment..."
//                                     className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
//                                     disabled={!isOnline}
//                                   />
//                                   <Button
//                                     size="sm"
//                                     onClick={() => handleSubmitComment(opinion.id)}
//                                     className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
//                                     disabled={postCommentMutation.isPending || !isOnline}
//                                   >
//                                     Post
//                                   </Button>
//                                 </div>
//                               </div>
//                             )}
//                             {!showComments[opinion.id] && opinion.comments.length > 0 && (
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => toggleComments(opinion.id)}
//                                 className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mt-2"
//                               >
//                                 Show {opinion.comments.length} {opinion.comments.length === 1 ? 'comment' : 'comments'}
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 pb-[80px] sm:p-4 pb-[25px] sm:pb-[0px]">
//         <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row gap-2">
//           <Textarea
//             value={newOpinion}
//             onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewOpinion(e.target.value)}
//             onKeyDown={handleOpinionKeyDown}
//             placeholder="Share your opinion..."
//             className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
//             disabled={!isOnline}
//           />
//           <Button
//             size="sm"
//             onClick={handleSubmitOpinion}
//             className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
//             disabled={postOpinionMutation.isPending || !newOpinion.trim() || !isOnline}
//           >
//             Post
//           </Button>
//         </div>
//       </footer>
//       {showScrollButton && (
//         <div className="fixed bottom-[170px] right-3 sm:right-4">
//           <Button
//             size="icon"
//             variant="secondary"
//             onClick={scrollToBottom}
//             className="rounded-full  bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import { ArrowDown, Heart, MessageCircle, ThumbsDown, SmilePlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { getCurrentUser, supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import Textarea from '@/components/ui/textarea';
import { toast } from 'sonner';
import { reactions, getPopularReactions } from '@/lib/reactions';
 import { motion, AnimatePresence } from 'framer-motion';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/ popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Define interfaces
interface User {
  username: string;
  avatar_url?: string | null;
}



interface OpinionReaction {
  id: string;
  opinion_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}


interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string | null;
  likes: string[];
  dislikes: string[];
  reactions: CommentReaction[];
  user: User | null;
  replies?: Comment[];
}

interface Opinion {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: User | null;
  likes: { user_id: string }[];
  dislikes: { user_id: string }[];
  reactions: OpinionReaction[];
  comments: Comment[];
}

interface OpinionPayload {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CommentPayload {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  opinion_id: string;
  parent_comment_id?: string | null;
  likes: string[];
  dislikes: string[];
}

interface LikeDislikePayload {
  opinion_id?: string;
  comment_id?: string;
  user_id: string;
}

interface SupabaseUser {
  username: string;
  avatar_url?: string | null;
}

interface SupabaseComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string | null;
  likes: string[];
  dislikes: string[];
  reactions: CommentReaction[];
  user: SupabaseUser | null;
}

interface CurrentUser {
  id: string;
  username?: string;
  avatar_url?: string | null;
}

interface GroupedOpinions {
  date: string;
  label: string;
  opinions: Opinion[];
}

// Helper function for mutual exclusivity in Supabase
const ensureMutualExclusivity = async (
  table: 'opinion_likes' | 'opinion_dislikes' | 'opinion_comments',
  idField: 'opinion_id' | 'comment_id',
  idValue: string,
  userId: string,
  isLike: boolean
) => {
  if (table === 'opinion_comments') {
    const { data: comment, error: fetchError } = await supabase
      .from('opinion_comments')
      .select('likes, dislikes')
      .eq('id', idValue)
      .single();
    if (fetchError || !comment) {
      console.error('Error fetching comment:', fetchError);
      throw new Error('Failed to fetch comment.');
    }

    const updatedLikes = isLike
      ? comment.likes.includes(userId)
        ? comment.likes.filter((id: string) => id !== userId)
        : [...comment.likes, userId]
      : comment.likes.filter((id: string) => id !== userId);
    const updatedDislikes = !isLike
      ? comment.dislikes.includes(userId)
        ? comment.dislikes.filter((id: string) => id !== userId)
        : [...comment.dislikes, userId]
      : comment.dislikes.filter((id: string) => id !== userId);

    const { error: updateError } = await supabase
      .from('opinion_comments')
      .update({ likes: updatedLikes, dislikes: updatedDislikes })
      .eq('id', idValue);
    if (updateError) {
      console.error(`Error updating comment ${isLike ? 'likes' : 'dislikes'}:`, updateError);
      throw new Error(`Failed to update comment ${isLike ? 'likes' : 'dislikes'}.`);
    }
  } else {
    const oppositeTable = table === 'opinion_likes' ? 'opinion_dislikes' : 'opinion_likes';
    const [deleteResult, insertResult] = await Promise.all([
      supabase
        .from(oppositeTable)
        .delete()
        .eq(idField, idValue)
        .eq('user_id', userId),
      supabase
        .from(table)
        .upsert([{ [idField]: idValue, user_id: userId }], { onConflict: `${idField},user_id` }),
    ]);

    if (deleteResult.error) {
      console.error(`Error removing from ${oppositeTable}:`, deleteResult.error);
      throw new Error(`Failed to remove ${isLike ? 'dislike' : 'like'}.`);
    }
    if (insertResult.error) {
      console.error(`Error adding to ${table}:`, insertResult.error);
      throw new Error(`Failed to ${isLike ? 'like' : 'dislike'}.`);
    }
  }
};

// Helper to nest comments
const nestComments = (comments: SupabaseComment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const topLevel: Comment[] = [];

  comments.forEach(comment => {
    const typedComment: Comment = {
      ...comment,
      replies: [],
      reactions: comment.reactions || [],
      user: Array.isArray(comment.user) ? comment.user[0] : comment.user || { username: 'Unknown', avatar_url: null },
    };
    commentMap.set(comment.id, typedComment);
  });

  comments.forEach(comment => {
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push({
          ...comment,
          replies: [],
          reactions: comment.reactions || [],
          user: Array.isArray(comment.user) ? comment.user[0] : comment.user || { username: 'Unknown', avatar_url: null },
        });
      }
    } else {
      topLevel.push(commentMap.get(comment.id)!);
    }
  });

  return topLevel;
};

// Group reactions by emoji
const groupReactions = (reactions: OpinionReaction[] | CommentReaction[]) => {
  const grouped = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, (OpinionReaction | CommentReaction)[]>);

  return Object.entries(grouped)
    .map(([emoji, reactions]) => ({ emoji, count: reactions.length, reactions }))
    .sort((a, b) => b.count - a.count);
};

export default function Opinions() {
  const [newOpinion, setNewOpinion] = useState<string>('');
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [openReactionPopover, setOpenReactionPopover] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const opinionsContainerRef = useRef<HTMLDivElement>(null);

  // Sync online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track scroll position for auto-scroll and button visibility
  useEffect(() => {
    const container = opinionsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user: CurrentUser | null = await getCurrentUser();
        setCurrentUser(user || null);
      } catch (error: unknown) {
        console.error('Error fetching current user:', error);
        toast.error('Failed to load current user.');
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch opinions
  const { data: opinions = [], isLoading: isLoadingOpinions }: UseQueryResult<Opinion[], Error> = useQuery({
    queryKey: ['opinions'],
    queryFn: async (): Promise<Opinion[]> => {
      const { data, error } = await supabase
        .from('opinions')
        .select(
          `
          id, user_id, content, created_at, updated_at,
          user:profiles!opinions_user_id_fkey(username, avatar_url),
          likes:opinion_likes(user_id),
          dislikes:opinion_dislikes(user_id),
          reactions:opinion_reactions(id, user_id, emoji, created_at),
          comments:opinion_comments(
            id, user_id, content, created_at, parent_comment_id, likes, dislikes,
            reactions:comment_reactions(id, user_id, emoji, created_at),
            user:profiles!opinion_comments_user_id_fkey(username, avatar_url)
          )
        `
        )
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching opinions:', error);
        throw new Error('Failed to load opinions.');
      }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nestedData = ((data as any[]) || []).map(opinion => ({
        ...opinion,
        user: Array.isArray(opinion.user) ? opinion.user[0] : opinion.user || { username: 'Unknown', avatar_url: null },
        reactions: opinion.reactions || [],
        comments: nestComments(opinion.comments || []),
      }));
      return nestedData as Opinion[];
    },
    enabled: isOnline,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Group opinions by date
  const groupedOpinions: GroupedOpinions[] = opinions.reduce(
    (acc: GroupedOpinions[], opinion) => {
      const date = new Date(opinion.created_at);
      let label: string;
      if (isToday(date)) {
        label = 'Today';
      } else if (isYesterday(date)) {
        label = 'Yesterday';
      } else {
        label = format(date, 'MMMM d, yyyy');
      }
      const existingGroup = acc.find(group => group.date === label);
      if (existingGroup) {
        existingGroup.opinions.push(opinion);
      } else {
        acc.push({ date: label, label, opinions: [opinion] });
      }
      return acc;
    },
    []
  );

  // Scroll to the most recent opinion or bottom
  const scrollToBottom = () => {
    if (opinionsContainerRef.current) {
      if (opinions.length > 0) {
        const lastOpinion = opinionsContainerRef.current.querySelector(
          `[data-opinion-id="${opinions[opinions.length - 1].id}"]`
        );
        if (lastOpinion) {
          lastOpinion.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      opinionsContainerRef.current.scrollTop = opinionsContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll on new content if near bottom
  const autoScrollOnNewContent = () => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  };

  // Trigger auto-scroll on new opinions/comments
  useEffect(() => {
    if (opinions.length > 0) {
      autoScrollOnNewContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [opinions]);

  // Handle incoming opinion
  const handleIncomingOpinion = async (payload: { new: OpinionPayload }) => {
    if (!isOnline || payload.new.user_id === currentUser?.id) return;

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', payload.new.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user for opinion:', userError);
      toast.error('Failed to load user profile.');
      return;
    }

    const newOpinion: Opinion = {
      ...payload.new,
      user: userData,
      likes: [],
      dislikes: [],
      reactions: [],
      comments: [],
    };

    queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
      if (!old) return [newOpinion];
      if (old.some(op => op.id === newOpinion.id)) return old;
      const updated = [...old, newOpinion];
      setTimeout(autoScrollOnNewContent, 100);
      return updated;
    });
  };

  // Handle incoming opinion like
  const handleIncomingOpinionLike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
    const userId = payload.new?.user_id || payload.old?.user_id;
    if (!isOnline || userId === currentUser?.id) return;

    queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
      if (!old) return old;
      const updated = old.map(op => {
        if (payload.new && op.id === payload.new.opinion_id) {
          if (op.likes.some(l => l.user_id === payload.new!.user_id)) return op;
          return {
            ...op,
            likes: [...op.likes, { user_id: payload.new!.user_id }],
            dislikes: op.dislikes.filter(d => d.user_id !== payload.new!.user_id),
          };
        }
        if (payload.old && op.id === payload.old.opinion_id) {
          return {
            ...op,
            likes: op.likes.filter(l => l.user_id !== payload.old!.user_id),
          };
        }
        return op;
      });
      return updated;
    });
  };

  // Handle incoming opinion dislike
  const handleIncomingOpinionDislike = (payload: { new?: LikeDislikePayload; old?: LikeDislikePayload }) => {
    const userId = payload.new?.user_id || payload.old?.user_id;
    if (!isOnline || userId === currentUser?.id) return;

    queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
      if (!old) return old;
      const updated = old.map(op => {
        if (payload.new && op.id === payload.new.opinion_id) {
          if (op.dislikes.some(d => d.user_id === payload.new!.user_id)) return op;
          return {
            ...op,
            dislikes: [...op.dislikes, { user_id: payload.new!.user_id }],
            likes: op.likes.filter(l => l.user_id !== payload.new!.user_id),
          };
        }
        if (payload.old && op.id === payload.old.opinion_id) {
          return {
            ...op,
            dislikes: op.dislikes.filter(d => d.user_id !== payload.old!.user_id),
          };
        }
        return op;
      });
      return updated;
    });
  };

  // Handle incoming comment
  const handleIncomingComment = async (payload: { new: CommentPayload }) => {
    if (!isOnline || payload.new.user_id === currentUser?.id) return;

    const { data: userData } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', payload.new.user_id)
      .single();

    const newComment: Comment = {
      ...payload.new,
      user: userData || { username: 'Unknown', avatar_url: null },
      likes: payload.new.likes || [],
      dislikes: payload.new.dislikes || [],
      reactions: [],
      parent_comment_id: payload.new.parent_comment_id,
    };

    queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
      if (!old) return old;
      const updated = old.map(op => {
        if (op.id !== payload.new.opinion_id) return op;
        const comments = nestComments([...op.comments, newComment]);
        return { ...op, comments };
      });
      setTimeout(autoScrollOnNewContent, 100);
      return updated;
    });
  };

  // Handle incoming comment like/dislike
  const handleIncomingCommentLikeDislike = (payload: { new?: CommentPayload; old?: CommentPayload }) => {
    const userId = payload.new?.user_id || payload.old?.user_id;
    if (!isOnline || userId === currentUser?.id) return;

    queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
      if (!old) return old;
      const updated = old.map(op => {
        if (op.id !== (payload.new?.opinion_id || payload.old?.opinion_id)) return op;
        const comments = op.comments.map(c => {
          if (c.id !== (payload.new?.id || payload.old?.id)) return c;
          return {
            ...c,
            likes: payload.new ? payload.new.likes : c.likes,
            dislikes: payload.new ? payload.new.dislikes : c.dislikes,
          };
        });
        return { ...op, comments: nestComments(comments) };
      });
      return updated;
    });
  };

  // Subscribe to real-time changes
  useEffect(() => {
    if (!isOnline || !currentUser?.id) return;

    const opinionsChannel = supabase
      .channel('opinions')
      .on('postgres_changes' , { event: 'INSERT', schema: 'public', table: 'opinions' }, handleIncomingOpinion )
      .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
        if (err) toast.error('Failed to subscribe to opinions.');
      });

    const likesChannel = supabase
      .channel('opinion_likes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opinion_likes' }, handleIncomingOpinionLike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void)
      .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
        if (err) toast.error('Failed to subscribe to likes.');
      });

    // const dislikesChannel = supabase
    //   .channel('opinion_dislikes')
    //   .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'opinion_dislikes' }, handleIncomingOpinionDislike)
    //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
    //     if (err) toast.error('Failed to subscribe to dislikes.');
    //   });
    const dislikesChannel = supabase
    .channel('opinion_dislikes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'opinion_dislikes' },
      handleIncomingOpinionDislike as (payload: RealtimePostgresChangesPayload<LikeDislikePayload>) => void
    )
    .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
      if (err) toast.error('Failed to subscribe to dislikes.');
    });

    // const commentsChannel = supabase
    //   .channel('opinion_comments')
    //   .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table: 'opinion_comments' }, handleIncomingComment)
    //   .on('postgres_changes' as any, { event: 'UPDATE', schema: 'public', table: 'opinion_comments' }, handleIncomingCommentLikeDislike)
    //   .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
    //     if (err) toast.error('Failed to subscribe to comments.');
    //   });
    const commentsChannel = supabase
  .channel('opinion_comments')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'opinion_comments' },
    handleIncomingComment as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
  )
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'opinion_comments' },
    handleIncomingCommentLikeDislike as (payload: RealtimePostgresChangesPayload<CommentPayload>) => void
  )
  .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
    if (err) toast.error('Failed to subscribe to comments.');
  });

    return () => {
      supabase.removeChannel(opinionsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(dislikesChannel);
      supabase.removeChannel(commentsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, currentUser, queryClient]);

  // Post opinion mutation
  const postOpinionMutation: UseMutationResult<Opinion, Error, { content: string }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ content }: { content: string }): Promise<Opinion> => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', currentUser.id)
          .single();
        if (userError || !userData) {
          throw new Error('Failed to fetch user profile.');
        }
        const { data: insertedOpinion, error } = await supabase
          .from('opinions')
          .insert({ user_id: currentUser.id, content })
          .select(
            `
            id, user_id, content, created_at, updated_at,
            user:profiles!opinions_user_id_fkey(username, avatar_url),
            likes:opinion_likes(user_id),
            dislikes:opinion_dislikes(user_id),
            reactions:opinion_reactions(id, user_id, emoji, created_at),
            comments:opinion_comments(id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url))
          `
          )
          .single();
        if (error || !insertedOpinion) {
          throw new Error('Failed to post opinion.');
        }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        function normalizeComments(rawComments: any[]): SupabaseComment[] {
          return (rawComments ?? []).map((c) => ({
            id: c.id,
            user_id: c.user_id,
            content: c.content,
            created_at: c.created_at,
            parent_comment_id: c.parent_comment_id ?? null,
            likes: c.likes ?? [],
            dislikes: c.dislikes ?? [],
            reactions: c.reactions ?? [],
            user: Array.isArray(c.user) ? c.user[0] : c.user || { username: 'Unknown', avatar_url: null },
          }));
        }

        return {
          ...insertedOpinion,
          user: userData,
          reactions: insertedOpinion.reactions || [],
          comments: nestComments(normalizeComments(insertedOpinion.comments || [])),
        } as Opinion;
      },
      onMutate: async ({ content }: { content: string }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        const { data: userData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', currentUser?.id)
          .single();
        const tempOpinion: Opinion = {
          id: `temp-${Date.now()}`,
          user_id: currentUser!.id,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: userData || { username: 'Unknown', avatar_url: null },
          likes: [],
          dislikes: [],
          reactions: [],
          comments: [],
        };
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = [...(old || []), tempOpinion];
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err: Error, _vars, context) => {
        toast.error(err.message || 'Failed to post opinion.');
        queryClient.setQueryData(['opinions'], context?.previousOpinions);
      },
      onSuccess: (insertedOpinion: Opinion) => {
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old
            ? old.filter(op => !op.id.startsWith('temp-')).concat(insertedOpinion)
            : [insertedOpinion];
          setTimeout(autoScrollOnNewContent, 100);
          return updated;
        });
        toast.success('Opinion posted!');
        setNewOpinion('');
      },
    });

  // Like/unlike opinion mutation
  const likeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        await ensureMutualExclusivity('opinion_likes', 'opinion_id', opinionId, currentUser.id, !isLiked);
      },
      onMutate: async ({ opinionId, isLiked }: { opinionId: string; isLiked: boolean }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op =>
            op.id === opinionId
              ? {
                  ...op,
                  likes: isLiked
                    ? op.likes.filter(l => l.user_id !== currentUser!.id)
                    : [...op.likes, { user_id: currentUser!.id }],
                  dislikes: isLiked ? op.dislikes : op.dislikes.filter(d => d.user_id !== currentUser!.id),
                }
              : op
          );
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err: Error, { isLiked }, context) => {
        toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} opinion.`);
        queryClient.setQueryData(['opinions'], context?.previousOpinions);
      },
      onSuccess: (_: void, { isLiked }: { opinionId: string; isLiked: boolean }) => {
        toast.success(isLiked ? 'Opinion unliked!' : 'Opinion liked!');
      },
    });

  // Dislike/undislike opinion mutation
  const dislikeOpinionMutation: UseMutationResult<void, Error, { opinionId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ opinionId }: { opinionId: string; isDisliked: boolean }) => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        await ensureMutualExclusivity('opinion_dislikes', 'opinion_id', opinionId, currentUser.id, false);
      },
      onMutate: async ({ opinionId, isDisliked }: { opinionId: string; isDisliked: boolean }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op =>
            op.id === opinionId
              ? {
                  ...op,
                  dislikes: isDisliked
                    ? op.dislikes.filter(d => d.user_id !== currentUser!.id)
                    : [...op.dislikes, { user_id: currentUser!.id }],
                  likes: isDisliked ? op.likes : op.likes.filter(l => l.user_id !== currentUser!.id),
                }
              : op
          );
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err: Error, { isDisliked }, context) => {
        toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} opinion.`);
        queryClient.setQueryData(['opinions'], context?.previousOpinions);
      },
      onSuccess: (_: void, { isDisliked }: { opinionId: string; isDisliked: boolean }) => {
        toast.success(isDisliked ? 'Opinion undisliked!' : 'Opinion disliked!');
      },
    });

  // Add reaction to opinion mutation
  const addOpinionReactionMutation = useMutation({
    mutationFn: async ({ opinionId, emoji }: { opinionId: string; emoji: string }) => {
      if (!currentUser?.id || !isOnline) {
        throw new Error('User not authenticated or offline.');
      }

      // Check if user already reacted with this emoji
      const { data: existingReaction } = await supabase
        .from('opinion_reactions')
        .select('id')
        .eq('opinion_id', opinionId)
        .eq('user_id', currentUser.id)
        .eq('emoji', emoji)
        .single();

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('opinion_reactions')
          .delete()
          .eq('id', existingReaction.id);
        if (error) throw new Error('Failed to remove reaction.');
      } else {
        // Add reaction
        const { error } = await supabase
          .from('opinion_reactions')
          .insert({
            opinion_id: opinionId,
            user_id: currentUser.id,
            emoji,
          });
        if (error) throw new Error('Failed to add reaction.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opinions'] });
      setOpenReactionPopover(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update reaction.');
    },
  });

  // Add reaction to comment mutation
  const addCommentReactionMutation = useMutation({
    mutationFn: async ({ commentId, emoji }: { commentId: string; emoji: string }) => {
      if (!currentUser?.id || !isOnline) {
        throw new Error('User not authenticated or offline.');
      }

      // Check if user already reacted with this emoji
      const { data: existingReaction } = await supabase
        .from('comment_reactions')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', currentUser.id)
        .eq('emoji', emoji)
        .single();

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existingReaction.id);
        if (error) throw new Error('Failed to remove reaction.');
      } else {
        // Add reaction
        const { error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: currentUser.id,
            emoji,
          });
        if (error) throw new Error('Failed to add reaction.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opinions'] });
      setOpenReactionPopover(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update reaction.');
    },
  });

  // Post comment mutation
  const postCommentMutation: UseMutationResult<Comment, Error, { opinionId: string; content: string; parentCommentId?: string }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }): Promise<Comment> => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', currentUser.id)
          .single();
        if (userError || !userData) {
          throw new Error('Failed to fetch user profile.');
        }
        const { data: insertedComment, error } = await supabase
          .from('opinion_comments')
          .insert({
            opinion_id: opinionId,
            user_id: currentUser.id,
            content,
            parent_comment_id: parentCommentId,
            likes: [],
            dislikes: [],
          })
          .select(
            'id, user_id, content, created_at, parent_comment_id, likes, dislikes, reactions:comment_reactions(id, user_id, emoji, created_at), user:profiles!opinion_comments_user_id_fkey(username, avatar_url)'
          )
          .single();
        if (error || !insertedComment) {
          throw new Error('Failed to post comment.');
        }
        return {
          ...insertedComment,
          reactions: insertedComment.reactions || [],
          user: userData || { username: 'Unknown', avatar_url: null },
        } as Comment;
      },
      onMutate: async ({ opinionId, content, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        const { data: userData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', currentUser?.id)
          .single();
        const tempComment: Comment = {
          id: `temp-${Date.now()}`,
          user_id: currentUser!.id,
          content,
          created_at: new Date().toISOString(),
          user: userData || { username: 'Unknown', avatar_url: null },
          likes: [],
          dislikes: [],
          reactions: [],
          parent_comment_id: parentCommentId,
          replies: [],
        };
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op => {
            if (op.id !== opinionId) return op;
            let comments = [...op.comments];
            if (parentCommentId) {
              comments = comments.map(c =>
                c.id === parentCommentId
                  ? { ...c, replies: [...(c.replies || []), tempComment] }
                  : c
              );
            } else {
              comments.push(tempComment);
            }
            return { ...op, comments: nestComments(comments) };
          });
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err, _variables, context) => {
        toast.error(err.message || 'Failed to post comment.');
        if (context?.previousOpinions) {
          queryClient.setQueryData(['opinions'], context.previousOpinions);
        }
      },
      onSuccess: (insertedComment: Comment, { opinionId, parentCommentId }: { opinionId: string; content: string; parentCommentId?: string }) => {
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op => {
            if (op.id !== opinionId) return op;
            let comments = [...op.comments].filter(c => !c.id.startsWith('temp-'));
            if (parentCommentId) {
              comments = comments.map(c =>
                c.id === parentCommentId
                  ? {
                      ...c,
                      replies: [...(c.replies || []).filter(r => !r.id.startsWith('temp-')), insertedComment],
                    }
                  : c
              );
            } else {
              comments.push(insertedComment);
            }
            return { ...op, comments: nestComments(comments) };
          });
          setTimeout(autoScrollOnNewContent, 100);
          return updated;
        });
        toast.success('Comment posted!');
      },
    });

  // Like/unlike comment mutation
  const likeCommentMutation: UseMutationResult<void, Error, { commentId: string; isLiked: boolean }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, !isLiked);
      },
      onMutate: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op => ({
            ...op,
            comments: nestComments(
              op.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      likes: isLiked ? c.likes.filter(id => id !== currentUser!.id) : [...c.likes, currentUser!.id],
                      dislikes: isLiked ? c.dislikes : c.dislikes.filter(id => id !== currentUser!.id),
                    }
                  : c
              )
            ),
          }));
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err: Error, { isLiked }, context) => {
        toast.error(err.message || `Failed to ${isLiked ? 'unlike' : 'like'} comment.`);
        queryClient.setQueryData(['opinions'], context?.previousOpinions);
      },
      onSuccess: (_: void, { isLiked }: { commentId: string; isLiked: boolean }) => {
        toast.success(isLiked ? 'Comment unliked!' : 'Comment liked!');
      },
    });

  // Dislike/undislike comment mutation
  const dislikeCommentMutation: UseMutationResult<void, Error, { commentId: string; isDisliked: boolean }, { previousOpinions?: Opinion[] }> =
    useMutation({
      mutationFn: async ({ commentId }: { commentId: string; isDisliked: boolean }) => {
        if (!currentUser?.id || !isOnline) {
          throw new Error('User not authenticated or offline.');
        }
        await ensureMutualExclusivity('opinion_comments', 'comment_id', commentId, currentUser.id, false);
      },
      onMutate: async ({ commentId, isDisliked }: { commentId: string; isDisliked: boolean }) => {
        await queryClient.cancelQueries({ queryKey: ['opinions'] });
        const previousOpinions = queryClient.getQueryData(['opinions']) as Opinion[] | undefined;
        queryClient.setQueryData(['opinions'], (old: Opinion[] | undefined) => {
          const updated = old?.map(op => ({
            ...op,
            comments: nestComments(
              op.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      dislikes: isDisliked
                        ? c.dislikes.filter(id => id !== currentUser!.id)
                        : [...c.dislikes, currentUser!.id],
                      likes: isDisliked ? c.likes : c.likes.filter(id => id !== currentUser!.id),
                    }
                  : c
              )
            ),
          }));
          return updated;
        });
        return { previousOpinions };
      },
      onError: (err: Error, { isDisliked }, context) => {
        toast.error(err.message || `Failed to ${isDisliked ? 'undislike' : 'dislike'} comment.`);
        queryClient.setQueryData(['opinions'], context?.previousOpinions);
      },
      onSuccess: (_: void, { isDisliked }: { commentId: string; isDisliked: boolean }) => {
        toast.success(isDisliked ? 'Comment undisliked!' : 'Comment disliked!');
      },
    });

  // Handle submitting a new opinion
  const handleSubmitOpinion = () => {
    if (!newOpinion.trim() || !isOnline) {
      toast.error(isOnline ? 'Please enter an opinion.' : 'Cannot post opinion: No internet connection.');
      return;
    }
    postOpinionMutation.mutate({ content: newOpinion });
  };

  // Handle Enter key for opinion submission
  const handleOpinionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitOpinion();
    }
  };

  // Handle liking/unliking an opinion
  const handleLikeOpinion = (opinionId: string) => {
    if (!currentUser?.id || !isOnline) {
      toast.error('Cannot like opinion: No internet connection or not logged in.');
      return;
    }
    const opinion = opinions.find(o => o.id === opinionId);
    const isLiked = opinion?.likes.some(like => like.user_id === currentUser.id);
    likeOpinionMutation.mutate({ opinionId, isLiked: !!isLiked });
  };

  // Handle disliking/undisliking an opinion
  const handleDislikeOpinion = (opinionId: string) => {
    if (!currentUser?.id || !isOnline) {
      toast.error('Cannot dislike opinion: No internet connection or not logged in.');
      return;
    }
    const opinion = opinions.find(o => o.id === opinionId);
    const isDisliked = opinion?.dislikes.some(dislike => dislike.user_id === currentUser.id);
    dislikeOpinionMutation.mutate({ opinionId, isDisliked: !!isDisliked });
  };

  // Handle submitting a comment
  const handleSubmitComment = (opinionId: string, parentCommentId?: string) => {
    const key = opinionId + (parentCommentId || '');
    const content = commentContent[key]?.trim();
    if (!content || !isOnline) {
      toast.error(isOnline ? 'Please enter a comment.' : 'Cannot post comment: No internet connection.');
      return;
    }
    postCommentMutation.mutate({ opinionId, content, parentCommentId });
    setCommentContent(prev => ({ ...prev, [key]: '' }));
  };

  // Handle Enter key for comment submission
  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, opinionId: string, parentCommentId?: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(opinionId, parentCommentId);
    }
  };

  // Handle liking/unliking a comment
  const handleLikeComment = (commentId: string) => {
    if (!currentUser?.id || !isOnline) {
      toast.error('Cannot like comment: No internet connection or not logged in.');
      return;
    }
    const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
    const comment = opinion?.comments.find(c => c.id === commentId);
    const isLiked = comment?.likes.includes(currentUser!.id);
    likeCommentMutation.mutate({ commentId, isLiked: !!isLiked });
  };

  // Handle disliking/undisliking a comment
  const handleDislikeComment = (commentId: string) => {
    if (!currentUser?.id || !isOnline) {
      toast.error('Cannot dislike comment: No internet connection or not logged in.');
      return;
    }
    const opinion = opinions.find(op => op.comments.some(c => c.id === commentId));
    const comment = opinion?.comments.find(c => c.id === commentId);
    const isDisliked = comment?.dislikes.includes(currentUser!.id);
    dislikeCommentMutation.mutate({ commentId, isDisliked: !!isDisliked });
  };

  // Toggle comments visibility
  const toggleComments = (opinionId: string) => {
    setShowComments(prev => ({
      ...prev,
      [opinionId]: !prev[opinionId],
    }));
    if (!showComments[opinionId]) {
      setCommentContent(prev => ({
        ...prev,
        [opinionId]: prev[opinionId] || '',
      }));
    }
  };

  // Render reaction picker
  const renderReactionPicker = (targetId: string, isComment: boolean = false) => (
    <Popover open={openReactionPopover === targetId} onOpenChange={(open) => setOpenReactionPopover(open ? targetId : null)}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors duration-200"
        >
          <motion.div whileHover={{ scale: 1.5 }}>
              <SmilePlus  scale={1} />
            </motion.div> 
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[320px] p-2 sm:w-80 sm:p-4" align="start">
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="fun">Fun</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-2 sm:mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
              {getPopularReactions().map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    if (isComment) {
                      addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
                    } else {
                      addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
                    }
                  }}
                  title={reaction.name}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="positive" className="mt-2 sm:mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
              {reactions.filter(r => r.category === 'positive').map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    if (isComment) {
                      addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
                    } else {
                      addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
                    }
                  }}
                  title={reaction.name}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="fun" className="mt-2 sm:mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
              {reactions.filter(r => r.category === 'fun').map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    if (isComment) {
                      addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
                    } else {
                      addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
                    }
                  }}
                  title={reaction.name}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-2 sm:mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-lg sm:text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    if (isComment) {
                      addCommentReactionMutation.mutate({ commentId: targetId, emoji: reaction.emoji });
                    } else {
                      addOpinionReactionMutation.mutate({ opinionId: targetId, emoji: reaction.emoji });
                    }
                  }}
                  title={reaction.name}
                >
                  {reaction.emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );

  // Render reactions display
  const renderReactionsDisplay = (reactions: OpinionReaction[] | CommentReaction[], targetId: string, isComment: boolean = false) => {
    const groupedReactions = groupReactions(reactions);
    if (groupedReactions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {groupedReactions.map(({ emoji, count, reactions }) => {
          const userReacted = reactions.some(r => r.user_id === currentUser?.id);
          return (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 h-6 px-2 text-xs rounded-full border transition-colors duration-200 ${
                userReacted
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                if (isComment) {
                  addCommentReactionMutation.mutate({ commentId: targetId, emoji });
                } else {
                  addOpinionReactionMutation.mutate({ opinionId: targetId, emoji });
                }
              }}
            >
              <span className="text-sm">{emoji}</span>
              <span>{count}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  // Render comment with replies
  const renderComment = (comment: Comment, opinionId: string, level: number = 0) => (
    <div key={comment.id} className={`flex items-start gap-2 sm:gap-3 ${level > 0 ? 'ml-4 sm:ml-8' : ''} py-2`}>
      <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
        <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.username || 'Unknown'} />
        <AvatarFallback className="text-xs font-medium">{comment.user?.username?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {comment.user?.username || 'Unknown'}
            {comment.user_id === currentUser?.id && ' (You)'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </p>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{comment.content}</p>
        {level === 0 && (
          <>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${comment.likes.includes(currentUser?.id || '') ? 'text-green-500' : ''}`}
                disabled={likeCommentMutation.isPending || !isOnline}
              >
                <Heart className="h-4 w-4" fill={comment.likes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
                <span className="text-xs">{comment.likes.length || ''}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDislikeComment(comment.id)}
                className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${comment.dislikes.includes(currentUser?.id || '') ? 'text-red-500' : ''}`}
                disabled={dislikeCommentMutation.isPending || !isOnline}
              >
                <ThumbsDown className="h-4 w-4" fill={comment.dislikes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
                <span className="text-xs">{comment.dislikes.length || ''}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                onClick={() => setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: prev[opinionId + comment.id] || '' }))}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{comment.replies ? comment.replies.length : ''}</span>
              </Button>
              {renderReactionPicker(comment.id, true)}
            </div>
            {renderReactionsDisplay(comment.reactions, comment.id, true)}
            {commentContent[opinionId + comment.id] !== undefined && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Textarea
                  value={commentContent[opinionId + comment.id] || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setCommentContent(prev => ({ ...prev, [opinionId + comment.id]: e.target.value }))
                  }
                  onKeyDown={(e) => handleCommentKeyDown(e, opinionId, comment.id)}
                  placeholder="Reply to this comment..."
                  className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
                  disabled={!isOnline}
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmitComment(opinionId, comment.id)}
                  className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
                  disabled={postCommentMutation.isPending || !isOnline}
                >
                  Reply
                </Button>
              </div>
            )}
          </>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l border-gray-200 dark:border-gray-800 pl-2 sm:pl-4">
            {comment.replies.map(reply => renderComment(reply, opinionId, level + 1))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-950 flex flex-col font-sans">
      <head>
        <title>Opinions/Reports | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </head>
      <header className=" flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Opinions</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-3 sm:p-4" ref={opinionsContainerRef}>
        <div className="max-w-3xl mx-auto w-full">
          {isLoadingOpinions ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-[120px] w-full rounded-lg shadow-sm" />
              ))}
            </div>
          ) : opinions.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">No opinions yet. Be the first to share one!</p>
          ) : (
            <div className="space-y-6">
              {groupedOpinions.map(group => (
                <div key={group.date} className="space-y-4">
                  <div className="relative my-6 flex items-center justify-center">
                    <span className="absolute px-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-950">
                      {group.label}
                    </span>
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  {group.opinions.map(opinion => (
                    <Card
                      key={opinion.id}
                      data-opinion-id={opinion.id}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md bg-white dark:bg-gray-900"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                            <AvatarImage src={opinion?.user?.avatar_url || undefined} alt={opinion?.user?.username || 'Unknown'} />
                            <AvatarFallback className="text-sm font-medium">{opinion.user?.username?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {opinion.user?.username || 'Unknown'}
                                {opinion.user_id === currentUser?.id && ' (You)'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(opinion.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-base sm:text-lg text-gray-900 dark:text-white mt-2 leading-relaxed">{opinion.content}</p>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeOpinion(opinion.id)}
                                className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors duration-200 ${
                                  opinion.likes.some(like => like.user_id === currentUser?.id) ? 'text-green-500' : ''
                                }`}
                                disabled={likeOpinionMutation.isPending || !isOnline}
                              >
                                <Heart
                                  className="h-4 w-4"
                                  fill={opinion.likes.some(like => like.user_id === currentUser?.id) ? 'currentColor' : 'none'}
                                />
                                <span className="text-sm">{opinion.likes.length || ''}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDislikeOpinion(opinion.id)}
                                className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200 ${
                                  opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'text-red-500' : ''
                                }`}
                                disabled={dislikeOpinionMutation.isPending || !isOnline}
                              >
                                <ThumbsDown
                                  className="h-4 w-4"
                                  fill={opinion.dislikes.some(dislike => dislike.user_id === currentUser?.id) ? 'currentColor' : 'none'}
                                />
                                <span className="text-sm">{opinion.dislikes.length || ''}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleComments(opinion.id)}
                                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm">{opinion.comments.length || ''} {opinion.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                              </Button>
                              {renderReactionPicker(opinion.id)}
                            </div>
                            {renderReactionsDisplay(opinion.reactions, opinion.id)}
                            {showComments[opinion.id] && (
                              <div className="mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleComments(opinion.id)}
                                  className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mb-2"
                                >
                                  Show less
                                </Button>
{opinion.comments.length > 0 && (
  <AnimatePresence>
    
    {showComments[opinion.id] && ( 
      <motion.div
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
        
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden space-y-3 border-l-4 border-gray-200 dark:border-gray-700 pl-2 sm:pl-4 py-1"
      >
        {opinion.comments.map(comment => renderComment(comment, opinion.id))}
      </motion.div>
    )}
  </AnimatePresence>
)}
                                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                  <Textarea
                                    value={commentContent[opinion.id] || ''}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                      setCommentContent(prev => ({ ...prev, [opinion.id]: e.target.value }))
                                    }
                                    onKeyDown={(e) => handleCommentKeyDown(e, opinion.id)}
                                    placeholder="Write a comment..."
                                    className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
                                    disabled={!isOnline}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmitComment(opinion.id)}
                                    className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
                                    disabled={postCommentMutation.isPending || !isOnline}
                                  >
                                    Post
                                  </Button>
                                </div>
                              </div>
                            )}
                            {!showComments[opinion.id] && opinion.comments.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleComments(opinion.id)}
                                className="text-blue-500 hover:text-blue-600 transition-colors duration-200 mt-2"
                              >
                                Show {opinion.comments.length} {opinion.comments.length === 1 ? 'comment' : 'comments'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 pb-[80px] sm:p-4 pb-[25px] sm:pb-[20px]">
        <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row gap-2">
          <Textarea
            value={newOpinion}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewOpinion(e.target.value)}
            onKeyDown={handleOpinionKeyDown}
            placeholder="Share your opinion..."
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-800 focus:border-blue-500 shadow-sm min-h-[40px] max-h-[100px] resize-y bg-white dark:bg-gray-900 flex-1"
            disabled={!isOnline}
          />
          <Button
            size="sm"
            onClick={handleSubmitOpinion}
            className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200 w-full sm:w-auto"
            disabled={postOpinionMutation.isPending || !newOpinion.trim() || !isOnline}
          >
            Post
          </Button>
        </div>
      </footer>
      {showScrollButton && (
        <div className="fixed bottom-[170px] right-3 sm:right-4 sm:bottom-[70px]">
          <Button
            size="icon"
            variant="secondary"
            onClick={scrollToBottom}
            className="rounded-full  bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}