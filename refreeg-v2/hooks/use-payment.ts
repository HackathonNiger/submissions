"use client";
import { useState, useEffect } from "react";
import Paystack from "@/services/paystack";
import { TransactionData } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface UsePaymentReturn {
  initializePayment: (data: TransactionData) => Promise<void>;
  verifyPayment: (reference: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const usePayment = (): UsePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (data: TransactionData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await Paystack.initializeTransaction(data);

      // Store the reference in localStorage for verification after redirect
      localStorage.setItem("payment_reference", response.reference);

      // Redirect to Paystack payment page
      window.location.href = response.authorization_url;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setError("Failed to initialize payment. Please try again.");
      toast({
        title: "Failed to initialize payment. Please try again.",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const isSuccessful = await Paystack.verifyTransaction(reference);

      if (isSuccessful) {
        // Clear the stored reference
        localStorage.removeItem("payment_reference");
        return true;
      } else {
        setError("Payment verification failed");

        return false;
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError("Failed to verify payment");

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
    error,
  };
};
