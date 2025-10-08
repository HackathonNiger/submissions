import { NextResponse } from "next/server";
import { createDonation } from "@/actions";
import { calculateServiceFee } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

// Define types for Paystack webhook data
interface PaystackWebhookData {
    event: string;
    data: {
        reference: string; // Paystack transaction reference
        metadata: {
            user_id: string;
            cause_id: string;
            amount: number;
            customer_name: string;
            email: string;
            message: string;
            is_anonymous: boolean;
        };
    };
}

export async function POST(request: Request) {
    try {
        const payload = await request.text();
        if (!payload) {
            return new NextResponse(JSON.stringify({
                error: "Empty payload received"
            }), { status: 400 });
        }

        const webhookData = JSON.parse(payload) as PaystackWebhookData;

        // Validate required fields
        if (!webhookData?.event || !webhookData?.data?.metadata || !webhookData?.data?.reference) {
            return new NextResponse(JSON.stringify({
                error: "Invalid webhook data structure"
            }), { status: 400 });
        }

        const { event, data } = webhookData;
        const { metadata, reference } = data;

        // Validate metadata fields
        if (!metadata?.cause_id || !metadata?.amount || !metadata?.customer_name) {
            return new NextResponse(JSON.stringify({
                error: "Missing required metadata fields"
            }), { status: 400 });
        }

     

        const amount = Number(metadata.amount)
        const serviceFee = calculateServiceFee(amount)
        const correctAmount = amount - serviceFee

        switch (event) {
            case "charge.success":
                await createDonation(
                    metadata.cause_id,
                    metadata.user_id,
                    {
                        amount: correctAmount,
                        email: metadata.email,
                        message: metadata.message,
                        isAnonymous: metadata.is_anonymous,
                        name: metadata.customer_name
                    }
                );
                return new NextResponse(JSON.stringify({
                    message: 'Webhook received and processed successfully'
                }), { status: 201 });
            default:
                return new NextResponse(JSON.stringify({
                    message: 'Webhook event not supported yet'
                }), { status: 200 });
        }
    } catch (e) {
        console.error("Webhook processing error:", e);
        return new NextResponse(JSON.stringify({
            error: e instanceof Error ? e.message : "An unknown error occurred",
            message: `An error occurred: ${e}`
        }), { status: 500 });
    }
}

