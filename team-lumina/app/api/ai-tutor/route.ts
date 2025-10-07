import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google"; // Google AI SDK provider

export async function POST(request: NextRequest) {
  try {
    const { userProfile, question, context } = await request.json();

    const prompt = `You are an AI tutor helping a student with the following profile:

Student Profile:
- Name: ${userProfile.name}
- Exam: ${userProfile.examType}
- Learning Style: ${userProfile.learningStyle.join(", ")}
- Current Subjects: ${userProfile.subjects
      .map((s: any) => `${s.subject} (Level ${s.currentLevel})`)
      .join(", ")}
- Learning Challenges: ${userProfile.learningChallenges.join(", ")}
- Motivation Factors: ${userProfile.motivationFactors.join(", ")}

Student Question: "${question}"
Context: ${context || "General help request"}

Provide a helpful, personalized response that:
1. Addresses their specific question in a conversational manner.
2. Adapts to their learning style and level for the ${
      userProfile.examType
    } exam.
3. Provides step-by-step guidance if needed.
4. Suggests relevant study materials, YouTube videos, or study tips.
5. Encourages them based on their motivation factors.

Keep the response engaging and appropriate for their learning level. If the user provides feedback, acknowledge it graciously.
`;

    let text: string | null = null;
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
        system:
          "You are a patient, encouraging AI tutor who adapts teaching methods to each student's unique learning profile. You can share study materials, suggest videos, and provide study tips.",
      });
      text = result.text;
    } catch (sdkError) {
      console.warn("Gemini SDK unavailable, returning stub content.", sdkError);
      text =
        "I'm sorry, I couldn't process your request at the moment. Please try again later.";
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in AI tutor:", error);
    return NextResponse.json(
      { error: "Failed to get tutor response" },
      { status: 500 }
    );
  }
}
