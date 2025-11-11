import { Score } from "@/types/dashboard";
import { constants } from "@/utils/constants";

 export const calculatePerformanceRate = (scores: Score[]) => {
    if (scores.length < 2) return 0;
    const validScores = scores.filter(
      s => s.avg_points != null && !isNaN(s.avg_points)
    );
    if (validScores.length < 2) return 0;

    const avgScore =
      validScores.reduce(
        (sum, s) => sum + (s.avg_points / constants.MAX_QUIZ_POINTS) * 100,
        0
      ) / validScores.length;
    return Math.round(avgScore);
  };