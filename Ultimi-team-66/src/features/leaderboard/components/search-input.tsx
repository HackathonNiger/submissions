import Box from '@/components/ui/box';
import { Input } from '@/components/ui/input';
import { Payload } from '@/features/leaderboard/hooks/useFilters';
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: Payload) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box className="relative flex-1 sm:flex-none">
      <Box as="span" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={16} />
      </Box>
      <Input
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm({field: "searchTerm", value: e.target.value})}
        className="pl-10 w-full rounded-lg"
      />
    </Box>
  );
};