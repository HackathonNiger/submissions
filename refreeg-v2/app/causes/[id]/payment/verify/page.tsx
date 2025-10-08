"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { usePayment } from "@/hooks/use-payment";
import { useQueryState } from "nuqs";

export default function PaymentVerification() {
  const router = useRouter();
  const [reference] = useQueryState("reference");
  const { verifyPayment, error } = usePayment();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        if (!reference) {
          setVerificationStatus("failed");
          setErrorMessage("Invalid payment verification parameters");
          return;
        }

        const isSuccessful = await verifyPayment(reference);

        if (isSuccessful) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setVerificationStatus("success");
        } else {
          setVerificationStatus("failed");
          setErrorMessage("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus("failed");
        setErrorMessage("Failed to verify payment. Please contact support.");
      }
    };

    verifyPaymentStatus();
  }, [reference, verifyPayment]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          {verificationStatus === "loading" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                Verifying Payment
              </h2>
              <p className="text-muted-foreground mt-2">
                Please wait while we verify your payment...
              </p>
            </motion.div>
          )}

          {verificationStatus === "success" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-brand mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                Payment Successful!
              </h2>
              <p className="text-muted-foreground mt-2">
                Thank you for your contribution.
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-brand hover:bg-secondary"
                >
                  Return to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/causes")}
                  className="w-full border-brand text-brand hover:bg-secondary hover:text-secondary-foreground"
                >
                  Browse More Causes
                </Button>
              </div>
            </motion.div>
          )}

          {verificationStatus === "failed" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                Verification Failed
              </h2>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-brand hover:bg-secondary"
                >
                  Return to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/causes")}
                  className="w-full border-brand text-brand hover:bg-secondary hover:text-secondary-foreground"
                >
                  Try Another Cause
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}
