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

export async function POST(request: NextRequest) {
  try {
    const { userProfile, subject, topic, contentType, customPrompt } =
      await request.json();

    const subjectInfo = userProfile.subjects.find(
      (s: any) => s.subject === subject
    );

    // Generate a unique ID for this specific piece of content
    const contentId = crypto.randomUUID();

    const prompt = `
      You are an expert AI educator. Your task is to generate a high-quality, personalized learning module for a student.

      **Student Profile:**
      - Name: ${userProfile.name}
      - Learning Style: ${userProfile.learningStyle.join(", ")}
      - Current Level in ${subject}: ${subjectInfo?.currentLevel || 5}/10
      - Goals: ${userProfile.primaryGoals.join(", ")}

      **Content Request:**
      - Subject: ${subject}
      - Topic: ${topic || "a core concept"}
      - Content Type: ${contentType}
      - Custom Request: ${customPrompt || "None"}

      **Instructions:**
      1.  **Generate REAL, FACTUAL, and DETAILED content.** This is not a placeholder. If the type is 'lesson', provide a full, explanatory lesson. If it's a 'summary', create a comprehensive summary.
      2.  **Explanation:** The "explanation" field must be thorough. For a 'lesson', it should be several paragraphs long, breaking down the topic clearly.
      3.  **Adaptation:** Tailor the language, complexity, and examples to the student's learning style and level.
      4.  **Unique ID:** The root of your JSON response must include an "id" field with the value: "${contentId}".

      **JSON Structure:**
      Format the entire response as a single, valid JSON object with the following keys:
      - "id": string (use the provided ID)
      - "explanation": string (detailed, multi-paragraph text)
      - "examples": string[] (3-5 relevant and clear examples)
      - "exercises": Array of { "question": string, "difficulty": string, "type": string }
      - "tips": string[] (actionable learning tips)
      - "nextSteps": string[] (what the student should do after this module)
      ${
        userProfile.learningStyle.includes("visual")
          ? `- "youtubeSuggestions": string[] (3-5 relevant YouTube video search queries)`
          : ""
      }
    `;

    let text: string | null = null;
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
        system:
          "You are an expert educational content creator. Always respond with a single, valid JSON object containing detailed, factual, and personalized learning content based on the user's profile.",
      });
      text = result.text;
    } catch (sdkError) {
      console.warn("Gemini SDK unavailable, returning stub content.", sdkError);
    }

    let content;
    try {
      const jsonString = extractJson(text);
      content = jsonString ? JSON.parse(jsonString) : null;
    } catch (e) {
      console.error(
        "Failed to parse AI response as JSON:",
        e,
        "Raw text:",
        text
      );
      content = null;
    }

    // Fallback stub content
    if (!content) {
      content = {
        id: contentId,
        explanation: `This is a fallback explanation for ${
          topic || subject
        }. The AI model may be temporarily unavailable. Please try generating again shortly.`,
        examples: ["Fallback Example 1", "Fallback Example 2"],
        exercises: [
          {
            question: "Fallback practice question.",
            difficulty: "Medium",
            type: "Short Answer",
          },
        ],
        tips: ["Try generating content again in a few moments."],
        nextSteps: ["Click 'Generate Content' to retry."],
        youtubeSuggestions: userProfile.learningStyle.includes("visual")
          ? [`"How to debug AI content generation"`]
          : [],
      };
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating personalized content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
