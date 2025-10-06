// getGeminiResponse.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

// --- 1. Fetch live vitals ---
async function fetchVitals() {
  try {
    const res = await fetch("https://vitalink.pythonanywhere.com/pull");
    if (!res.ok) throw new Error("Failed to fetch vitals");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Vitals fetch error:", error);
    return null;
  }
}

// --- 2. Helper: Create summary and flags for abnormal vitals ---
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

// --- 3. Main Gemini function ---
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

    // --- 4. Send to Gemini ---
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are "Vitalink Health Bot" — an empathetic, wellness-focused assistant.

Below is the user's **real-time health data** from their monitoring device:
${vitalsSummary}

Your role:
- Use the live vitals above to answer questions naturally.
- If vitals are outside normal range, explain what it might mean and offer friendly, actionable advice (e.g., rest, hydration, deep breathing).
- If vitals are normal, reassure and encourage healthy maintenance.
- If the user asks about non-health topics, reply:
  "I'm designed to focus on health and wellbeing. Could you ask me something health-related?"
- Never diagnose or prescribe treatment — just educate, guide, and encourage.

User: ${message}
AI:
              `,
            },
          ],
        },
      ],
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help, but I couldn't get a response right now.";

    console.log("Gemini response:", text);
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again later.";
  }
};
