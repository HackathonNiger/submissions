import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cartoonAvatars } from '@/schema/dashboard/mock-data';
import { LeaderboardEntry } from '@/lib/types';

export const useDataFetch = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchLeaderboard = async () => {
    const { data: result, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .gt('total_points', 0)
      .not('total_points', 'is', null)
      .order('total_points', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }

    const withAvatars = await Promise.all(
      (result || []).map(async (entry: LeaderboardEntry, idx: number) => {
        let avatarUrl: string | null = null;

        if (entry.student_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', entry.student_id)
            .single();

          avatarUrl = profile?.avatar_url || null;
        }

        return {
          ...entry,
          avatar_url: avatarUrl || cartoonAvatars[idx % cartoonAvatars.length],
          rank: idx + 1,
        };
      })
    );

    return [...withAvatars].sort((a, b) =>
      sortOrder === 'asc'
        ? a.total_points - b.total_points
        : b.total_points - a.total_points
    );
  };

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard', sortOrder],
    queryFn: fetchLeaderboard,
  });

  if (error) {
    console.error('Query error:', error);
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  const memoizedData = useMemo(() => data, [data.length, sortOrder]);

  return { data: memoizedData, filteredData: memoizedData, isLoading, sortOrder, setSortOrder };
};