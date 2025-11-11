'use client';

import {
  Award,
  Bell,
  BookOpenCheck,
  ChartNoAxesCombined,
  Cpu,
  HandHelping,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  User as UserIcon,
  LogOut,
  Users,
  SwatchBook,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';
import Box from '@/components/ui/box';

// Constants
export type UserType = 'student' | 'sponsor';

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isProfile?: boolean;
  isMore?: boolean;
}

export const mainMobileNavItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Quiz', url: '/quiz', icon: BookOpenCheck },
  { title: 'Leaderboard', url: '/leaderboard', icon: Award },
  { title: 'Profile', url: '#', icon: UserIcon, isProfile: true },
  { title: 'More', url: '#', icon: MoreHorizontal, isMore: true },
];

export const moreMobileNavItems: NavItem[] = [
  { title: 'Progress', url: '/progress', icon: ChartNoAxesCombined },
  { title: 'Sponsors', url: '/sponsors', icon: HandHelping },
  { title: 'Ultimi AI', url: '/Chatbot', icon: Cpu },
  { title: 'Flashcards', url: '/flashCard', icon: SwatchBook },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Messages', url: '/messages', icon: MessageCircle },
  { title: 'Connections', url: '/connections', icon: Users },
  { title: 'Opinions & Reports', url: '/opinions', icon: MessageSquare },
];

export const sponsorFilter = (item: NavItem) =>
  !['Quiz', 'Progress', 'Ultimi AI'].includes(item.title);

// Interfaces
interface Profile {
  id: string;
  username: string | null;
  user_type: UserType | null;
  avatar_url: string | null;
}

// Animation variants
const itemVariants = {
  active: { scale: 1.1, y: -8 },
  inactive: { scale: 1, y: 0 },
};

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// MobileNavItem component
const MobileNavItem = ({
  item,
  pathname,
  notificationCount,
  unreadMessageCount,
  profile,
  handleNotificationsClick,
  handleMessagesClick,
}: {
  item: NavItem;
  pathname: string;
  notificationCount: number;
  unreadMessageCount: number;
  profile: Profile | null;
  handleNotificationsClick: () => void;
  handleMessagesClick: () => void;
}) => {
  const isActive = item.isProfile ? pathname.startsWith('/settings/profile-setup') : pathname === item.url;
  const totalCount = notificationCount + unreadMessageCount;
  const showMoreBadge = item.isMore && totalCount > 0;
  const router = useRouter();

  if (item.isProfile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="group relative flex flex-col items-center justify-center p-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            variants={itemVariants}
            animate={isActive ? 'active' : 'inactive'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Profile menu"
          >
            <Box as="div" className="relative p-[3px] rounded-full z-10">
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Box>
            {isActive && (
              <motion.div
                layoutId="active-nav-pill"
                className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full -z-10 shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
            )}
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="w-72 p-3">
          <DropdownMenuLabel className="text-lg font-semibold">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/profile-setup" className="flex items-center gap-3 p-3 rounded-md cursor-pointer text-base">
              <UserIcon className="h-5 w-5" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
              toast.success('Successfully logged out');
            }}
            className="flex items-center gap-3 p-3 rounded-md text-red-500 cursor-pointer text-base"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (item.isMore) {
    return (
      <MoreDropdown
        items={
          profile?.user_type === 'sponsor'
            ? moreMobileNavItems.filter(sponsorFilter)
            : moreMobileNavItems
        }
        notificationCount={notificationCount}
        unreadMessageCount={unreadMessageCount}
        handleNotificationsClick={handleNotificationsClick}
        handleMessagesClick={handleMessagesClick}
      />
    );
  }

  return (
    <Link
      href={item.url}
      className="group relative flex flex-col items-center justify-center p-2"
      aria-label={item.title}
    >
      <motion.div
        className="relative p-2 rounded-full z-10"
        variants={itemVariants}
        animate={isActive ? 'active' : 'inactive'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'tween', stiffness: 400, damping: 20 }}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-pill"
            className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full -z-10 shadow-md "
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          />
        )}
        <item.icon
          className={`h-5 w-5 transition-all duration-200 ${
            isActive
              ? 'text-white'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'
          }`}
        />
        {showMoreBadge && (
          <motion.div
            className="absolute -top-1 -right-1 z-20"
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Badge className="h-5 w-5 flex justify-center items-center text-xs font-semibold rounded-full bg-red-500 text-white">
              {totalCount}
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
};

// MoreDropdown component
const MoreDropdown = ({
  items,
  notificationCount,
  unreadMessageCount,
  handleNotificationsClick,
  handleMessagesClick,
}: {
  items: NavItem[];
  notificationCount: number;
  unreadMessageCount: number;
  handleNotificationsClick: () => void;
  handleMessagesClick: () => void;
}) => {
  const router = useRouter();

  // const handleLogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (!error) {
  //     toast.success('Successfully logged out');
  //     router.push('/login');
  //   } else {
  //     toast.error('Logout failed');
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="group relative flex flex-col items-center justify-center p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          variants={itemVariants}
          animate="inactive"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="More options"
        >
          <Box as="div" className="relative p-2 rounded-full z-10">
            <MoreHorizontal
              className="h-6 w-6 transition-all duration-200 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary"
            />
          </Box>
          {notificationCount + unreadMessageCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 z-20"
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Badge className="h-5 w-5 flex justify-center items-center text-xs font-semibold rounded-full bg-red-500 text-white">
                {notificationCount + unreadMessageCount}
              </Badge>
            </motion.div>
          )}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" className="w-72 p-3">
        <DropdownMenuLabel className="text-lg font-semibold">More Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const showBadge =
            (item.title === 'Notifications' && notificationCount > 0) ||
            (item.title === 'Messages' && unreadMessageCount > 0);
          const badgeCount = item.title === 'Notifications' ? notificationCount : unreadMessageCount;

          return (
            <DropdownMenuItem
              key={item.url}
              onClick={() => {
                if (item.title === 'Notifications') handleNotificationsClick();
                if (item.title === 'Messages') handleMessagesClick();
                router.push(item.url);
              }}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-base">{item.title}</span>
              {showBadge && (
                <Badge className="h-5 w-5 flex justify-center items-center text-xs font-semibold rounded-full bg-red-500 text-white">
                  {badgeCount}
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Function to fetch notification count
const fetchNotificationCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching notification count:', error);
    return 0;
  }

  return count || 0;
};

// Function to fetch unread message count
const fetchUnreadMessageCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread message count:', error);
    return 0;
  }

  return count || 0;
};

