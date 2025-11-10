import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useConnect = () => {
  const  currentUserId  = useAuth();

  const handleConnect = async (toUserId: string) => {
    if (!currentUserId) {
      toast('You must be logged in to send a connection request.');
      return;
    }
    if (toUserId === currentUserId) {
      toast('You cannot connect with yourself.');
      return;
    }

    const { data: existingConnection } = await supabase
      .from('connections')
      .select('*')
      .eq('from_user_id', currentUserId)
      .eq('to_user_id', toUserId)
      .single();

    if (existingConnection) {
      toast('Connection request already sent or accepted.');
      return;
    }

    const { error: connectionError } = await supabase
      .from('connections')
      .insert({
        from_user_id: currentUserId,
        to_user_id: toUserId,
        status: 'pending',
      });

    if (connectionError) {
      console.error('Error creating connection:', connectionError);
      toast('Failed to send connection request.');
      return;
    }

    const { data: fromUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', currentUserId)
      .single();

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: toUserId,
        type: 'connection_request',
        from_user_id: currentUserId,
        message: `${fromUser?.username || 'User'} sent you a connection request.`,
        status: 'pending',
      });

    if (notificationError) {
      console.error('Error sending notification:', notificationError);
      toast('Failed to send notification.');
    } else {
      toast(`Connection request sent to ${fromUser?.username || 'user'}.`);
    }
  };

  return { handleConnect };
};