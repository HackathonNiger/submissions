"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useBank } from "@/hooks/use-bank";
import { sendBankAccountAddedEmail } from "@/services/mail";
import { useToast } from "@/components/ui/use-toast";

interface BankDetailsFormProps {
  profile: {
    account_number: string | null;
    bank_name: string | null;
    account_name: string | null;
    sub_account_code: string | null;
  };
  user: {
    id: string;
  };
}

export function BankDetailsForm({ profile, user }: BankDetailsFormProps) {
  const { toast } = useToast();
  const {
    isSubmitting,
    banks,
    isLoadingBanks,
    formData,
    handleBankChange,
    handleBankSubmit,
  } = useBank({
    initialData: profile,
    userId: user.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleBankSubmit(e);
      // Send email notification after successful submission
      await sendBankAccountAddedEmail({
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bank details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
        <CardDescription>
          Add your bank account details for receiving donations.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Your Nigerian bank account number"
              value={formData.accountNumber}
              onChange={(e) =>
                handleBankChange(e.target.value, "accountNumber")
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select
              value={formData.bankName}
              onValueChange={(value) => handleBankChange(value, "bankName")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBanks ? (
                  <SelectItem value="loading" disabled>
                    Loading banks...
                  </SelectItem>
                ) : (
                  banks.map((bank) => (
                    <SelectItem
                      key={`${bank.code}-${bank.name}`}
                      value={bank.name}
                    >
                      {bank.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Name on your bank account"
              value={formData.accountName}
              onChange={(e) => handleBankChange(e.target.value, "accountName")}
              required
            />
          </div>

          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icons.help
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">
                  About Bank Details
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Your bank details are used to receive donations from your
                    causes. Funds will be automatically transferred to this
                    account when donations are made.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Bank Details"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
