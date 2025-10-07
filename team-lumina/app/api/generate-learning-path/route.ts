import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json();

    const prompt = `
      **Objective:** Create a highly personalized, week-long adaptive learning path for the following student.

      **Student Profile:**
      - Name: ${userProfile.name}
      - Grade Level: ${userProfile.gradeLevel}
      - Learning Style: ${userProfile.learningStyle.join(", ")}
      - Subjects & Priorities: ${userProfile.subjects
        .map(
          (s: any) =>
            `${s.subject} (Priority: ${s.priority}, Level: ${s.currentLevel}/10)`
        )
        .join("; ")}
      - Study Days: ${userProfile.studyDays.join(", ")}
      - Preferred Study Times: ${userProfile.preferredStudyTime.join(", ")}
      - Attention Span: ${userProfile.attentionSpan} minutes
      - Motivation Factors: ${userProfile.motivationFactors.join(", ")}

      **Task:**
      1.  Generate a sequence of 10-15 learning modules distributed across their available study days.
      2.  The module titles MUST be specific and actionable (e.g., "Introduction to Quadratic Equations", "Practice: Solving for X", "Review: Photosynthesis Basics").
      3.  For each module, define its subject, difficulty (1-10), estimated time (in minutes), and a list of prerequisite module IDs. The first module for each subject should have no prerequisites.
      4.  The path should be logical, with foundational topics coming before advanced ones.
      5.  Incorporate their preferences. For example, if they prefer mornings, schedule more complex topics then. If their attention span is short, create shorter modules.

      **Output Format:**
      Respond with a single, valid JSON object containing a "modules" array. Each object in the array must have the following structure:
      {
        "id": "string (a unique identifier, e.g., 'math-alg-1')",
        "title": "string",
        "subject": "string",
        "difficulty": "number",
        "estimatedTime": "number",
        "prerequisites": "string[]"
      }
    `;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      system:
        "You are an expert AI curriculum designer. Create a detailed, personalized, and structured learning path in a valid JSON format.",
    });

    // Basic JSON extraction
    const jsonString = result.text.substring(
      result.text.indexOf("{"),
      result.text.lastIndexOf("}") + 1
    );
    const learningPath = JSON.parse(jsonString);

    return NextResponse.json(learningPath);
  } catch (error) {
    console.error("Error generating learning path:", error);
    return NextResponse.json(
      { error: "Failed to generate learning path" },
      { status: 500 }
    );
  }
}
