"use client";

import { useState } from "react";
import { BrowserProvider } from "ethers";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ConnectWalletButtonProps {
  onConnected?: (address: string, network?: string) => void;
  disabled?: boolean;
}

export function ConnectWalletButton({
  onConnected,
  disabled,
}: ConnectWalletButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const installMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  const connectWallet = async () => {
    if (disabled) return;

    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        const errorMsg = "MetaMask is not installed";
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
          action: (
            <Button variant="outline" onClick={installMetaMask}>
              Install MetaMask
            </Button>
          ),
        });
        return;
      }

      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      if (!address) {
        throw new Error("Invalid wallet address");
      }

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== 80002) {
        throw new Error(
          "Please switch to the Polygon Amoy testnet in MetaMask"
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to connect a wallet");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          polygon_wallet: address,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        throw new Error("Failed to save wallet address");
      }

      onConnected?.(address, "matic-amoy");

      toast({
        title: "Success",
        description: "Wallet connected on Polygon Amoy testnet",
      });
      return { address, network: "matic-amoy" };
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
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
          {error === "MetaMask is not installed" && (
            <button
              onClick={installMetaMask}
              className="ml-2 text-blue-500 hover:text-blue-600 underline"
            >
              Install MetaMask
            </button>
          )}
        </div>
      )}
    </div>
  );
}