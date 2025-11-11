import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Payload } from '@/features/leaderboard/hooks/useFilters';
import { Filter } from 'lucide-react';

interface LeagueFilterProps {
  leagueFilter: string;
  setLeagueFilter: (league: Payload) => void;
}

export const LeagueFilter: React.FC<LeagueFilterProps> = ({setLeagueFilter }) => {
  return (
    <Select defaultValue="all" onValueChange={(value) => setLeagueFilter({field: "leagueFilter", value})}>
      <SelectTrigger className="w-32 rounded-lg">
        <Filter size={16} />
        <SelectValue placeholder="League" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Leagues</SelectItem>
        <SelectItem value="Diamond">Diamond</SelectItem>
        <SelectItem value="Platinum">Platinum</SelectItem>
        <SelectItem value="Gold">Gold</SelectItem>
        <SelectItem value="Silver">Silver</SelectItem>
        <SelectItem value="Bronze">Bronze</SelectItem>
        <SelectItem value="Palladium">Palladium</SelectItem>
      </SelectContent>
    </Select>
  );
};