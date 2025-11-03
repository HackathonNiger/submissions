import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    return NextResponse.json({
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : null,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('GOOGLE')),
    });
  } catch (error) {
    console.error("Error testing API key:", error);
    return NextResponse.json(
      { error: "Failed to test API key" },
      { status: 500 }
    );
  }
} 