import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing Google AI SDK...");
    console.log("API Key available:", !!process.env.GOOGLE_API_KEY);
    console.log("API Key length:", process.env.GOOGLE_API_KEY?.length);

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Say hello in one sentence.",
      system: "You are a helpful assistant.",
    });

    return NextResponse.json({
      success: true,
      response: result.text,
      apiKeyAvailable: !!process.env.GOOGLE_API_KEY,
    });
  } catch (error: any) {
    console.error("AI SDK Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      apiKeyAvailable: !!process.env.GOOGLE_API_KEY,
    });
  }
}
