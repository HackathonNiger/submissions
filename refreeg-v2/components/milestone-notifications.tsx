"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/use-notification";
import { toast } from "@/components/ui/use-toast";

interface MilestoneNotificationsProps {
  raised: number;
  goal: number;
  causeId: string;
  causeTitle: string;
  userName: string;
}

export function MilestoneNotifications({
  raised,
  goal,
  causeId,
  causeTitle,
  userName,
}: MilestoneNotificationsProps) {
  const { showNotification } = useNotifications();
  const [lastMilestone, setLastMilestone] = useState<number | null>(null);

  useEffect(() => {
    const percentage = Math.round((raised / goal) * 100);
    let milestone = null;

    if (percentage >= 25 && (lastMilestone === null || lastMilestone < 25)) {
      milestone = 25;
    } else if (percentage >= 50 && (lastMilestone === null || lastMilestone < 50)) {
      milestone = 50;
    } else if (percentage >= 75 && (lastMilestone === null || lastMilestone < 75)) {
      milestone = 75;
    } else if (percentage >= 100 && (lastMilestone === null || lastMilestone < 100)) {
      milestone = 100;
    }

    if (milestone !== null) {
      setLastMilestone(milestone);
      triggerMilestoneNotification(milestone);
    }
  }, [raised, goal, lastMilestone]);

  const triggerMilestoneNotification = (milestone: number) => {
    let title = "";
    let body = "";
    let icon = "/icons/icon-192x192.png";

    switch (milestone) {
      case 25:
        title = `25% Funded! You're Off to a Strong Start 🚀`;
        body = `Your cause "${causeTitle}" just crossed the 25% funding mark. Keep the momentum going!`;
        break;
      case 50:
        title = `Halfway There. Let's Amplify the Momentum ⚡`;
        body = `Your cause "${causeTitle}" has reached 50% of its goal. Time to boost visibility!`;
        break;
      case 75:
        title = `You're 75% Funded — Almost There! 🏁`;
        body = `Incredible work — your cause "${causeTitle}" is 75% funded and nearly at the finish line!`;
        break;
      case 100:
        title = `100% Funded! Your Cause is Fully Backed 🎉`;
        body = `Congratulations ${userName}! Your cause "${causeTitle}" has reached 100% funding!`;
        break;
      default:
        return;
    }

    // Show browser notification if supported
    showNotification(title, { body, icon });

    // Fallback to toast notification
    toast({
      title,
      description: body,
    });
  };

  return null;
}