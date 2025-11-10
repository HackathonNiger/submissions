'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Award,
  Bell,
  BookOpenCheck,
  Bot,
  ChartNoAxesCombined,
  HandHelping,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  SwatchBook,
  User,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

import type { AuthUser } from '@supabase/supabase-js'
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import  {MobileNavigation}  from '@/components/widgets/mobile-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

// import { MobileNavigation } from '@/components/widgets/MobileNavigation';


export default function AppSidebar() {

  type Profile = {
    id: string
    username: string
    user_type: string
    avatar_url?: string | null
  }
  const [user, setUser] = useState<AuthUser | null>(null)

  const [profile, setProfile] = useState<Profile| null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const pathname = usePathname();

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
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          setProfile(profileData || null);

          const { data: connections } = await supabase
            .from('connections')
            .select('from_user_id, to_user_id')
            .eq('status', 'accepted')
            .or(
              `from_user_id.eq.${currentUser.id},to_user_id.eq.${currentUser.id}`
            );
          const connectedUserIds = connections
            ? connections.map(conn =>
                conn.from_user_id === currentUser.id
                  ? conn.to_user_id
                  : conn.from_user_id
              )
            : [];
          const { data: notifications, error: notificationError } =
            await supabase
              .from('notifications')
              .select('id')
              .eq('user_id', currentUser.id)
              .eq('status', 'pending')
              .or(
                `type.eq.connection_request,or(type.eq.message,from_user_id.not.in.(${connectedUserIds.join(
                  ','
                )}))`
              );
          if (notificationError) throw notificationError;
          setNotificationCount(notifications?.length || 0);

          const { data: messages, error: messageError } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', currentUser.id)
            .eq('is_read', false);
          if (messageError) throw messageError;
          setUnreadMessageCount(messages?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching user/profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    if (user?.id) {
      const notificationChannel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchUserData();
          }
        )
        .subscribe();

      const messageChannel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            fetchUserData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationChannel);
        supabase.removeChannel(messageChannel);
      };
    }
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
    toast.success('Successfully logged out');
  };

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
      } else {
        setNotificationCount(0);
      }
    }
  };

  const navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Quiz', url: '/quiz', icon: BookOpenCheck },
    { title: 'Ultimi Ai', url: '/Chatbot', icon: Bot },
    { title: 'Flashcards', url: '/flashCard', icon: SwatchBook },
    { title: "Leaderboard", url: '/leaderboard', icon: Award },
    { title: 'Progress', url: '/progress', icon: ChartNoAxesCombined },
    { title: 'Sponsors', url: '/sponsors', icon: HandHelping },
    { title: 'Notifications', url: '/notifications', icon: Bell },
    { title: 'Messages', url: '/messages', icon: MessageCircle },
    { title: 'Connections', url: '/connections', icon: Users },
  ];

  const moreItems = [
    { title: 'Opinions & Reports', url: '/opinions', icon: MessageSquare },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (profile?.user_type === 'sponsor') {
      return !['Quiz', 'Progress', 'Ultimi Ai', 'Flashcards'].includes(item.title);
    }
    return true;
  });

  if (loading) {
    return (
      <Sidebar className="flex flex-col justify-between h-screen bg-background">
        <SidebarHeader className="p-3">
          <Skeleton className="h-6 w-24 rounded-lg" />
        </SidebarHeader>
        <SidebarContent className="p-3 space-y-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-lg" />
            ))}
        </SidebarContent>
        <SidebarFooter className="p-3">
          <Skeleton className="h-6 w-full rounded-lg" />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (

    <>
    
    <Sidebar collapsible="icon" className=" flex-col justify-between h-screen bg-background hidden">
    
         <SidebarHeader className=" border-b border-border">
          <div className="flex gap-2">
          </div>
          <div className="flex relative  items-center justify-start  pt-3">
          <img
            src="/logo.png"
            alt="Ultimi Logo"
            className="h-8 w-10 animate-pulse-slow min-h-[2.4rem]  relative left-[0px] min-w-[2.5rem] flex-shrink-0 object-contain "
          />
         <span
            className={`
              text-xl font-bold truncate transition-all duration-300
              data-[collapsed=true]:hidden
            `}
          >
            Ultimi
          </span>
        </div>
        </SidebarHeader>


      <SidebarContent className="flex-1 pt-[30px]">
        <SidebarMenu>
          {filteredNavItems.map(item => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex pt-[25px] pb-[20px] pr-[50px] items-center gap-2  rounded-lg transition
                      ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-2 border-primary'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                                              title={item.title}

                    onClick={
                      item.title === 'Notifications'
                        ? handleNotificationsClick
                        : undefined
                    }
                  >
                    <div className="relative">
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                      {item.title === 'Notifications' &&
                        notificationCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 text-xs">
                            {notificationCount}
                          </Badge>
                        )}
                      {item.title === 'Messages' && unreadMessageCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 text-xs">
                          {unreadMessageCount}
                        </Badge>
                      )}
                    </div>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-sm">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={`flex items-center gap-2 p-2 rounded-lg transition
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${
                      pathname.startsWith('/reports') ||
                      pathname.startsWith('/opinions')
                        ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-primary'
                        : ''
                    }`}
                >
                  <div className="relative">
                    <MoreHorizontal className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-sm">
                    More...
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {moreItems.map(item => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 ${
                        pathname === item.url
                          ? 'bg-gray-100 dark:bg-gray-800 border-l-4 border-primary'
                          : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} />
                ) : (
                  <AvatarFallback>U</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                  {profile?.username ?? user?.email?.split('@')[0]}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {profile?.user_type ?? 'Member'}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile-setup">
                <User className="mr-2 h-4 w-4" /> Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className='text-red-500'>
              <LogOut className="mr-2 h-4 w-4 text-red-500" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
      <MobileNavigation />
      <style>
        {` .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }`}
      </style>
    </>
  );
}
