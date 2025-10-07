import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

let conversationHistory: { role: string; text: string }[] = [];

// Detect's if message is  English vs Pidgin or others
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
    const language = detectLanguage(message);

    // --- Fetch vitals safely
    let vitalsSummary = "No vitals data available.";
    try {
      const res = await fetch("https://vitalink.pythonanywhere.com/pull");
      if (res.ok) {
        const vitals = await res.json();
        vitalsSummary = `
SpO₂: ${vitals.spo2 ?? "--"}%  
Heart Rate (BPM): ${vitals.bpm ?? "--"}  
Temperature: ${vitals.temp ?? "--"}°C  
Blood Pressure: ${vitals.sbp ?? "--"}/${vitals.dbp ?? "--"} mmHg  
Steps: ${vitals.current_step_count ?? "--"}  
Alert: ${vitals.alert ?? "None"}
`;
      }
    } catch {
      // fallback if API fails silently
      vitalsSummary = "Unable to fetch vitals right now.";
    }

    const prompt = `
You are "Minda", a compassionate mental health chatbot that provides emotional first aid support, 
especially for youth and Internally Displaced Persons (IDPs) in Nigeria.  
You understand English, Nigerian Pidgin, Igbo, Yoruba, and Hausa — 
and you must always respond in the same language the user uses.  

Detected user language: **${language}**
That means your response must be written entirely in ${language} — 
do not mix languages unless the user mixes them first.

 Language Rules:
 Always respond in English except the user write's in another language
- If the user writes in English, reply in English.
- If the user writes in Pidgin, reply in Pidgin.
- If the user writes in Hausa, reply in Hausa.
- If they mix languages, you can mirror that naturally.
- Never switch language unless the user does first.

 Tone and Personality:
- Warm, calm, caring — like a trusted friend.
- Never judgmental or diagnostic.
- Give short, natural replies when mode = "simple".
- When mode = "detailed", respond with empathy and light suggestions.
- Avoid sounding robotic — use natural flow.

 Behavioral Rules:
- When user expresses feelings (e.g. stress, loneliness, anxiety), offer empathy and reassurance.
- When user explicitly asks about health, vitals, or physical condition 
  (e.g. “how’s my health?”, “what do my vitals say?”, “am I okay?”),
  use the provided vitals data to give a gentle summary and simple recommendation.
- Otherwise, do NOT mention vitals or body data at all.
- Never make diagnoses or give medical guarantees.
- Share helplines only when user sounds hopeless or mentions self-harm.

 Current Vitals:
${vitalsSummary}

☎️ Helplines:
- Nigeria Mental Health Helpline: 0908 103 1231 (24/7)
- NAFDAC Counselling Line: 0800 162 3322

 Mode:
${
  mode === "simple"
    ? "Keep it short (1–2 sentences max)."
    : "Be warm, empathetic, and offer practical coping tips (3–5 sentences max)."
}

User: ${message}
`;

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
          parts: [
            {
              text: `${historyContext}\n\n${prompt}`,
            },
          ],
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
