import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

let conversationHistory: { role: string; text: string }[] = [];

// Detect if it's English vs Pidgin or others
const detectLanguage = (text: string): string => {
  const lower = text.trim().toLowerCase();
  if (/(?:una|dey|abeg|wahala|wetin|go|na|wan|fit|no vex)/.test(lower)) {
    return "Pidgin";
  } else if (/(?:haba|wallahi|kai|ina|yaya|nagode|barka)/.test(lower)) {
    return "Hausa";
  } else if (/(?:bawoni|se|ekaro|nko|epele|kaabo)/.test(lower)) {
    return "Yoruba";
  } else if (/(?:kedụ|bia|ọ|ị|anyị|unu|anyị)/.test(lower)) {
    return "Igbo";
  }
  return "English";
};

export const getGeminiResponse = async (
  message: string,
  mode: "simple" | "detailed" = "detailed"
) => {
  try {
    // Detect user language
    const language = detectLanguage(message);

    // --- Fetch vitals safely
    let vitalsSummary = "No vitals data available.";
    try {
      const res = await fetch("https://vitalink.pythonanywhere.com/pull");
      if (res.ok) {
        const vitals = await res.json();
        vitalsSummary = `
SpO₂: ${vitals.spo2 ?? "--"}%  
Heart Rate: ${vitals.bpm ?? "--"} BPM  
Temperature: ${vitals.temp ?? "--"}°C  
Blood Pressure: ${vitals.sbp ?? "--"}/${vitals.dbp ?? "--"} mmHg  
Steps: ${vitals.current_step_count ?? "--"}  
Alert: ${vitals.alert ?? "None"}
`;
      }
    } catch {
      vitalsSummary = "Unable to fetch vitals right now.";
    }

    const prompt = `
You are "Minda", a compassionate mental health chatbot for emotional first aid, 
especially for youth and IDPs in Nigeria.

You understand English, Nigerian Pidgin, Igbo, Yoruba, and Hausa — 
and must always respond **in the same language** the user writes in.

 Detected user language: **${language}**
That means your response must be written entirely in ${language} — 
do not mix languages unless the user mixes them first.

Tone and Personality:
- Warm, calm, supportive — like a trusted friend.
- Never judgmental or diagnostic.
- Respond naturally and kindly.
- ${
      mode === "simple"
        ? "Keep it short (1–2 sentences)."
        : "Be empathetic and offer light coping advice (3–5 sentences)."
    }

Behavioral Rules:
- If user expresses feelings (e.g., stress, loneliness, worry), offer empathy and reassurance.
- Only mention health vitals if user **explicitly asks** about health or vitals.
- Never make diagnoses or promises.
- Share helplines only if user sounds hopeless or mentions self-harm.

 Current Vitals:
${vitalsSummary}

 Helplines:
- Nigeria Mental Health Helpline: 0908 103 1231
- NAFDAC Counselling Line: 0800 162 3322

User: ${message}
`;

    // Maintain short memory
    conversationHistory.push({ role: "user", text: message });
    if (conversationHistory.length > 10)
      conversationHistory = conversationHistory.slice(-10);

    const historyContext = conversationHistory
      .map((msg) => `${msg.role === "user" ? "User" : "Minda"}: ${msg.text}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${historyContext}\n\n${prompt}` }],
        },
      ],
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I’m here for you, but I couldn’t get a response right now.";

    conversationHistory.push({ role: "ai", text });
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I’m having trouble responding right now. Please try again later.";
  }
};
