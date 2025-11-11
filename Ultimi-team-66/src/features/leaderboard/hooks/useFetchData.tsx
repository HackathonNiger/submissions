// useLeaderboardData.ts
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust the path as needed
import { cartoonAvatars } from '@/schema/dashboard/mock-data'; // Adjust path if needed

interface LeaderboardEntry {
  student_id: string | null;
  total_points: number;
  // [key: string]: any;
  [key: string]: unknown;
}

type SortOrder = 'asc' | 'desc';

export const useFetchLeaderboardData = (sortOrder: SortOrder = 'desc') => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const query = supabase
      .from('leaderboard_view')
      .select('*')
      .gt('total_points', 0)
      .not('total_points', 'is', null)
      .order('total_points', { ascending: false });

    const { data: result, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
      setData([]);
      setFilteredData([]);
      setError(error.message);
      setLoading(false);
      return;
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

    const sorted = [...withAvatars].sort((a, b) =>
      sortOrder === 'asc'
        ? a.total_points - b.total_points
        : b.total_points - a.total_points
    );

    setData(sorted);
    setFilteredData(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [sortOrder]);

  return { data, filteredData, setFilteredData, loading, error, refetch: fetchData };
};
