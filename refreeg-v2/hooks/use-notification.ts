"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported) {
      toast({
        title,
        description: options?.body,
      });
      return;
    }

    if (permission !== "granted") {
      requestPermission().then((granted) => {
        if (granted) {
          new Notification(title, options);
        } else {
          toast({
            title,
            description: options?.body,
          });
        }
      });
      return;
    }

    try {
      new Notification(title, options);
    } catch (error) {
      console.error("Error showing notification:", error);
      toast({
        title,
        description: options?.body,
      });
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
  };
}