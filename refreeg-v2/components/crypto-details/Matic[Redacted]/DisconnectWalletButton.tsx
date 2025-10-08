"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DisconnectWalletButtonProps {
  walletAddress: string;
  walletNetwork: string;
  onSuccess: () => void;
}

export function DisconnectWalletButton({
  walletAddress,
  walletNetwork,
  onSuccess,
}: DisconnectWalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleDisconnect = async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Clear the wallet by setting it to NULL
      const { error } = await supabase
        .from("profiles")
        .update({ polygon_wallet: null })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wallet disconnected successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Disconnection error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDisconnect}
        title="Disconnect Wallet"
        description={`Are you sure you want to disconnect wallet ${walletAddress.slice(
          0,
          6
        )}...${walletAddress.slice(-4)}?`}
        confirmText={isLoading ? "Disconnecting..." : "Disconnect"}
      />
    </>
  );
}
