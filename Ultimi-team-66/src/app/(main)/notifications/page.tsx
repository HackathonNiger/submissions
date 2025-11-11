'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Bell, Flame, MessageCircle, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  user_id: string;
  type: 'connection_request' | 'message' | 'system' | 'streak';
  from_user_id: string | null;
  message: string;
  status: 'pending' | 'read' | 'accepted' | 'rejected';
  created_at: string;
  from_user?: {
    username: string;
    avatar_url?: string;
  };
}

interface Profile {
  id: string;
  username: string;
  user_type: 'student' | 'sponsor';
  enable_notifications?: boolean;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [streakLoading, setStreakLoading] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio + unlock on click
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.load();

    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        });
      }
      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Fetch current user + profile
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user.');
        return;
      }
      setCurrentUserId(user?.id || null);

      if (user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, user_type, enable_notifications')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError || !profileData) {
          console.error('Profile fetch error:', profileError);
          toast.error('Failed to load profile.');
          return;
        }

        setCurrentUser(profileData);
        setEnableNotifications(profileData.enable_notifications || false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!currentUserId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select(
        `
        *,
        from_user:profiles!from_user_id(username, avatar_url)
      `,
      )
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications.');
      setNotifications([]);
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  };

  // Fetch streaks (students only)
  useEffect(() => {
    const fetchStreak = async () => {
      if (!currentUserId || currentUser?.user_type !== 'student') {
        setStreak({ current_streak: 0, longest_streak: 0 });
        setStreakLoading(false);
        return;
      }
      setStreakLoading(true);
      try {
        const { data, error } = await supabase
          .from('streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (error || !data) {
          console.error('Error fetching streak:', error);
          setStreak({ current_streak: 0, longest_streak: 0 });
        } else {
          setStreak({
            current_streak: data.current_streak || 0,
            longest_streak: data.longest_streak || 0,
          });
        }
      } catch (err) {
        console.error('fetchStreak error:', err);
        setStreak({ current_streak: 0, longest_streak: 0 });
      } finally {
        setStreakLoading(false);
      }
    };

    if (currentUserId && currentUser) {
      fetchStreak();
    }
  }, [currentUserId, currentUser]);

  // Toggle notification preference
  const toggleNotifications = async () => {
    if (!currentUserId) return;
    const newValue = !enableNotifications;
    setEnableNotifications(newValue);

    const { error } = await supabase
      .from('profiles')
      .update({ enable_notifications: newValue })
      .eq('id', currentUserId);

    if (error) {
      console.error('Error updating notification preference:', error);
      toast.error('Failed to update notification settings.');
      setEnableNotifications(!newValue);
      return;
    }

    toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}.`);
  };

  // Mark notifications as read + play sound + show browser notif
  useEffect(() => {
    if (!currentUserId || loading || notifications.length === 0) return;

    const markAsRead = async () => {
      const pending = notifications.filter((n) => n.status === 'pending');
      if (pending.length === 0) return;

      // Browser + sound
      if (enableNotifications && notificationPermission === 'granted') {
        pending.forEach((n) => {
          const body =
            n.type === 'message'
              ? `New message from ${n.from_user?.username || 'Unknown'}`
              : n.message;

          new Notification('New Notification', {
            body,
            icon: n.from_user?.avatar_url || '/favicon.ico',
          });

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current
              .play()
              .catch((err) => console.error('Audio play error:', err));
          }
        });
      }

      // Mark as read in DB
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', currentUserId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error updating notifications:', error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.status === 'pending' ? { ...n, status: 'read' } : n,
        ),
      );
    };

    markAsRead();
  }, [
    currentUserId,
    notifications,
    loading,
    enableNotifications,
    notificationPermission,
  ]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        () => {
          fetchNotifications();
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        },
      )
      .subscribe();

    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [currentUserId]);

  // Handle dismiss
  const handleDismiss = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    if (error) {
      toast.error('Failed to dismiss notification.')
      return;
    }else{
      toast.success('Notification successfully dismissed')
    }
    setNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId),
    );
  };

  // Counts
  const connectionRequestCount = notifications.filter(
    (n) => n.type === 'connection_request' && n.status === 'pending',
  ).length;
  const messageNotificationCount = notifications.filter(
    (n) => n.type === 'message' && n.status === 'pending',
  ).length;

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-[#18181b]  pb-[66px] sm:pb-[0px]">
      <head>
        <title>Notifications | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </head>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>

          {currentUser?.user_type === 'student' && (
            <Badge className="bg-orange-500 text-white text-xs flex items-center">
              <Flame className="w-4 h-4 mr-1" />
              {streakLoading ? (
                <span className="inline-block w-12 h-4 bg-gray-400 animate-pulse rounded" />
              ) : (
                <>
                  {streak?.current_streak || 0} day
                  {streak?.current_streak !== 1 ? 's' : ''}
                  {streak?.current_streak &&
                  streak.current_streak > 5
                    ? ' 🔥'
                    : ''}
                </>
              )}
            </Badge>
          )}

          {connectionRequestCount > 0 && (
            <Badge className="bg-green-500 text-white text-xs">
              {connectionRequestCount} Connection
              {connectionRequestCount > 1 ? 's' : ''}
            </Badge>
          )}

          {messageNotificationCount > 0 && (
            <Badge className="bg-blue-500 text-white text-xs">
              {messageNotificationCount} Message
              {messageNotificationCount > 1 ? 's' : ''}
            </Badge>
          )}

          <div className="flex items-center gap-2">
            <Switch
              checked={enableNotifications}
              onCheckedChange={toggleNotifications}
              disabled={notificationPermission !== 'granted'}
            />
            <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
            <span className="text-sm text-gray-900 dark:text-white">
              {enableNotifications
                ? 'Notifications On'
                : 'Notifications Off'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="relative flex items-start gap-4 p-4 bg-white dark:bg-black rounded-lg shadow-sm hover:shadow-md transition"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={notification.from_user?.avatar_url || ''}
                    alt={notification.from_user?.username}
                  />
                  <AvatarFallback>
                    {notification.from_user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {notification.type === 'message' ? (
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                    ) : notification.type === 'system' ? (
                      <Award className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Users className="h-5 w-5 text-green-500" />
                    )}

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.type === 'message'
                        ? `New message from ${
                            notification.from_user?.username || 'Unknown'
                          }`
                        : notification.message}
                    </p>

                    {notification.status === 'pending' && (
                      <Badge className="bg-gray-200 text-gray-800 text-xs">
                        New
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(
                      new Date(notification.created_at),
                      { addSuffix: true },
                    )}
                  </p>

                  {notification.type === 'message' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/messages?userId=${notification.from_user_id}`,
                        )
                      }
                      className="mt-3 text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                    >
                      View Message
                    </Button>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDismiss(notification.id)}
                  className="ml-auto text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
