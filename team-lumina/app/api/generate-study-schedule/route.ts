import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

// Helper to extract JSON from the AI's potentially messy response string
function extractJson(text: string | null): string | null {
  if (!text) return null;
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex)
    return null;
  return text.substring(startIndex, endIndex + 1);
}

// Helper function to create a fallback plan if the AI fails
function getFallbackPlan(userProfile: any) {
  return {
    schedule: [
      {
        day: "Monday",
        time: "10:00 AM",
        subject: userProfile.subjects[0]?.subject || "Core Subject",
        activity: "Review key concepts",
        duration: 45,
      },
      {
        day: "Wednesday",
        time: "2:00 PM",
        subject: userProfile.subjects[1]?.subject || "Secondary Subject",
        activity: "Practice problems",
        duration: 60,
      },
      {
        day: "Friday",
        time: "4:00 PM",
        subject: userProfile.subjects[0]?.subject || "Core Subject",
        activity: "Take a practice quiz",
        duration: 30,
      },
    ],
    tips: [
      "This is a fallback schedule. The AI model is currently busy, please try again later for a more personalized plan.",
      "Remember to take short breaks every 25-30 minutes to stay focused.",
      "Review your notes from the previous session before starting a new one.",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json();

    const prompt = `
      **Objective:** Create a highly personalized, weekly study schedule and a set of actionable study tips for the following student.

      **Student Profile:**
      - Name: ${userProfile.name}
      - Grade Level: ${userProfile.gradeLevel}
      - Learning Style(s): ${userProfile.learningStyle.join(", ")}
      - Subjects & Priorities: ${userProfile.subjects
        .map(
          (s: any) =>
            `${s.subject} (Priority: ${s.priority}, Level: ${s.currentLevel}/10)`
        )
        .join("; ")}
      - Available Study Days: ${userProfile.studyDays.join(", ")}
      - Preferred Study Times: ${userProfile.preferredStudyTime.join(", ")}
      - Attention Span: ${userProfile.attentionSpan} minutes per session
      - Preferred Study Environment: ${userProfile.studyEnvironment}
      - Motivation Factors: ${userProfile.motivationFactors.join(", ")}

      **Task:**
      1.  **Create a Schedule:** Generate a detailed schedule for one week. Distribute the subjects across the student's available study days.
          - For each scheduled item, specify the "day", "time" (e.g., "9:00 AM"), "subject", a specific "activity" (e.g., "Review Chapter 3", "Practice Problems", "Watch Explainer Video"), and "duration" in minutes.
          - The schedule should respect their preferred study times and session lengths (attention span).
      2.  **Create Study Tips:** Generate a list of 5-7 personalized study tips. These tips must be directly related to the student's profile (e.g., "Since you're a visual learner, try creating mind maps for History." or "To stay motivated by achievement, break down your Math goals into smaller, trackable milestones.").

      **Output Format:**
      Respond with a single, valid JSON object with two keys: "schedule" and "tips".
      - "schedule": An array of objects, where each object is a study session: { day: string, time: string, subject: string, activity: string, duration: number }
      - "tips": An array of strings.
    `;

    let text: string | null = null;
    try {
      // The AI SDK has built-in retries, but we add our own fallback for robustness
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
        system:
          "You are an expert AI academic advisor. You create practical, personalized study plans in a valid JSON format.",
      });
      text = result.text;
    } catch (sdkError: any) {
      // If the SDK's retries fail (e.g., due to overload), we'll catch it here.
      console.warn("AI model call failed after retries:", sdkError.message);
      // We will proceed with `text` as null, which triggers our fallback logic.
    }

    let plan;
    if (text) {
      try {
        const jsonString = extractJson(text);
        plan = jsonString ? JSON.parse(jsonString) : null;
      } catch (e) {
        console.error(
          "Failed to parse AI response as JSON:",
          e,
          "Raw text:",
          text
        );
        plan = null;
      }
    }

    // If parsing fails or the AI call failed, use the fallback plan
    if (!plan || !plan.schedule || !plan.tips) {
      console.log("Using fallback study plan.");
      plan = getFallbackPlan(userProfile);
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error generating study schedule:", error);
    return NextResponse.json(
      { error: "Failed to generate study schedule" },
      { status: 500 }
    );
  }
}
