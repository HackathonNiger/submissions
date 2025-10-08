"use client";

import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import NavigationLoader from "@/components/NavigationLoader";

const DEFAULT_MATIC_TO_NAIRA_RATE = 413;

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface MaticDonationButtonProps {
  causeId: string;
  onDonationSuccess?: (amountInNaira: number) => void;
}

export default function MaticDonationButton({
  causeId,
  onDonationSuccess,
}: MaticDonationButtonProps) {
  const { toast } = useToast();
  const [donationAmount, setDonationAmount] = useState<string>("0.1");
  const [nairaEquivalent, setNairaEquivalent] = useState<string>("41.3");
  const [formattedNairaEquivalent, setFormattedNairaEquivalent] =
    useState<string>("41.3");
  const [exchangeRate] = useState<number>(DEFAULT_MATIC_TO_NAIRA_RATE);
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(true);
  const [inputMode, setInputMode] = useState<"matic" | "naira">("matic");
  const params = useParams();
  const supabase = createClient();

  const formatNumberWithCommas = (value: string): string => {
    if (!value || isNaN(parseFloat(value))) return value;
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
  };

  const removeCommas = (value: string): string => {
    return value.replace(/,/g, "");
  };

  useEffect(() => {
    if (inputMode === "matic") {
      const amount = parseFloat(donationAmount);
      if (!isNaN(amount) && amount > 0) {
        const nairaValue = (amount * exchangeRate).toFixed(2);
        setNairaEquivalent(nairaValue);
        setFormattedNairaEquivalent(formatNumberWithCommas(nairaValue));
      } else {
        setNairaEquivalent("0.00");
        setFormattedNairaEquivalent("0.00");
      }
    }
  }, [donationAmount, exchangeRate, inputMode]);

  useEffect(() => {
    if (inputMode === "naira") {
      const amount = parseFloat(removeCommas(nairaEquivalent));
      if (!isNaN(amount) && amount > 0) {
        const maticValue = (amount / exchangeRate).toFixed(6);
        setDonationAmount(maticValue);
      } else {
        setDonationAmount("0.00");
      }
    }
  }, [nairaEquivalent, exchangeRate, inputMode]);

  const handleMaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMode("matic");
    setDonationAmount(e.target.value);
  };

  const handleNairaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMode("naira");
    const rawValue = removeCommas(e.target.value);
    setNairaEquivalent(rawValue);
    setFormattedNairaEquivalent(formatNumberWithCommas(rawValue));
  };

  useEffect(() => {
    const fetchRecipientAddress = async () => {
      try {
        console.log("Fetching recipient address for cause:", causeId);
        const { data: cause, error: causeError } = await supabase
          .from("causes")
          .select("user_id")
          .eq("id", causeId)
          .single();

        if (causeError) throw causeError;
        if (!cause) throw new Error("Cause not found");

        console.log("Found cause, fetching profile for user:", cause.user_id);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("polygon_wallet")
          .eq("id", cause.user_id)
          .single();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Creator not found");

        console.log("Recipient wallet address:", profile.polygon_wallet);
        setRecipientAddress(profile.polygon_wallet || null);
      } catch (err) {
        console.error("Error fetching recipient address:", err);
        setError("Failed to load recipient wallet information");
        setRecipientAddress(null);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchRecipientAddress();
  }, [causeId, supabase]);

  const logDonation = async (
    causeId: string,
    txHash: string,
    amountInMatic: number,
    amountInNaira: number,
    donorWalletAddress: string,
    recipientAddress: string
  ) => {
    try {
      console.log("Starting donation logging process...");

      // 1. Verify authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      console.log("User auth status:", { user, authError });

      if (authError || !user) {
        throw new Error(authError?.message || "User not authenticated");
      }

      // 2. Log to crypto_donations
      console.log("Inserting into crypto_donations...");
      const { data, error: insertError } = await supabase
        .from("crypto_donations")
        .insert({
          cause_id: causeId,
          tx_hash: txHash,
          amount_in_crypto: amountInMatic,
          amount_in_naira: amountInNaira,
          donor_wallet_address: donorWalletAddress,
          recipient_address: recipientAddress,
          user_id: user.id,
          status: "completed",
          network: "Polygon Amoy Testnet",
          currency: "MATIC",
        })
        .select();

      if (insertError) {
        console.error("Insert failed:", {
          error: insertError,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
        throw insertError;
      }

      console.log("Donation logged successfully:", data);

      // 3. Update raised amount
      console.log("Updating raised amount...");
      const { data: causeData, error: selectError } = await supabase
        .from("causes")
        .select("raised")
        .eq("id", causeId)
        .single();

      if (selectError) throw selectError;

      const currentRaised = causeData?.raised || 0;
      const newRaised = currentRaised + amountInNaira;

      const { error: updateError } = await supabase
        .from("causes")
        .update({ raised: newRaised })
        .eq("id", causeId);

      if (updateError) {
        console.error("Update failed:", {
          currentRaised,
          amountInNaira,
          newRaised,
          error: updateError,
        });
        throw updateError;
      }

      console.log("Raised amount updated successfully");
      return data;
    } catch (error) {
      console.error("Complete donation logging error:", error);
      throw error;
    }
  };

  const switchToPolygonAmoyTestnet = async () => {
    try {
      console.log("Attempting to switch to Polygon Amoy Testnet");
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }],
      });
      console.log("Successfully switched to Polygon Amoy Testnet");
    } catch (switchError: any) {
      console.error("Switch error:", switchError);
      if (switchError.code === 4902) {
        try {
          console.log("Adding Polygon Amoy Testnet to MetaMask");
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13882",
                chainName: "Polygon Amoy Testnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc-amoy.polygon.technology"],
                blockExplorerUrls: ["https://amoy.polygonscan.com/"],
              },
            ],
          });
          console.log("Successfully added Polygon Amoy Testnet");
        } catch (addError) {
          console.error("Failed to add Polygon Amoy network:", addError);
          throw new Error(
            "Please add Polygon Amoy Testnet to MetaMask manually"
          );
        }
      } else {
        throw new Error("Failed to switch to Polygon Amoy Testnet");
      }
    }
  };

  const handleDonate = useCallback(async () => {
    setError(null);
    setTxHash(null);
    setIsDonating(true);
    let needsManualReset = true;

    try {
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid donation amount");
      }

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      if (!recipientAddress) {
        throw new Error("Recipient wallet address not available");
      }

      console.log(
        "Initiating donation of",
        amount,
        "MATIC to",
        recipientAddress
      );

      await window.ethereum.request({ method: "eth_requestAccounts" });
      await switchToPolygonAmoyTestnet();

      const provider = new BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);
      const amountInWei = ethers.parseEther(donationAmount);

      console.log("Wallet address:", walletAddress);
      console.log("Balance:", ethers.formatEther(balance), "MATIC");
      console.log("Amount to send:", donationAmount, "MATIC");

      if (balance < amountInWei) {
        throw new Error("Insufficient MATIC balance");
      }

      // FIXED: Using a more robust way to estimate gas with proper error handling
      let gasEstimate;
      try {
        gasEstimate = await provider.estimateGas({
          from: walletAddress,
          to: recipientAddress,
          value: amountInWei,
        });
      } catch (gasError) {
        console.error("Gas estimation error:", gasError);
        // Fallback to a reasonable gas limit if estimation fails
        gasEstimate = BigInt(21000); // Basic transfer gas limit
      }

      // Add 30% buffer to gas estimate instead of 20%
      const gasWithBuffer =
        (BigInt(gasEstimate.toString()) * BigInt(130)) / BigInt(100);

      console.log("Gas estimate:", gasEstimate.toString());
      console.log("Gas with buffer:", gasWithBuffer.toString());

      // FIXED: More robust transaction formatting
      const tx = await signer.sendTransaction({
        from: walletAddress, // Explicitly set the from address
        to: recipientAddress,
        value: amountInWei,
        gasLimit: gasWithBuffer,
        type: 2, // EIP-1559 transaction
      });

      console.log("Transaction submitted, hash:", tx.hash);
      setTxHash(tx.hash);
      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      try {
        console.log("Waiting for transaction confirmation...");
        const receipt = await tx.wait();

        setIsDonating(false);
        needsManualReset = false;

        if (!receipt || receipt.status === 0) {
          throw new Error("Transaction failed on chain");
        }

        console.log("Transaction confirmed:", receipt);
        toast({
          title: "Success",
          description: "Transaction confirmed! Thank you for your donation.",
        });

        const nairaAmount = parseFloat(removeCommas(nairaEquivalent));
        const maticAmount = parseFloat(donationAmount);

        try {
          console.log("Logging donation to database...");
          await logDonation(
            causeId,
            tx.hash,
            maticAmount,
            nairaAmount,
            walletAddress,
            recipientAddress
          );

          console.log("Donation successfully logged");
          onDonationSuccess?.(nairaAmount);
        } catch (dbError) {
          console.error("Database operation error:", dbError);
          toast({
            title: "Donation Record Error",
            description:
              "Transaction succeeded but we couldn't save the donation record. Please contact support with your transaction hash.",
            variant: "destructive",
          });
        }
      } catch (confirmError) {
        console.error("Transaction confirmation error:", confirmError);
        setIsDonating(false);
        needsManualReset = false;
        throw confirmError;
      }
    } catch (err: any) {
      console.error("Donation error:", err);

      let userFriendlyMessage = "Donation failed. Please try again.";
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        userFriendlyMessage = "Transaction was rejected by your wallet";
      } else if (err.code === -32603 || err.message?.includes("JSON-RPC")) {
        userFriendlyMessage =
          "Transaction failed. Please check your wallet and try again.";
      } else if (
        err.message?.includes("insufficient funds") ||
        err.code === "INSUFFICIENT_FUNDS"
      ) {
        userFriendlyMessage = "Insufficient MATIC balance";
      } else if (err.message?.includes("user rejected signing")) {
        userFriendlyMessage = "You rejected the transaction signature";
      } else if (err.message?.includes("invalid address")) {
        userFriendlyMessage = "Invalid recipient address";
      }

      toast({
        title: "Error",
        description: userFriendlyMessage,
        variant: "destructive",
      });
      setError(userFriendlyMessage);

      if (needsManualReset) {
        setIsDonating(false);
      }
    } finally {
      if (needsManualReset) {
        setTimeout(() => {
          setIsDonating(false);
        }, 100);
      }
    }
  }, [
    donationAmount,
    nairaEquivalent,
    recipientAddress,
    causeId,
    supabase,
    toast,
    onDonationSuccess,
  ]);

  if (isLoadingAddress) {
    return <NavigationLoader />;
  }

  if (!recipientAddress) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Donate with MATIC
        </h2>
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
          <p>The creator hasn't set up a Polygon wallet address.</p>
          <p className="mt-2">
            <Link
              href={`/cause/${params.cause_id}/payment`}
              className="text-purple-600 hover:underline"
            >
              Please use another payment method
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Donate with MATIC
      </h2>

      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount (MATIC)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">MATIC</span>
          </div>
          <input
            type="number"
            id="amount"
            min="0.01"
            step="0.01"
            value={donationAmount}
            onChange={handleMaticChange}
            className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isDonating}
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="nairaAmount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount (Naira)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₦</span>
          </div>
          <input
            type="text"
            id="nairaAmount"
            value={formattedNairaEquivalent}
            onChange={handleNairaChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isDonating}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Using Polygon Amoy Testnet</p>
      </div>

      <button
        onClick={handleDonate}
        disabled={isDonating}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isDonating ? "bg-blue-400" : "bg-purple-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
      >
        {isDonating ? "Processing..." : "Donate with MATIC"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <p>Thank you for your donation!</p>
          <p className="mt-1 text-sm">
            Transaction:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-800"
            >
              View on Polygonscan
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
