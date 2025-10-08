"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useDonation } from "@/hooks/use-donation";
import { useProfile } from "@/hooks/use-profile";
import { calculateServiceFee } from "@/lib/utils";
import paystack from "@/services/paystack";
import { usePayment } from "@/hooks/use-payment";

interface DonationFormProps {
  causeId: string;
  profile: {
    email?: string;
    name?: string;
    id?: string;
  };
  subaccount?: string;
  status: "pending" | "rejected" | "approved";
}

export function DonationForm({
  causeId,
  profile,
  status,
  subaccount,
}: DonationFormProps) {
  const { initializePayment, isLoading } = usePayment();
  const [formData, setFormData] = useState({
    amount: "",
    name: profile?.name || "",
    email: profile?.email || "",
    message: "",
    isAnonymous: false,
  });

  const isDisabled =
    status === "pending" || status === "rejected" ? true : false;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(formData.isAnonymous);
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isAnonymous: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await initializePayment({
      email: formData.email,
      amount: Number(formData.amount),
      causeId: causeId,
      id: profile.id || "",
      full_name: formData.name,
      serviceFee: serviceFee,
      subaccounts: [
        { subaccount: subaccount || "", share: Number(formData.amount) * 100 },
      ],
      message: formData.message,
      isAnonymous: formData.isAnonymous,
    });
  };

  const donationAmount = Number(formData.amount) || 0;
  const serviceFee = calculateServiceFee(donationAmount);
  const totalAmount = donationAmount + serviceFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>
          Your contribution helps make a difference
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (₦)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount in Naira"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required={!formData.isAnonymous}
              disabled={formData.isAnonymous}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Leave a message of support"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="anonymous">Donate anonymously</Label>
          </div>

          {donationAmount > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Donation Amount</span>
                <span>₦{donationAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Amount</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading || isDisabled}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Donate Now"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
