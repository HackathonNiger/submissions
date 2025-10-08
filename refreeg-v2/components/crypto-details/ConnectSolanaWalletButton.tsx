"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ConnectSolanaWalletButtonProps {
  onConnected?: (address: string) => void;
  disabled?: boolean;
}

export function ConnectSolanaWalletButton({
  onConnected,
  disabled,
}: ConnectSolanaWalletButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const installPhantom = () => {
    window.open("https://phantom.app/", "_blank");
  };

  const connectWallet = async () => {
    if (disabled) return;

    setIsConnecting(true);
    setError(null);

    try {
      if (!window.solana?.isPhantom) {
        const errorMsg = "Phantom wallet is not installed";
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
          action: (
            <Button variant="outline" onClick={installPhantom}>
              Install Phantom
            </Button>
          ),
        });
        return;
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to connect a wallet");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          solana_wallet: publicKey,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        throw new Error("Failed to save wallet address");
      }

      onConnected?.(publicKey);

      toast({
        title: "Success",
        description: "Solana wallet connected successfully",
      });
      return { address: publicKey };
    } catch (err) {
      console.error("Wallet connection error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={connectWallet}
        disabled={isConnecting || disabled}
        className="w-full"
      >
        {isConnecting ? "Connecting..." : "Connect Solana Wallet"}
      </Button>

      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
          {error === "Phantom wallet is not installed" && (
            <button
              onClick={installPhantom}
              className="ml-2 text-blue-500 hover:text-blue-600 underline"
            >
              Install Phantom
            </button>
          )}
        </div>
      )}
    </div>
  );
}
