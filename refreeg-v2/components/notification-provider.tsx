"use client";

import { useEffect } from "react";
import { useNotifications } from "@/hooks/use-notification";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSupported, requestPermission } = useNotifications();

  useEffect(() => {
    if (isSupported) {
      // Request permission when component mounts
      requestPermission();
    }
  }, [isSupported, requestPermission]);

  return <>{children}</>;
}