// MobileNavigation component
export function MobileNavigation() {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const filteredNavItems =
    profile?.user_type === 'sponsor'
      ? mainMobileNavItems.filter((item) => (item.isProfile || item.isMore) || sponsorFilter(item))
      : mainMobileNavItems;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const currentUser = data.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, user_type, avatar_url')
            .eq('id', currentUser.id)
            .maybeSingle();
          setProfile(profileData || null);

          const notifCount = await fetchNotificationCount(currentUser.id);
          setNotificationCount(notifCount);

          const msgCount = await fetchUnreadMessageCount(currentUser.id);
          setUnreadMessageCount(msgCount);
        }
      } catch (err) {
        console.error('Error fetching user/profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Realtime subscription for notifications and messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('nav_counts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotificationCount(user.id).then(setNotificationCount);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotificationCount(user.id).then(setNotificationCount);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadMessageCount(user.id).then(setUnreadMessageCount);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadMessageCount(user.id).then(setUnreadMessageCount);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleNotificationsClick = async () => {
    if (notificationCount > 0 && user?.id) {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', user.id)
        .eq('status', 'pending');
      if (error) {
        console.error('Error marking notifications as read:', error);
        toast.error('Failed to update notifications.');
        return;
      }
      setNotificationCount(0);
    }
  };

  const handleMessagesClick = async () => {
    if (unreadMessageCount > 0 && user?.id) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      if (error) {
        console.error('Error marking messages as read:', error);
        toast.error('Failed to update messages.');
        return;
      }
      setUnreadMessageCount(0);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.3)] border-t border-gray-100 dark:border-gray-800 flex justify-around items-center h-16 max-w-lg mx-auto sm:hidden rounded-t-2xl">
      {loading ? (
        Array(5)
          .fill(0)
          .map((_, i) => (
            <Box as="div" key={i} className="flex flex-col items-center justify-center p-2 animate-pulse">
              <Box as="div" className="h-6 w-6 bg-gray-200 rounded-full dark:bg-gray-700" />
            </Box >
          ))
      ) : (
        filteredNavItems.map((item) => (
          <MobileNavItem
            key={item.title}
            item={item}
            pathname={pathname}
            notificationCount={notificationCount}
            unreadMessageCount={unreadMessageCount}
            profile={profile}
            handleNotificationsClick={handleNotificationsClick}
            handleMessagesClick={handleMessagesClick}
          />
        ))
      )}
    </nav>
  );
}