// getGeminiResponse.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

let conversationHistory: { role: string; text: string }[] = [];

// 🧩 Mental Health Assistant — multilingual (English, Pidgin, Hausa)
export const getGeminiResponse = async (
  message: string,
  mode: "simple" | "detailed" = "detailed"
) => {
  try {
    // 🧠 Context prompt for Gemini
    const prompt = `
You are "Minda", a compassionate mental health chatbot that offers first aid emotional support 
especially for youth and Internally Displaced Persons (IDPs) in Nigeria. 
You can speak fluently in English, Nigerian Pidgin, and Hausa — 
respond in the language the user uses.

Your style:
- Be friendly, calm, and emotionally supportive — like a caring friend.
- Keep responses short and natural when the situation is light (e.g., stress, tiredness, small worries).
- Only share helpline numbers or professional resources when the user seems in deep distress, hopeless, or mentions self-harm, abuse, or trauma.
- Mix gentle encouragement with cultural understanding — you may reply in Pidgin or Hausa if the user speaks that way.
- Never overreact or give clinical diagnosis — just offer empathy and practical coping suggestions.
- You can include voice of care (e.g., “No worry, you go dey alright” or “Ka kwantar da hankalinka”).

Personality:
- Warm, calm, and empathetic.
- Never judgmental or diagnostic.
- Always focuses on emotional support, coping tips, and reassurance.
- If user sounds distressed or hopeless, respond gently and share a helpline contact.

Helplines:
- Nigeria Mental Health Helpline: 0908 103 1231 (24/7)
- NAFDAC Counselling Line: 0800 162 3322

Mode:
- ${
      mode === "simple"
        ? "Short and clear responses (1–2 sentences max)"
        : "Detailed, caring responses with empathy and gentle suggestions"
    }

Guidelines:
- Do NOT give medical diagnoses.
- Do NOT promise treatment or recovery.
- Encourage seeking professional or community help.
- You can respond with calm phrases like “Take a deep breath” or “You’re not alone.”

User: ${message}
`;

    // 🧩 Maintain short memory
    conversationHistory.push({ role: "user", text: message });
    if (conversationHistory.length > 10)
      conversationHistory = conversationHistory.slice(-10);

    const historyContext = conversationHistory
      .map((msg) => `${msg.role === "user" ? "User" : "Minda"}: ${msg.text}`)
      .join("\n");

    // 🪄 Generate Gemini response
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
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I’m here for you, but I couldn’t get a response right now.";

    conversationHistory.push({ role: "ai", text });

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I’m having trouble responding right now. Please try again later.";
  }
};
