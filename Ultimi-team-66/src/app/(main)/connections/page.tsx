'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Connection {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  to_user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user.');
        return;
      }
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  // Fetch connections
  const fetchConnections = async () => {
    if (!currentUserId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        from_user:profiles!from_user_id(username, avatar_url),
        to_user:profiles!to_user_id(id, username, avatar_url)
      `)
      .or(`from_user_id.eq.${currentUserId},to_user_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections.');
      setConnections([]);
      setLoading(false);
      return;
    }
    setConnections(data || []);
    setLoading(false);
  };

  // Subscribe to real-time connections
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `or(from_user_id=eq.${currentUserId},to_user_id=eq.${currentUserId})`,
        },
        () => {
          fetchConnections();
        }
      )
      .subscribe();

    fetchConnections();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [ currentUserId]);

  // Handle accept/reject connection
  const handleConnectionResponse = async (
    connectionId: string,
    status: 'accepted' | 'rejected'
  ) => {
    const connection = connections.find((c) => c.id === connectionId);
    if (!connection) return;

    // Update connection status
    const { error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', connectionId);

    if (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection.');
      return;
    }

    // Delete associated notification
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('from_user_id', connection.from_user_id)
      .eq('user_id', currentUserId)
      .eq('type', 'connection_request');

    if (deleteError) {
      console.error('Error deleting notification:', deleteError);
      toast.error('Failed to delete notification.');
    }

    if (status === 'accepted') {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: connection.from_user_id,
          type: 'connection_request',
          from_user_id: currentUserId,
          message: `Your connection request was accepted.`,
          status: 'read', // Mark as read to show only once
        });
      if (notificationError) {
        console.error('Error sending notification:', notificationError);
        toast.error('Failed to send notification.');
      } else {
        toast.success('Connection accepted!');
      }
    } else {
      toast.success('Connection rejected.');
    }

    fetchConnections();
  };

  // Navigate to messages for accepted connections
  const handleCardClick = (connection: Connection) => {
    if (connection.status === 'accepted') {
      const otherUser =
        connection.from_user_id === currentUserId
          ? connection.to_user
          : connection.from_user;
      if (otherUser?.id) {
        router.push(`/messages?userId=${otherUser.id}`);
      }
    }
  };

  return (
    <div className="p-4 min-h-screen dark:bg-[#16161a] ">
      <head>
        <title>Connections | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </head>
      <Card className="max-w-2xl mx-auto rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : connections.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No connections yet.
            </p>
          ) : (
            <div className="space-y-3">
              {connections.map((connection) => {
                const otherUser =
                  connection.from_user_id === currentUserId
                    ? connection.to_user
                    : connection.from_user;
                const isPending =
                  connection.status === 'pending' &&
                  connection.to_user_id === currentUserId;

                return (
                  <Card
                    key={connection.id}
                    className={`p-4 rounded-lg transition-all ${
                      connection.status === 'accepted'
                        ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                    onClick={() => handleCardClick(connection)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={otherUser?.avatar_url || ''}
                            alt={otherUser?.username}
                          />
                          <AvatarFallback>
                            {otherUser?.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {otherUser?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status: {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectionResponse(connection.id, 'accepted');
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectionResponse(connection.id, 'rejected');
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}