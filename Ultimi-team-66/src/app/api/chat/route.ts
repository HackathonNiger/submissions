import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
let chatHistory: { role: "user" | "bot"; text: string }[] = [];

// 🔍 Simple text-type analyzer
function detectResponseType(text: string) {
  const lower = text.toLowerCase();

  // Quiz detection
  if (
    /(question\s*\d+|options?:|a\.|b\.|multiple choice|quiz)/i.test(lower)
  ) {
    return "quiz";
  }

  // Summary / Notes
  if (
    /(summary|key points|in short|main ideas|to summarize)/i.test(lower) ||
    (text.includes("•") || text.includes("- ")) && text.length < 800
  ) {
    return "summary";
  }

  // Flashcards
  if (
    /(term:|definition:|flashcard|front:|back:)/i.test(lower) ||
    (text.includes(":") && text.split("\n").length <= 10)
  ) {
    return "flashcard";
  }

  // Comparison
  if (
    /(difference between|compare|contrast|vs|versus)/i.test(lower) ||
    text.includes("|")
  ) {
    return "comparison";
  }

  // Letter or Document
  if (
    /(dear|sincerely|faithfully|yours truly|to whom it may concern)/i.test(
      lower
    )
  ) {
    return "letter";
  }

  // Study / Explanation
  if (
    /(explain|definition of|how does|types of|what is)/i.test(lower)
  ) {
    return "explanation";
  }

  return "general";
}

// ✨ Response formatter — adds emojis, headings, spacing, and Markdown style
// function organiseResponse(reply: string, type: string) {
//   let formatted = reply.trim();

//   // Add extra formatting depending on detected type
//   switch (type) {
//     case "explanation":
//       formatted = `👋 **Hey there!**  
// I'm **ULTIMI AI**, here to break this down for you. 💡  

// ${formatted
//   .replace(/\*\*/g, "**") // keep bolds safe
//   .replace(/(^|\n)([A-Z][a-z]+:)/g, "\n\n**$2**")}  

// ✨ That’s the full breakdown! Want me to summarize it next?`;
//       break;

//     case "summary":
//       formatted = `📝 **Summary**  
// ${formatted
//   .replace(/(^|\n)[•\-]\s*/g, "\n✅ ")
//   .replace(/(\n\s*)+/g, "\n\n")}  

// 💡 *These are the main takeaways!*`;
//       break;

//     case "quiz":
//       formatted = formatted
//         .replace(/question\s*(\d+)/gi, "**Question $1:**")
//         .replace(/\b([A-D])\./g, "- **$1.**");
//       break;

//     case "comparison":
//       formatted = `⚖️ **Comparison Insight**  
// ${formatted
//   .replace(/\|/g, " | ")
//   .replace(/\*\*/g, "**")}  

// 🔍 *Spot the key differences above!*`;
//       break;

//     case "flashcard":
//       formatted = `🧠 **Flashcards**  
// ${formatted
//   .replace(/term:/gi, "📘 **Term:**")
//   .replace(/definition:/gi, "📖 **Definition:**")}  

// 💡 *Use these to test yourself later!*`;
//       break;

//     case "letter":
//       formatted = `✉️ **Letter Draft**  
// ${formatted
//   .replace(/(dear|to whom it may concern)/gi, "**$1**")
//   .replace(/(sincerely|faithfully|yours truly)/gi, "\n\n**$1,**")}  

// 📧 *Ready to send or tweak? Let me know!*`;
//       break;

//     default:
//       formatted = `🤖 **ULTIMI AI says:**  
// ${formatted
//   .replace(/(^|\n)([A-Z][a-z]+:)/g, "\n\n**$2**")
//   .replace(/\n{3,}/g, "\n\n")}  

// ✨ *Hope that helps!*`;
//   }

//   return formatted;
// }

function organiseResponse(reply: string, type: string) {
  let formatted = reply.trim();

  switch (type) {
    case "explanation":
      formatted = `💡 **Explanation:**  

${formatted
  .replace(/\*\*/g, "**")
  .replace(/(^|\n)([A-Z][a-z]+:)/g, "\n\n**$2**")}  

📘 *Let me know if you'd like this simplified or turned into notes.*`;
      break;

    case "summary":
      formatted = `📝 **Summary:**  

${formatted
  .replace(/(^|\n)[•\-]\s*/g, "\n✅ ")
  .replace(/(\n\s*)+/g, "\n\n")}  

💡 *These are the main ideas to focus on.*`;
      break;

    case "quiz":
      formatted = formatted
        .replace(/question\s*(\d+)/gi, "**Question $1:**")
        .replace(/\b([A-D])\./g, "- **$1.**");
      break;

    case "comparison":
      formatted = `⚖️ **Comparison:**  

${formatted
  .replace(/\|/g, " | ")
  .replace(/\*\*/g, "**")}  

🔍 *Here’s how they differ and relate.*`;
      break;

    case "flashcard":
      formatted = `🧠 **Flashcards:**  

${formatted
  .replace(/term:/gi, "📘 **Term:**")
  .replace(/definition:/gi, "📖 **Definition:**")}  

✨ *A quick way to test your recall.*`;
      break;

    case "letter":
      formatted = `✉️ **Letter Draft:**  

${formatted
  .replace(/(dear|to whom it may concern)/gi, "**$1**")
  .replace(/(sincerely|faithfully|yours truly)/gi, "\n\n**$1,**")}  

📩 *Edit this before sending if needed.*`;
      break;

    default:
      formatted = `💬 **Response:**  

${formatted
  .replace(/(^|\n)([A-Z][a-z]+:)/g, "\n\n**$2**")
  .replace(/\n{3,}/g, "\n\n")}  

✨ *Would you like me to expand or summarize this?*`;
  }

  return formatted;
}


