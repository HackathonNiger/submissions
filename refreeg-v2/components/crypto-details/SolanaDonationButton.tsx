"use client";

import { useState, useEffect, useRef } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import NavigationLoader from "../NavigationLoader";

const DEFAULT_SOL_TO_NAIRA_RATE = 225814.49;
const SOLANA_RPC_URL = "https://api.testnet.solana.com";

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      signAndSendTransaction: (
        transaction: Transaction
      ) => Promise<{ signature: string }>;
    };
  }
}

interface SolDonationButtonProps {
  causeId: string;
  onDonationSuccess?: (amountInNaira: number) => void;
}

const fetchSolToNairaRate = async (): Promise<number> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=ngn"
    );
    const data = await response.json();
    return data.solana.ngn || DEFAULT_SOL_TO_NAIRA_RATE;
  } catch (error) {
    console.error("Error fetching SOL rate:", error);
    return DEFAULT_SOL_TO_NAIRA_RATE;
  }
};

export default function SolDonationButton({
  causeId,
  onDonationSuccess,
}: SolDonationButtonProps) {
  const [donationAmount, setDonationAmount] = useState("0.1");
  const [nairaInput, setNairaInput] = useState("30.25");
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_SOL_TO_NAIRA_RATE);
  const [isDonating, setIsDonating] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [inputMode, setInputMode] = useState<"sol" | "naira">("sol");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const nairaInputRef = useRef<HTMLInputElement>(null);
  const solInputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const getExchangeRate = async () => {
      const rate = await fetchSolToNairaRate();
      setExchangeRate(rate);

      // Update the opposite field based on current input mode
      if (inputMode === "sol") {
        const amount = parseFloat(donationAmount);
        if (!isNaN(amount) && amount > 0) {
          const nairaValue = (amount * rate).toFixed(2);
          setNairaInput(formatNumberWithCommas(nairaValue));
        }
      } else {
        const cleanNaira = removeCommas(nairaInput);
        const amount = parseFloat(cleanNaira);
        if (!isNaN(amount) && amount > 0) {
          const solValue = (amount / rate).toFixed(6);
          setDonationAmount(solValue);
        }
      }
    };
    getExchangeRate();

    const interval = setInterval(getExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumberWithCommas = (value: string): string => {
    if (!value || isNaN(parseFloat(value))) return value;
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
  };

  const removeCommas = (value: string): string => value.replace(/,/g, "");

  const formatInputValue = (
    value: string,
    cursorPosition: number
  ): { formattedValue: string; newCursorPosition: number } => {
    const cleanValue = removeCommas(value);
    const formattedValue = formatNumberWithCommas(cleanValue);

    // Calculate new cursor position
    const commasBeforeCursor = (
      value.substring(0, cursorPosition).match(/,/g) || []
    ).length;
    const commasInFormatted = (
      formattedValue.substring(0, cursorPosition).match(/,/g) || []
    ).length;
    const newCursorPosition =
      cursorPosition + (commasInFormatted - commasBeforeCursor);

    return { formattedValue, newCursorPosition };
  };

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMode("sol");
    setDonationAmount(value);

    // Update naira equivalent
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      const nairaValue = (amount * exchangeRate).toFixed(2);
      setNairaInput(formatNumberWithCommas(nairaValue));
    } else {
      setNairaInput("0.00");
    }
  };

  const handleNairaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    setInputMode("naira");

    // Only allow numbers, commas, and decimal points
    const sanitizedValue = value.replace(/[^\d,\.]/g, "");

    // Format the value and get new cursor position
    const { formattedValue, newCursorPosition } = formatInputValue(
      sanitizedValue,
      cursorPosition
    );

    setNairaInput(formattedValue);

    // Set cursor position after state update
    setTimeout(() => {
      if (nairaInputRef.current) {
        nairaInputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);

    // Update SOL equivalent
    const cleanValue = removeCommas(formattedValue);
    const amount = parseFloat(cleanValue);
    if (!isNaN(amount) && amount > 0) {
      const solValue = (amount / exchangeRate).toFixed(6);
      setDonationAmount(solValue);
    } else {
      setDonationAmount("0.00");
    }
  };

  const handleNairaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, decimal point
    if (
      [46, 8, 9, 27, 13, 110, 190, 37, 39, 35, 36].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const fetchRecipientAddress = async () => {
      try {
        const { data: causeData, error: causeError } = await supabase
          .from("causes")
          .select("user_id")
          .eq("id", causeId)
          .single();

        if (causeError || !causeData) throw new Error("Cause not found");

        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("solana_wallet")
          .eq("id", causeData.user_id)
          .single();

        if (userError || !userData) throw new Error("Creator not found");

        setRecipientAddress(userData.solana_wallet || null);
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

  const logTransaction = async (
    causeId: string,
    txSignature: string,
    amountInSol: number,
    amountInNaira: number,
    walletAddress: string,
    recipientAddress: string
  ) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const insertResult = await supabase.from("crypto_donations").insert([
        {
          cause_id: causeId,
          tx_signature: txSignature,
          amount_in_sol: amountInSol,
          amount_in_naira: amountInNaira,
          wallet_address: walletAddress,
          recipient_address: recipientAddress,
          user_id: user.id,
          payment_method: "SOL",
          status: "completed",
          network: "Solana Testnet",
          currency: "SOL",
          wallet_type: "solana",
        },
      ]);

      if (insertResult.error) {
        throw insertResult.error;
      }

      const updateResult = await supabase.rpc("increment_cause_raised", {
        cause_id: causeId,
        amount: amountInNaira,
      });

      if (updateResult.error) {
        throw updateResult.error;
      }
    } catch (error) {
      console.error("Error logging transaction:", error);
      throw error;
    }
  };

  const checkWalletConnection = async () => {
    if (!window.solana?.isPhantom) {
      throw new Error("Phantom wallet is not installed");
    }

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      setWalletAddress(publicKey);
      return publicKey;
    } catch (err) {
      console.error("Wallet connection error:", err);
      throw new Error("Failed to connect wallet");
    }
  };

  const handleDonate = async () => {
    if (!recipientAddress) {
      toast({
        title: "Error",
        description: "Recipient wallet address not available",
        variant: "destructive",
      });
      setError("Recipient wallet address not available");
      return;
    }

    setIsDonating(true);
    setError(null);
    setTxSignature(null);

    try {
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid donation amount");
      }

      const senderAddress = await checkWalletConnection();
      if (!senderAddress) throw new Error("Wallet connection failed");

      const connection = new Connection(SOLANA_RPC_URL, "confirmed");
      const recipientPublicKey = new PublicKey(recipientAddress);
      const senderPublicKey = new PublicKey(senderAddress);
      const amountInLamports = Math.round(amount * LAMPORTS_PER_SOL);

      const balance = await connection.getBalance(senderPublicKey);
      if (balance < amountInLamports) {
        throw new Error(
          `Insufficient SOL balance. You have ${(
            balance / LAMPORTS_PER_SOL
          ).toFixed(6)} SOL, but need ${(
            amountInLamports / LAMPORTS_PER_SOL
          ).toFixed(6)} SOL`
        );
      }

      // Get recent blockhash and create transaction
      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPublicKey,
      });

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: amountInLamports,
        })
      );

      if (!window.solana) {
        throw new Error("Wallet is not available");
      }

      const { signature } = await window.solana.signAndSendTransaction(
        transaction
      );
      setTxSignature(signature);

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      // Wait for confirmation with timeout
      try {
        await Promise.race([
          connection.confirmTransaction(signature, "confirmed"),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Transaction confirmation timeout")),
              30000
            )
          ),
        ]);
      } catch (confirmError) {
        // Even if confirmation times out, the transaction might still be successful
        // We'll proceed to log it and let the user know
        toast({
          title: "Transaction Processing",
          description:
            "Transaction may still be processing. Check Solana Explorer for status.",
        });
      }

      const nairaAmount = parseFloat(removeCommas(nairaInput));
      const solAmount = parseFloat(donationAmount);

      // Use server-side API endpoint instead of direct Supabase calls
      try {
        const response = await fetch("/api/crypto-donations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cause_id: causeId,
            tx_signature: signature,
            amount_in_sol: solAmount,
            amount_in_naira: nairaAmount,
            wallet_address: senderAddress,
            recipient_address: recipientAddress,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API call failed: ${errorData.error}`);
        }

        const result = await response.json();

        // Call success callback to update parent component
        onDonationSuccess?.(nairaAmount);

        toast({
          title: "Success",
          description: "Thank you for your donation!",
        });
      } catch (logError) {
        console.error("Failed to log transaction:", logError);
        // Don't throw here - the blockchain transaction was successful
        toast({
          title: "Warning",
          description:
            "Transaction completed but failed to update records. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Donation error:", err);

      let userFriendlyMessage = "Donation failed. Please try again.";
      const errorMessage = err.message.toLowerCase();

      if (errorMessage.includes("user rejected")) {
        userFriendlyMessage = "Transaction was rejected";
      } else if (errorMessage.includes("network")) {
        userFriendlyMessage = "Network error. Please check your connection";
      } else if (
        errorMessage.includes("insufficient") ||
        errorMessage.includes("balance")
      ) {
        userFriendlyMessage = "Insufficient SOL balance";
      } else if (errorMessage.includes("invalid address")) {
        userFriendlyMessage = "Invalid recipient address";
      } else if (errorMessage.includes("phantom")) {
        userFriendlyMessage = "Please install Phantom wallet";
      } else if (errorMessage.includes("blockhash")) {
        userFriendlyMessage = "Network issue. Please try again";
      } else if (errorMessage.includes("timeout")) {
        userFriendlyMessage =
          "Transaction is taking longer than expected. Check Solana Explorer.";
      }

      toast({
        title: "Error",
        description: userFriendlyMessage,
        variant: "destructive",
      });
      setError(userFriendlyMessage);
    } finally {
      setIsDonating(false);
    }
  };

  if (isLoadingAddress) {
    return <NavigationLoader />;
  }

  if (!recipientAddress) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Donate with SOL
        </h2>
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
          <p>The creator hasn't set up a Solana wallet address.</p>
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
        Donate with SOL
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (SOL)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">SOL</span>
          </div>
          <input
            ref={solInputRef}
            type="number"
            min="0.01"
            step="0.01"
            value={donationAmount}
            onChange={handleSolChange}
            className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isDonating}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (Naira)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₦</span>
          </div>
          <input
            ref={nairaInputRef}
            type="text"
            value={nairaInput}
            onChange={handleNairaChange}
            onKeyDown={handleNairaKeyDown}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isDonating}
            placeholder="0.00"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Using Solana Testnet (1 SOL ≈ ₦{exchangeRate.toFixed(2)})
        </p>
      </div>

      <button
        onClick={handleDonate}
        disabled={isDonating}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isDonating
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
      >
        {isDonating ? "Processing..." : "Donate with SOL"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {txSignature && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <p>Thank you for your donation!</p>
          <p className="mt-1 text-sm">
            Transaction:{" "}
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-800"
            >
              View on Solana Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
