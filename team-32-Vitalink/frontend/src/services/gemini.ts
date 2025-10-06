import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

// ✅ Save vitals in localStorage (you can update these dynamically from your UI)
export function saveVitals(vitals: {
  heartRate?: number;
  bloodPressure?: string;
  bmi?: number;
}) {
  localStorage.setItem("vitals", JSON.stringify(vitals));
}

// ✅ Retrieve vitals
export function getVitals() {
  return JSON.parse(localStorage.getItem("vitals") || "{}");
}

// ✅ Main function to get response from Gemini
export const getGeminiResponse = async (message: string) => {
  try {
    const vitals = getVitals();

    const systemPrompt = `
You are "Vitalink Health Bot", an empathetic and knowledgeable virtual assistant specializing in **health and wellness**.

User's current vitals:
- Heart Rate: ${vitals.heartRate || "N/A"} bpm
- Blood Pressure: ${vitals.bloodPressure || "N/A"}
- BMI: ${vitals.bmi || "N/A"}

Your purpose:
- Provide advice, education, and emotional support about mental health, nutrition, fitness, lifestyle, and general wellbeing.
- If the user asks about **non-health topics** (like politics, coding, entertainment, etc.), politely say:
  "I'm designed to focus on health-related topics. Could you please ask me something related to your health or wellbeing?"

Guidelines:
- Use the vitals information when relevant.
- Be supportive, conversational, and empathetic.
- Do **not** give medical prescriptions or diagnoses.
- Keep responses short, friendly, and encouraging.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: message }] },
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
