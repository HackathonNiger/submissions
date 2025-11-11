export interface LeaderboardEntry {
  student_id: string;
  username: string;
  exam_type: string;
  total_points: number;
  rank: number;
  avatar_url?: string;
}

export interface Score {
  date: string;
  avg_points: number;
}

export interface League {
  league: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  emissive: string;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
}
