'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface Sponsor {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  joindate: string;
}

export default function SponsorsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  // Fetch sponsors
  useEffect(() => {
    const fetchSponsors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('id, username, first_name, last_name, company, email, phone, city, bio, avatar_url, joindate')
          .order('joindate', { ascending: sortOrder === 'asc' });

        if (error) {
          console.error('Error fetching sponsors:', error);
          toast.error('Failed to load sponsors');
          return;
        }

        setSponsors(data || []);
        setFilteredSponsors(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [sortOrder]);

  // Filter sponsors based on search term
  useEffect(() => {
    const filtered = sponsors.filter((sponsor) =>
      (sponsor.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sponsor.first_name + ' ' + sponsor.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sponsor.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSponsors(filtered);
  }, [searchTerm, sponsors]);

  // Handle connection request
  const handleConnect = async (toUserId: string, toUsername: string) => {
    if (!currentUserId) {
      toast.error('You must be logged in to send a connection request');
      return;
    }
    if (toUserId === currentUserId) {
      toast.error('You cannot connect with yourself');
      return;
    }

    try {
      const { data: existingConnection } = await supabase
        .from('connections')
        .select('*')
        .eq('from_user_id', currentUserId)
        .eq('to_user_id', toUserId)
        .single();

      if (existingConnection) {
        toast.error('Connection request already sent or accepted');
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
        toast.error('Failed to send connection request');
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
        toast.error('Failed to send notification');
        return;
      }

      toast.success(`Connection request sent to ${toUsername}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };


  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-[#16161a] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <head>
        <title>Sponsors | Ultimi</title>
      </head>
      <Card className="mb-6 rounded-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-lg sm:text-xl font-semibold">Our Sponsors</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
              <Input
                placeholder="Search by username or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg"
              />
            </div>
            <Select
              defaultValue="desc"
              onValueChange={(val) => setSortOrder(val as 'asc' | 'desc')}
            >
              <SelectTrigger className="w-36 flex items-center gap-2 rounded-lg">
                <SelectValue placeholder={sortOrder === 'asc' ? 'Ascending' : 'Descending'} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredSponsors.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No sponsors found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredSponsors.map((sponsor) => (
                <Card
                  key={sponsor.id}
                  className={`p-4 sm:p-6 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    currentUserId === sponsor.id ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100') : ''
                  }`}
                  onClick={() => router.push(`/users/${sponsor.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border">
                        {sponsor.avatar_url ? (
                          <AvatarImage src={sponsor.avatar_url} alt={`${sponsor.first_name} ${sponsor.last_name}`} />
                        ) : (
                          <AvatarFallback>
                            {sponsor.username?.[0]?.toUpperCase() || sponsor.first_name[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {sponsor.first_name} {sponsor.last_name}
                        </h2>
                        {sponsor.username && (
                          <p className="text-sm opacity-80">@{sponsor.username}</p>
                        )}
                        {sponsor.company && (
                          <p className="text-sm opacity-80">{sponsor.company}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-800" align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/users/${sponsor.id}`);
                          }}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/messages?userId=${sponsor.id}`);
                              }}
                        >
                          Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnect(sponsor.id, sponsor.username || `${sponsor.first_name} ${sponsor.last_name}`);
                          }}
                        >
                          Connect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}