import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { marked } from "marked";

export async function POST(request: NextRequest) {
  try {
    const { userProfile, year, subject, question } = await request.json();

    const prompt = `
      You are an expert WAEC tutor AI. Your task is to provide a clear, step-by-step explanation for a past WAEC question.

      **Student Profile:**
      - Name: ${userProfile.name}
      - Learning Style: ${userProfile.learningStyle.join(", ")}

      **Question Details:**
      - Exam Year: ${year}
      - Subject: ${subject}
      - Question: "${question}"

      **Instructions:**
      1.  **Analyze the Question:** Break down what the question is asking for.
      2.  **Provide a Step-by-Step Solution:** Guide the student through the solution process logically. Use formatting like lists and bold text to make it easy to follow.
      3.  **Explain the Concepts:** Don't just give the answer. Explain the underlying principles or formulas used.
      4.  **Adapt to Learning Style:** If the student is a visual learner, suggest diagrams. If they are a reading/writing learner, be more descriptive.
      5.  **Final Answer:** Clearly state the final answer.
      6.  **Format:** Use Markdown for formatting.

      Provide only the explanation content, ready to be displayed.
    `;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      system:
        "You are an expert WAEC tutor. You provide clear, step-by-step solutions to past questions in Markdown format.",
    });

    const explanationHtml = marked(result.text);

    return NextResponse.json({ explanation: explanationHtml });
  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
