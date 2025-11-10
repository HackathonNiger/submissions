// // useDeleteMessage.ts
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabaseClient';
// import { useState } from 'react';
// import { toast } from 'sonner';

// export function useDeleteMessage() {
//   const queryClient = useQueryClient();
//   const [deletedMessages, setDeletedMessages] = useState<Record<string, boolean>>({});

//   const mutation = useMutation({
//     mutationFn: async (messageId: string) => {
//       // Update message content to mark as deleted
//       const { error } = await supabase
//         .from('messages')
//         .update({ content: null, is_deleted: true }) // mark deleted
//         .eq('id', messageId);

//       if (error) throw new Error(error.message);
//       return messageId;
//     },
//     onSuccess: (messageId: string) => {
//       // Mark locally as deleted
//       setDeletedMessages(prev => ({ ...prev, [messageId]: true }));
//       queryClient.invalidateQueries({ queryKey: ['messages'] });
//       toast.success('Message deleted');
//     },
//     onError: (err: any) => {
//       console.error('Delete message failed:', err);
//       toast.error('Failed to delete message');
//     },
//   });

//   const deleteMessage = (messageId: string) => mutation.mutate(messageId);

//   return { deleteMessage, deletedMessages };
// }



// useDeleteMessage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { toast } from 'sonner';

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const [deletedMessages, setDeletedMessages] = useState<Record<string, boolean>>({});

  const mutation = useMutation({
    mutationFn: async (messageId: string) => {
      // Update message content to mark as deleted
      const { error } = await supabase
        .from('messages')
        .update({ content: null, is_deleted: true }) // mark deleted
        .eq('id', messageId);

      if (error) throw new Error(error.message);
      return messageId;
    },
    onSuccess: (messageId: string) => {
      // Mark locally as deleted
      setDeletedMessages(prev => ({ ...prev, [messageId]: true }));
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted');
    },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error('Delete message failed:', err);
      toast.error('Failed to delete message');
    },
  });

  const deleteMessage = (messageId: string) => mutation.mutate(messageId);

  return { deleteMessage, deletedMessages };
}
