import { LeaderboardEntry } from '@/lib/types';
import { useMemo } from 'react';

interface FilterParams {
  currentPage: number;
  leagueFilter: string;
  searchTerm: string;
}

export const useLeaderboardFilters = (
  data: LeaderboardEntry[],
  filters: FilterParams
) => {
  const { currentPage, leagueFilter, searchTerm } = filters;
  const itemsPerPage = 27;

  const filteredData = useMemo(() => {
    let filtered = data;

    // Validate input data
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Apply searchTerm filter on username
    if (searchTerm !== '') {
      filtered = filtered.filter((entry) => {
        const matches = entry?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return matches;
      });
    }

    if (leagueFilter !== 'all') {
      filtered = filtered.filter((entry) => {
        const points = entry.total_points;
        if (points >= 27300) return leagueFilter === 'Platinum';
        if (points >= 13300) return leagueFilter === 'Diamond';
        if (points >= 5300) return leagueFilter === 'Gold';
        if (points >= 1300) return leagueFilter === 'Silver';
        if (points >= 900) return leagueFilter === 'Bronze';
        return leagueFilter === 'Palladium';
      });
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return paginated;
  }, [data, searchTerm, leagueFilter, currentPage]);

  return filteredData;
};