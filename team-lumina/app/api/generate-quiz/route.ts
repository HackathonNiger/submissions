import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

/**
 * A more robust function to extract a JSON object from a string that might contain other text.
 * It finds the first '{' and the last '}' to isolate the JSON block.
 * @param text The string returned by the AI.
 * @returns A valid JSON string, or null if one cannot be found.
 */
function extractJson(text: string | null): string | null {
  if (!text) return null;

  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return null;
  }

  // Extract the potential JSON string
  return text.substring(startIndex, endIndex + 1);
}

export async function POST(request: NextRequest) {
  try {
    const {
      userProfile,
      subject,
      topic,
      difficulty,
      questionCount,
      questionTypes,
    } = await request.json();

    const subjectInfo = userProfile.subjects.find(
      (s: any) => s.subject === subject
    );

    // --- PROMPT ENHANCEMENTS ---
    const prompt = `
**PRIMARY GOAL: Generate a quiz about the specific topic: "${topic}" within the broader subject of "${subject}". The questions MUST be directly related to "${topic}".**

**CRITICAL INSTRUCTION: Do NOT generate generic questions about the subject. Every question must test knowledge of the specified topic: "${topic}".**

**CRITICAL INSTRUCTION 2: Every time you generate a quiz, create a completely new and unique set of questions. Do not repeat questions from previous requests. Use this randomization seed to ensure uniqueness: ${Date.now()}**

**Student Profile:**
- Learning Style: ${userProfile.learningStyle.join(", ")}
- Current Level in ${subject}: ${subjectInfo?.currentLevel || 5}/10

**Quiz Details:**
- Number of Questions: ${questionCount}
- Question Types: ${questionTypes.join(", ")}
- Difficulty: ${difficulty}

Instructions:
- Create a quiz with a mix of the requested question types.
- For "multiple_choice", provide an "options" array and a "correctAnswer" string.
- For "fill_in_the_blank", the "question" should contain a "____" placeholder, and "correctAnswer" should be the word(s) that fit in the blank.
- Each question must have a clear "explanation" for the correct answer.
- Tailor the question difficulty to the student's current level.

Format the entire response as a single, valid JSON object with a "questions" array. Each question object in the array should have: { id: number, type: string, question: string, options?: string[], correctAnswer: string, explanation: string, difficulty: string }.
`;

    let text: string | null = null;
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
        system:
          "You are an expert educational assessment creator. You will generate a quiz on a very specific topic provided by the user. You must adhere strictly to the topic. Always respond in a valid JSON format.",
      });
      text = result.text;
    } catch (sdkError) {
      console.warn("Gemini SDK unavailable, returning stub quiz.", sdkError);
    }

    let quiz;
    try {
      const jsonString = extractJson(text);
      quiz = jsonString ? JSON.parse(jsonString) : null;
    } catch (e) {
      console.error(
        "Failed to parse AI response as JSON:",
        e,
        "Raw text:",
        text
      );
      quiz = null;
    }

    // Fallback quiz if AI fails or JSON is invalid
    if (!quiz || !quiz.questions) {
      quiz = {
        questions: [
          {
            id: 1,
            type: "multiple_choice",
            question: `What is the powerhouse of the cell? (This is a fallback question because the AI failed to generate one for ${topic})`,
            options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
            correctAnswer: "Mitochondria",
            explanation:
              "Mitochondria are responsible for generating most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
            difficulty: "Easy",
          },
        ],
      };
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
