import { LeagueFilter } from "@/features/leaderboard/components/league-filter";
import { SearchInput } from "@/features/leaderboard/components/search-input";
import { FilterState, Payload } from "@/features/leaderboard/hooks/useFilters";
interface FiltersProps {
  setFilters: (payload: Payload) => void
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  filters: FilterState
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <SearchInput searchTerm={filters?.searchTerm} setSearchTerm={setFilters} />
      <LeagueFilter leagueFilter={filters.leagueFilter} setLeagueFilter={setFilters} />
    </div>
  );
};