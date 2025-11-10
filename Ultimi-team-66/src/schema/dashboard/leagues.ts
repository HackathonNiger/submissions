import { League } from "@/types/dashboard";

export const LEAGUE_THRESHOLDS: League[] = [
  {
    league: 'Palladium',
    minPoints: 0,
    maxPoints: 899,
    color: '#CED0DD',
    emissive: '#A9A9B3',
  },
  {
    league: 'Bronze',
    minPoints: 900,
    maxPoints: 1299,
    color: '#CD7F32',
    emissive: '#B87333',
  },
  {
    league: 'Silver',
    minPoints: 1300,
    maxPoints: 5299,
    color: '#C0C0C0',
    emissive: '#A9A9A9',
  },
  {
    league: 'Gold',
    minPoints: 5300,
    maxPoints: 13299,
    color: '#FFD700',
    emissive: '#FFA500',
  },
  {
    league: 'Platinum',
    minPoints: 13300,
    maxPoints: 27299,
    color: '#E5E4E2',
    emissive: '#BEBEBE',
  },
  {
    league: 'Diamond',
    minPoints: 27300,
    maxPoints: Infinity,
    color: '#B9F2FF',
    emissive: '#40E0D0',
  },
];