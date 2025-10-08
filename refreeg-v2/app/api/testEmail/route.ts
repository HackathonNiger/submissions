import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/services/mail";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const response = await sendTestEmail(email);
  return NextResponse.json(response);
}
