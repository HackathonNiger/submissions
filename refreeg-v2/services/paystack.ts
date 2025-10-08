import { ICreateSubaccount, TransactionData } from "@/types";
import axios from "axios"; /// Get API key from appropriate environment variable
import { getBaseURL } from "@/lib/utils";

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

// Check if API key exists
if (!PAYSTACK_KEY) {
  console.warn(
    "WARNING: No Paystack API key found in environment variables. API calls will fail."
  );
}

const Paystack = {
  api: axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${PAYSTACK_KEY}`,
      "Content-Type": "application/json",
    },
  }),

  initializeTransaction: async function (data: TransactionData) {
    try {
      console.log("Initializing transaction with data:", data);

      // Validate required fields
      if (!data.amount) {
        throw new Error(
          "Missing required fields for transaction initialization"
        );
      }
      const baseUrl = await getBaseURL();
      console.log(data.isAnonymous);
      const requestData = {
        currency: "NGN",
        email: data.email,
        amount: Math.round((data.amount + data.serviceFee) * 100), // Ensure amount is rounded to avoid floating point issues
        callback_url: `${baseUrl}/causes/${data.causeId}/payment/verify`,
        transaction_charge: data.serviceFee * 100,
        subaccount: data.subaccounts[0].subaccount,
        bearer: "subaccount",
        metadata: {
          user_id: data.id,
          amount: data.amount,
          customer_name: data.full_name,
          cause_id: data.causeId,
          email: data.email,
          message: data.message,
          is_anonymous: data.isAnonymous,
        },
      };

      const response = await this.api.post(
        "/transaction/initialize",
        requestData
      );

      return response.data.data as {
        authorization_url: string;
        reference: string;
        access_code: string;
      };
    } catch (error: any) {
      console.error("Paystack initialization error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data?.message,
      });

      throw new Error(
        error.response?.data?.message ||
          "Failed to initialize payment transaction"
      );
    }
  },
  verifyTransaction: async function (transactionReference: string) {
    const response = await this.api.get(
      `/transaction/verify/${transactionReference}`
    );
    return response.data.data.status === "success";
  },
  createSubaccount: async function (data: ICreateSubaccount) {
    const response = await this.api.post("/subaccount", {
      ...data,
      settlement_bank: data.bank_code,
    });

    return response.data.data as {
      subaccount_code: string;
      account_number: string;
    };
  },
  listBanks: async function () {
    try {
      const response = await this.api.get("/bank", {
        params: { country: "nigeria", perPage: 100 },
      });

      return response.data.data as {
        name: string;
        code: string;
      }[];
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  },
  verifyAccountNumber: async function (
    accountNumber: string,
    bankCode: string
  ) {
    try {
      const response = await this.api.get("/bank/resolve", {
        params: { account_number: accountNumber, bank_code: bankCode },
      });

      return response.data.data as {
        account_name: string;
        bank_id: number;
      };
    } catch (error: any) {
      console.error(
        "Error verifying account:",
        error.response?.data || error.message || error
      );

      throw new Error(
        error.response?.data?.message || "Failed to verify account number"
      );
    }
  },
};

export default Paystack;
