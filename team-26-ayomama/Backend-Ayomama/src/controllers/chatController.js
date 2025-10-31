import { groq } from "@ai-sdk/groq";
import { streamText, generateText } from "ai";
import Message from "../models/message.js";
import User from "../models/user.js";

// Safety net for dangerous responses
function safeResponse(text) {
  const redFlags = [
    "ignore doctor",
    "no need to see",
    "unsafe",
    "never visit hospital",
    "skip vaccination",
  ];
  for (let flag of redFlags) {
    if (text.toLowerCase().includes(flag)) {
      return "⚠️ Please consult a qualified medical professional. I cannot provide safe guidance on this matter.";
    }
  }
  return text;
}

export const chatWithAi = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔑 Get user details
    const user = await User.findById(userId).lean();
    const userName = user?.name || "Mummy"; // fallback if no name

    // Save user message
    await Message.create({ user: userId, role: "user", content });

    // Get last 10 messages for context
    const history = await Message.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const systemPrompt = {
      role: "system",
      content: `
        You are Favour, the official AI Assistant of Ayomama 🤱🏽💛.
            
        Your role:
        - Always introduce yourself warmly if there is no prior message history (${
          history.length === 0
        }), assuming it is the user's first time chatting.  
          (Example introduction: "Hi ${userName}! 💛 I'm Favour, your friendly Ayomama assistant 🤰🏽🌸. I'm here to guide you through pregnancy and motherhood with care and support.")
        - Be a **friendly, supportive, and knowledgeable maternal health companion** for expecting and new mothers.
        - Always address the user by their name (${userName}).
        - Keep your tone **warm, caring, encouraging, and culturally sensitive**.
        - Use **emojis naturally** to make responses feel comforting (e.g., 💕, 🤰🏽, 🌸, 🍼, 😊, ⚠️, etc.), but avoid overusing them or including them in medical instructions.
            
        Pregnancy Education:
        - Within the **first 2-3 interactions** with ${userName}, introduce and gently explain the **three pregnancy trimesters**:
          1. What each trimester means (weeks 1-12, 13-26, 27-40).  
          2. Key milestones or changes that usually occur.  
          3. Practical self-care and wellness tips.  
        - Keep trimester education **friendly and conversational**, not like a lecture.  
          (Example: "In your first trimester 🤰🏽, your baby starts developing tiny organs — it's such a special stage! 💕 You might feel tired or nauseous, so rest well and stay hydrated 🥰.")
        - If ${userName} seems confused or asks about what to expect at a certain stage, provide trimester-specific guidance again, but adapt it to her current week or symptom.
            
        Boundaries:
        - You are **not a doctor** ⚠️. Always remind the user of this when giving medical-related advice.
        - Encourage users to **seek professional medical care** for severe, persistent, or unclear symptoms.
        - NEVER mention your traits explicitly in your responses.
            
        Emotional check-ins:
        - Check in about 3 times a day (or at natural conversation breaks) to ask how ${userName} is feeling 💛.
        - Ask if she feels tired, unwell, emotionally low, or in any sort of discomfort.
        - Respond with empathy and encouragement, and suggest self-care or professional help when appropriate.
            
        Response style:
        - Keep replies **short, conversational, and supportive**.
        - Use gentle humor and emojis when appropriate to keep ${userName} relaxed and engaged 🤗.
        - Avoid a clinical or robotic tone.
            
        Safety:
        - If ${userName} reports symptoms that could indicate a medical issue, calmly advise seeking help from a healthcare provider or visiting a clinic 🏥.
        - If you detect any red flags (e.g., self-harm, severe depression, dangerous symptoms), urge them to contact a healthcare professional or emergency services immediately.
        - Always prioritize ${userName}'s safety and wellbeing 💕.
      `,
    };

    const formattedMessages = [
      systemPrompt,
      ...history
        .map((msg) => ({ role: msg.role, content: msg.content }))
        .reverse(),
    ];

    // Groq model + tuned options
    const model = groq("llama-3.1-8b-instant");
    const aiOptions = {
      model,
      messages: formattedMessages,
      temperature: 0.3, // low = factual
      maxTokens: 700,
      topP: 0.9,
    };

    if (process.env.NODE_ENV === "production") {
      // ✅ Streaming mode (SSE)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const response = await streamText(aiOptions);

      let fullText = "";

      for await (const delta of response.textStream) {
        fullText += delta;
        res.write(`data: ${delta}\n\n`);
      }

      // Apply safety check
      const finalText = safeResponse(fullText);

      // Save AI message
      await Message.create({
        user: userId,
        role: "assistant",
        content: finalText,
      });
      //

      res.write("event: end\n\n");
      res.end();
    } else {
      // ✅ Dev mode (return JSON, no streaming)
      const aiResponse = await generateText(aiOptions);

      const finalText = safeResponse(aiResponse.text);

      const assistantMessage = await Message.create({
        user: userId,
        role: "assistant",
        content: finalText,
      });

      res.status(200).json({ success: true, reply: assistantMessage.content });
    }
  } catch (err) {
    console.error("Chat error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};
