import { PaginationControls } from '@/features/leaderboard/components/pagination-controls';
import { TableContent } from './table-content';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardTableProps {
  loading: boolean;
  filteredData: LeaderboardEntry[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  handleConnect: (toUserId: string) => void;
  theme: string | undefined;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  loading,
  filteredData,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  handleConnect,
  theme,
}) => {
  return (
    <>
      <TableContent
        loading={loading}
        filteredData={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handleConnect={handleConnect}
        theme={theme}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};