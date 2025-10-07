import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
// Import the Google AI SDK provider
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const { subject, difficulty, learningStyle, weakAreas } =
      await request.json();

    const prompt = `Generate personalized learning content for a student with the following profile:
    - Subject: ${subject}
    - Difficulty Level: ${difficulty}
    - Learning Style: ${learningStyle}
    - Weak Areas: ${weakAreas.join(", ")}

    Create a structured lesson that includes:
    1. A brief explanation tailored to their learning style
    2. 3 practice problems with increasing difficulty
    3. Tips for improvement in their weak areas

    Format the response as JSON with sections: explanation, problems, tips`;

    let text: string | null = null;
    try {
      // The @ai-sdk/google library automatically picks up GOOGLE_API_KEY from process.env
      // So, you don't need to pass it explicitly in the model configuration.
      const result = await generateText({
        model: google("gemini-2.5-flash"), // API key is now picked from GOOGLE_API_KEY env var
        prompt,
        system:
          "You are an expert educational content creator specialising in personalised learning. Always respond with valid JSON.",
      });
      text = result.text;
    } catch (sdkError) {
      console.warn(
        "Gemini SDK unavailable in preview – returning stub content.",
        sdkError
      );
    }

    let content;
    try {
      content = text ? JSON.parse(text) : null;
    } catch {
      content = null;
    }

    // Fallback stub (works both offline and in the preview sandbox).
    if (!content) {
      content = {
        explanation: `Here's a concise explanation of ${subject} concepts at the ${difficulty} level, tailored for a ${learningStyle} learner.`,
        problems: [
          `Introductory problem on ${weakAreas[0] || subject}`,
          `Intermediate problem on ${subject}`,
          `Advanced problem that combines ${subject} with critical-thinking skills`,
        ],
        tips: [
          "Break complex ideas into smaller pieces",
          "Practise daily in short, focused bursts",
          "Review mistakes immediately after attempting problems",
        ],
      };
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
