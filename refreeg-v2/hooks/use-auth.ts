// Helper to extract a simple device/OS string from user agent
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import { getCurrentUser } from "@/actions/auth-actions";
import { updateProfile } from "@/actions";
import { sendLoginNotificationEmail } from "@/services/mail";

// Helper to extract a simple device/OS string from user agent
function getDeviceInfo() {
  if (typeof window === "undefined") return "Unknown Device";
  const ua = window.navigator.userAgent;
  if (/android/i.test(ua)) return "Android";
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error getting current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!error && user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Get device and IP address (best effort, client-side)
      const device = getDeviceInfo();
      let ipAddress = "Unknown IP";
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (res.ok) {
          const data = await res.json();
          ipAddress = data.ip || ipAddress;
        }
      } catch (e) {
        // Ignore IP fetch errors
      }

      // Send login notification email (fire and forget)
      sendLoginNotificationEmail({
        loginTime: new Date().toLocaleString(),
        device,
        ipAddress,
      }).catch((e) => console.error("Login notification email error:", e));

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    accountType: "individual" | "organization"
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Create profile for the new user
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          account_type: accountType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast({
            title: "Error creating profile",
            description:
              "Your account was created but there was an error setting up your profile.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      // Updated to go through callback route with type parameter
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        toast({
          title: "Error sending reset email",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
}
