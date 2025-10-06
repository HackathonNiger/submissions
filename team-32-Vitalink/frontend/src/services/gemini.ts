import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

// --- Keep conversation memory in this array ---
let conversationHistory: { role: "user" | "model"; content: string }[] = [];

// --- Fetch live vitals ---
async function fetchVitals() {
  try {
    const res = await fetch("https://vitalink.pythonanywhere.com/pull");
    if (!res.ok) throw new Error("Failed to fetch vitals");
    return await res.json();
  } catch (error) {
    console.error("Vitals fetch error:", error);
    return null;
  }
}

// --- Analyze vitals for abnormalities ---
function analyzeVitals(vitals: any) {
  if (!vitals) return "No vitals available.";

  const issues: string[] = [];

  if (vitals.spo2 < 95)
    issues.push(`Low oxygen level detected (${vitals.spo2}%).`);
  if (vitals.bpm > 100) issues.push(`High heart rate (${vitals.bpm} bpm).`);
  else if (vitals.bpm < 50) issues.push(`Low heart rate (${vitals.bpm} bpm).`);
  if (vitals.temp > 37.5) issues.push(`High temperature (${vitals.temp}°C).`);
  if (vitals.sbp > 130 || vitals.dbp > 85)
    issues.push(`Elevated blood pressure (${vitals.sbp}/${vitals.dbp} mmHg).`);
  if (vitals.current_step_count < 1000)
    issues.push("Low physical activity detected today.");

  return issues.length
    ? `Health flags: ${issues.join(" ")}`
    : "All vitals appear within normal range.";
}

// --- Main Gemini call ---
export const getGeminiResponse = async (message: string) => {
  try {
    const vitals = await fetchVitals();
    const vitalsSummary = vitals
      ? `
SpO2: ${vitals.spo2}%
BPM: ${vitals.bpm}
Temperature: ${vitals.temp}°C
Blood Pressure: ${vitals.sbp}/${vitals.dbp} mmHg
Step Count: ${vitals.current_step_count}
Alert: ${vitals.alert}
Online: ${vitals.online ? "Yes" : "No"}

${analyzeVitals(vitals)}
`
      : "No vitals data available (API unreachable).";

    // --- Add new user message to history ---
    conversationHistory.push({
      role: "user",
      content: message,
    });

    // --- Construct chat context with memory ---
    const chatContext = [
      {
        role: "user",
        parts: [
          {
            text: `
You are "Vitalink Health Bot" — an empathetic, wellness-focused assistant.
Below is the user's real-time health data:
${vitalsSummary}

Your role:
- Use vitals to guide conversations about physical and mental health when necessary.
- Be encouraging and empathetic when the user expresses stress, anxiety, or sadness.
- Suggest general mental wellness practices (like rest, mindfulness, journaling, or talking to someone).
- If vitals are abnormal, explain what it might indicate and give kind, simple advice.
- Never diagnose or prescribe; only guide, reassure, and encourage.
- Stay conversational and remember context from this chat.

Conversation so far:
${conversationHistory
  .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
  .join("\n")}

User: ${message}
AI:
          `,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatContext,
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here for you, but I couldn’t get a response right now.";

    // --- Add AI reply to history ---
    conversationHistory.push({
      role: "model",
      content: text,
    });

    console.log("Gemini response:", text);
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I’m having trouble responding right now. Please try again later.";
  }
};

// --- Reset conversation memory when needed ---
export const resetConversation = () => {
  conversationHistory = [];
};