export async function POST(req: Request) {
  try {
    const { message, files, description, reset } = await req.json();

    if (reset) {
      chatHistory = [];
      return NextResponse.json({ reply: "Chat reset successfully ✅" });
    }

    const appRoutes = [
      "/",
      "/dashboard",
      "/settings",
      "/profile",
      "/projects",
      "/Chatbot",
      "/about",
    ];

    const moods = {
      friendly: [
        "Sure thing! Let's look at that together.",
        "Of course! That's a nice one.",
        "Definitely — I like where this is going!",
        "Absolutely! Let's keep this simple and clear.",
        "Great! Let's explore that in a friendly way.",
      ],
      curious: [
        "That's a fascinating question!",
        "Interesting! Let's dig a little deeper.",
        "Hmm, I love questions like this!",
        "Ooh, this sounds intriguing — let's break it down.",
      ],
      encouraging: [
        "Nice one! You're doing great asking this.",
        "Brilliant question — let's unpack it together.",
        "Love that curiosity! Here's what to know:",
        "Fantastic — let's make this super easy to grasp.",
      ],
    } as const;

    const randomMood = Object.values(moods)[Math.floor(Math.random() * 3)];
    const randomIntro =
      randomMood[Math.floor(Math.random() * randomMood.length)];

    const systemPrompt = `
You are **ULTIMI Ai**, a smart, friendly academic assistant created by **Ultimi**.
You are built for learning, explanations, quizzing, and summaries — not for casual chat.
Keep responses clear, accurate, and formatted neatly in Markdown if helpful.

When answering questions or talking, make use of various emojis.

For quizzes, format like this:
**Question 1:** What is X?
- A. Option 1
- B. Option 2
- C. Option 3
- D. Option 4

**Question 2:** ...

(Format each question clearly with A/B/C/D options.)

When checking individual quiz question answers, provide:
**Correct/Incorrect:** Yes or No
**Explanation:** Brief, clear explanation of why the answer is correct or incorrect, and what the right answer is if wrong.

When checking final quiz results, always include:
1. **Score**: X out of Y correct
2. **Percentage**: Z%
3. **Grade**: Letter grade (A/B/C/D/F)
4. **Detailed Feedback**: For each question, indicate correct/incorrect with explanations
5. **Encouragement**: Positive, personalized message based on performance
`;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [{ text: systemPrompt }];

    for (const msg of chatHistory) {
      contents.push({
        text: `${msg.role === "user" ? "User" : "Ultimi Ai"}: ${msg.text}`,
      });
    }

    if (files?.length) {
      const fileParts = files.map((file: { base64: string; mimeType: string }) => ({
        inlineData: { data: file.base64, mimeType: file.mimeType },
      }));
      contents.push({
        text: `User sent file${files.length > 1 ? "s" : ""}. ${
          description ? "Description: " + description : ""
        }`,
      });
      contents.push(...fileParts);
    } else if (message) {
      contents.push({ text: `User: ${message}` });
    }

    // 🚀 Get AI reply
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const reply = response.text?.trim() || "No reply from AI.";

    // 🎯 Analyze response type automatically
    const type = detectResponseType(reply);
    const formattedReply = organiseResponse(reply, type);

    // 🧭 Detect route navigation
    let action = null;
    const lowerMsg = message?.toLowerCase();
    if (lowerMsg) {
      const foundRoute = appRoutes.find((r) =>
        lowerMsg.includes(r.replace("/", "").toLowerCase())
      );
      if (
        foundRoute &&
        /(open|go to|navigate|show|take me to)/.test(lowerMsg)
      ) {
        action = `navigate:${foundRoute}`;
      }
    }

    // 💾 Save chat memory
    if (message || description)
      chatHistory.push({ role: "user", text: message || description });
    chatHistory.push({ role: "bot", text: formattedReply });
    if (chatHistory.length > 40) chatHistory.splice(0, chatHistory.length - 40);

    // 🧩 Return type along with reply
    return NextResponse.json({ reply: formattedReply, type, action });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ reply: "Error: Could not get response." });
  }
}