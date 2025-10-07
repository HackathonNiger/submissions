// This service integrates the Paystack Checkout widget.
// NOTE: The filename is kept as squadApi.ts to adhere to the platform's file update mechanism.

declare global {
    interface Window {
        PaystackPop: any;
    }
}

export interface PaymentPayload {
    amount: number;
    email: string;
}

export interface PaymentResponse {
    reference: string;
}

const PAYSTACK_PUBLIC_KEY = 'pk_test_7f5f592eb8675901ef71ef67fd67121c0934812a';

const waitForPaystackSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const timeout = 10000; // 10 seconds
        const interval = 100;
        let elapsedTime = 0;

        const check = setInterval(() => {
            if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
                clearInterval(check);
                resolve();
            } else {
                elapsedTime += interval;
                if (elapsedTime >= timeout) {
                    clearInterval(check);
                    reject(new Error('Paystack SDK failed to load in time. Please check your network connection or disable ad-blockers.'));
                }
            }
        }, interval);
    });
};


export const initiatePayment = (
    payload: PaymentPayload
): Promise<PaymentResponse> => {
    return new Promise((resolve, reject) => {
        waitForPaystackSDK()
            .then(() => {
                const handler = window.PaystackPop.setup({
                    key: PAYSTACK_PUBLIC_KEY,
                    email: payload.email,
                    amount: payload.amount * 100, // Paystack uses kobo
                    currency: 'NGN',
                    ref: `finxchange_${Date.now()}`,
                    onClose: () => {
                        console.log('Paystack widget closed by user.');
                        reject(new Error('Payment modal closed by user.'));
                    },
                    callback: (response: PaymentResponse) => {
                        console.log('Paystack payment successful:', response);
                        // In a real app, verify the transaction with the reference on the backend.
                        resolve(response);
                    },
                });
                handler.openIframe();
            })
            .catch(err => {
                console.error("Paystack SDK not loaded or initialized correctly.", err);
                reject(err);
            });
    });
};