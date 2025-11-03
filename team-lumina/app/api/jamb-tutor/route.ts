import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// The API uses 'option' (singular) and the value can be null.
interface AlocQuestion {
  id: number;
  question: string;
  option: { [key: string]: string | null };
  answer: string;
  solution?: string;
  section: string;
}

export async function POST(request: NextRequest) {
  try {
    const { question: userQuery, userProfile } = await request.json();
    console.log("--- NEW JAMB TUTOR REQUEST ---");
    console.log("User Query:", userQuery);

    // 1. Parse the user's query to find keywords
    const lowerQuery = userQuery.toLowerCase();
    const queryParts = lowerQuery.split(" ");

    const subjectMatch = queryParts.find((p: string) =>
      [
        "chemistry",
        "physics",
        "biology",
        "mathematics",
        "english",
        "crk",
      ].includes(p)
    );
    const yearMatch = queryParts.find(
      (p: string) => !isNaN(parseInt(p)) && p.length === 4
    );

    let questionNumberMatch: string | null = null;
    const qKeywords = ["question", "q", "number", "no", "no."];
    for (let i = 0; i < queryParts.length - 1; i++) {
      if (qKeywords.includes(queryParts[i])) {
        const num = queryParts[i + 1].replace(/[.,]/g, "");
        if (!isNaN(parseInt(num))) {
          questionNumberMatch = num;
          break;
        }
      }
    }

    console.log("Parsed Details:", {
      subjectMatch,
      yearMatch,
      questionNumberMatch,
    });

    let retrievedQuestion: AlocQuestion | null = null;
    let prompt;

    // 2. Retrieve the question from the live API if keywords are found
    if (subjectMatch && yearMatch && questionNumberMatch) {
      // Use 'utme' for JAMB questions
      const apiUrl = `https://questions.aloc.com.ng/api/v2/m?subject=${subjectMatch}&year=${yearMatch}&type=utme`;
      const apiToken = process.env.ALOC_API_TOKEN;

      if (!apiToken) {
        throw new Error("ALOC_API_TOKEN is not set in environment variables.");
      }

      console.log("Fetching from ALOC API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          AccessToken: apiToken,
          Accept: "application/json",
        },
      });

      console.log("ALOC API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`ALOC API Error: ${response.statusText}`, errorData);
        prompt = `You are a JAMB UTME tutor. The user asked for a question but there was an error fetching it from the database: "${errorData.error}". The request was for ${subjectMatch} ${yearMatch} question ${questionNumberMatch}. Politely inform the user that you couldn't retrieve questions for that specific subject or year and ask them to try another.`;
      } else {
        const responseData = await response.json();
        const allQuestions: AlocQuestion[] = responseData.data;

        if (!Array.isArray(allQuestions)) {
          console.error(
            "API did not return an array of questions in the 'data' property.",
            responseData
          );
          prompt = `You are a JAMB UTME tutor. I received an unexpected response from the question database for ${subjectMatch} ${yearMatch}. Please ask the user to try again shortly.`;
        } else {
          console.log(`Found ${allQuestions.length} questions from API.`);

          const questionIndex = parseInt(questionNumberMatch) - 1;
          console.log(`Attempting to get question at index: ${questionIndex}`);

          if (questionIndex >= 0 && questionIndex < allQuestions.length) {
            retrievedQuestion = allQuestions[questionIndex];
            console.log(
              "Successfully retrieved question:",
              retrievedQuestion.id
            );
          } else {
            console.log("Question index is out of bounds.");
          }
        }
      }
    }

    // 3. Augment the prompt and Generate the response
    if (retrievedQuestion) {
      console.log("Building prompt for retrieved question...");
      const optionsString = retrievedQuestion.option
        ? Object.entries(retrievedQuestion.option)
            .map(([key, value]) => `${key.toUpperCase()}. ${value || ""}`)
            .join("\n")
        : "No options provided.";

      prompt = `You are a world-class JAMB UTME tutor. A student has asked for a specific past question which has been retrieved from a live database.
      
      Student Profile:
      - Name: ${userProfile.name}
      - Interests: ${userProfile.interests?.join(", ") || "Not specified"}

      Retrieved Past Question Details:
      - Subject: ${subjectMatch}
      - Year: ${yearMatch}
      - Question Number: ${questionNumberMatch}
      - Question: "${retrievedQuestion.question}"
      - Options:\n${optionsString}
      - Correct Answer: ${retrievedQuestion.answer}
      
      Task:
      1. First, state the full question and options clearly for the student.
      2. Provide the correct answer.
      3. Most importantly, give a detailed, step-by-step explanation of the underlying concept. **If possible, try to relate the explanation to one of the student's interests to make it more engaging.** For example, if the interest is 'music' and the topic is 'physics', you could use an analogy of sound waves from a guitar.
      4. Maintain an encouraging and helpful tone. Format your response clearly with paragraphs and lists.`;
    } else {
      console.log("Building 'question not found' prompt...");
      prompt = `You are a world-class JAMB UTME tutor AI with a live database of past questions. The user sent a message: "${userQuery}".
      
      You could not find a specific past question matching their request. This might be because the year, subject, or question number is incorrect, not in the database, or there was an API error.
      
      Task:
      - Politely inform the student that you couldn't find that exact question.
      - Suggest they check the subject, year, and question number for typos (e.g., "chemistry 2019 question 6").
      - Offer to help with a topic in a general sense if they provide the question text or describe the topic.
      - Maintain a helpful and conversational tone.`;
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in JAMB Tutor API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to get tutor response", details: errorMessage },
      { status: 500 }
    );
  }
}
