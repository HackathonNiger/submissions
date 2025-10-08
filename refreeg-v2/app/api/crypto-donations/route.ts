import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      cause_id,
      tx_signature,
      amount_in_sol,
      amount_in_naira,
      wallet_address,
      recipient_address,
    } = body;

    // Validate required fields
    if (!cause_id || !tx_signature || !amount_in_sol || !amount_in_naira || !wallet_address || !recipient_address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the donation record
    const { data: insertData, error: insertError } = await supabase
      .from("crypto_donations")
      .insert([
        {
          cause_id,
          tx_signature,
          amount_in_sol,
          amount_in_naira,
          wallet_address,
          recipient_address,
          user_id: user.id,
          payment_method: "SOL",
          status: "completed",
          network: "Solana Testnet",
          currency: "SOL",
          wallet_type: "solana",
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to log donation", details: insertError },
        { status: 500 }
      );
    }

    // Update the cause's raised amount
    const { data: updateData, error: updateError } = await supabase.rpc(
      "increment_cause_raised",
      {
        cause_id,
        amount: amount_in_naira,
      }
    );

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update cause amount", details: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      donation_id: insertData.id,
      message: "Donation logged and cause updated successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 