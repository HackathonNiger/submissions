export interface SponsorProfile {
  id: string;
  username: string;
  avatar_url?: string;
  user_type?: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  league: string;
  avatar_url?: string;
}
