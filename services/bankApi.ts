// DANGER: In a real-world application, this secret key MUST be kept on a secure backend server.
// It is exposed here only for the purpose of this demonstration within a sandboxed environment.
// Exposing your secret key in frontend code will lead to your account being compromised.
const PAYSTACK_SECRET_KEY = 'sk_test_6b826d4b90129a53cddaa42bafac7202cbdaa026';
const PAYSTACK_API_BASE = 'https://api.paystack.co';

export interface Bank {
    name: string;
    code: string;
}

/**
 * Fetches the list of all supported banks from Paystack.
 * @returns A promise that resolves to an array of banks.
 */
export const getBankList = async (): Promise<Bank[]> => {
    try {
        const response = await fetch(`${PAYSTACK_API_BASE}/bank?currency=NGN`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bank list from Paystack.');
        }

        const data = await response.json();
        if (!data.status) {
            throw new Error(data.message || 'Paystack returned an error while fetching banks.');
        }

        // Map the response to the simpler Bank interface and sort alphabetically
        return data.data.map((bank: any) => ({
            name: bank.name,
            code: bank.code,
        })).sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("Error fetching Paystack bank list:", error);
        throw new Error("Could not load bank list. Please check your connection.");
    }
};

/**
 * Verifies bank account details using the live Paystack API.
 * NOTE: Paystack's test mode has a daily limit on live bank resolves.
 * If you exceed this, you may see an error.
 * @param {object} details - The account number and bank code.
 * @returns A promise that resolves with the account holder's name.
 */
export const resolveAccountNumber = async (
    { accountNumber, bankCode }: { accountNumber: string; bankCode: string }
): Promise<{ accountName: string }> => {
    if (!accountNumber || accountNumber.length !== 10 || !bankCode) {
        // Return a rejection instead of throwing an error to be consistent with API call failures
        return Promise.reject(new Error('Invalid account details provided.'));
    }
    
    try {
        const response = await fetch(`${PAYSTACK_API_BASE}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = await response.json();
        
        if (!response.ok || !data.status) {
             throw new Error(data.message || `Error resolving account: ${response.statusText}`);
        }

        return {
            accountName: data.data.account_name,
        };

    } catch (error) {
        console.error("Error resolving Paystack account:", error);
        if (error instanceof Error) {
            // Re-throw the specific error message from Paystack or fetch
            throw new Error(error.message);
        }
        // Fallback error message
        throw new Error("Could not verify account details. Please check the information and try again.");
    }
};


/**
 * Simulates initiating a transfer.
 * In a real app, this would be a secure backend call to a service that uses the Paystack API.
 * The transfer API should never be called directly from the frontend for security reasons.
 */
export const initiateTransfer = (
     { accountNumber, bankCode, amount, narration }: { accountNumber: string; bankCode: string, amount: number, narration?: string }
): Promise<{ success: boolean; message: string }> => {
     console.log('Simulating transfer:', { accountNumber, bankCode, amount, narration });
     return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'Transfer successful!' });
        }, 1500); // 1.5-second delay for simulation
    });
};