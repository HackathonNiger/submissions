"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(20);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [updateResult, setUpdateResult] = useState<"success" | "error" | null>(
    null
  );
  const router = useRouter();
  const supabase = createClient();
  const { updatePassword } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIsValidSession(false);
        toast({
          title: "Invalid session",
          description: "This password reset link has expired or is invalid.",
          variant: "destructive",
        });
      }
    };

    checkSession();
  }, [supabase.auth]);
  useEffect(() => {
    if (isLoading && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLoading && redirectCountdown === 0 && !isRedirecting) {
      handleRedirect();
    }
  }, [isLoading, redirectCountdown, isRedirecting]);

  const handleRedirect = async () => {
    if (isRedirecting) return;

    setIsRedirecting(true);
    if (updateResult === "success") {
      toast({
        title: "Password updated successfully!",
        description: "Please sign in with your new password.",
      });
    } else {
      toast({
        title: "Password update process completed",
        description: "Please try signing in with your new password.",
      });
    }

    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      router.push("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRedirectCountdown(15);
    setIsRedirecting(false);
    setUpdateResult(null);

    updatePassword(password)
      .then(() => {
        setUpdateResult("success");
      })
      .catch((error: any) => {
        setUpdateResult("error");
        console.error("Password update error:", error);
      });
  };

  if (!isValidSession) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Invalid Link
              </CardTitle>
              <CardDescription className="text-center">
                This password reset link has expired or is invalid.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => router.push("/auth/reset-password")}
                className="w-full"
              >
                Request new reset link
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Update password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    placeholder="********"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isRedirecting}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {isRedirecting
                        ? "Redirecting..."
                        : `Updating password... (${redirectCountdown}s)`}
                    </>
                  ) : (
                    "Update password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
